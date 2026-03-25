import json
import logging
from datetime import datetime
from fnmatch import fnmatch
from pathlib import Path
from uuid import uuid4

import firebase_admin
from firebase_admin import credentials, firestore

from src.config.settings import settings

logger = logging.getLogger(__name__)

_db = None
_init_attempted = False
_data_file = Path(__file__).resolve().parents[3] / ".local_data" / "material_entries.json"


def _init_firebase():
    global _init_attempted
    _init_attempted = True
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate(settings.firebase_credentials_path)
            firebase_admin.initialize_app(cred)
        return firestore.AsyncClient(project=settings.firebase_project_id)
    except Exception as e:
        logger.warning(f"Firebase init failed: {e}. Running in degraded mode.")
        return None


def get_firestore():
    global _db
    if _db is None and not _init_attempted:
        _db = _init_firebase()
    return _db


class FirestoreDB:
    def __init__(self):
        self.db = get_firestore()
        self._use_local_store = self.db is None

    def _ensure_local_store(self) -> None:
        _data_file.parent.mkdir(parents=True, exist_ok=True)
        if not _data_file.exists():
            _data_file.write_text("[]", encoding="utf-8")

    def _read_local_entries(self) -> list[dict]:
        self._ensure_local_store()
        raw = _data_file.read_text(encoding="utf-8").strip() or "[]"
        try:
            entries = json.loads(raw)
        except json.JSONDecodeError:
            entries = []
        return entries if isinstance(entries, list) else []

    def _write_local_entries(self, entries: list[dict]) -> None:
        self._ensure_local_store()
        _data_file.write_text(json.dumps(entries, indent=2), encoding="utf-8")

    @staticmethod
    def _parse_datetime(value: str | None) -> datetime:
        if not value:
            return datetime.min
        normalized = value.replace("Z", "+00:00")
        try:
            return datetime.fromisoformat(normalized)
        except ValueError:
            return datetime.min

    @staticmethod
    def _matches_date_range(entry: dict, date_from: str | None, date_to: str | None) -> bool:
        entry_date = FirestoreDB._parse_datetime(entry.get("date") or entry.get("created_at"))
        if date_from and entry_date < FirestoreDB._parse_datetime(date_from):
            return False
        if date_to and entry_date > FirestoreDB._parse_datetime(date_to):
            return False
        return True

    def _query_local_entries(self, filters: dict | None = None) -> list[dict]:
        filters = filters or {}
        entries = self._read_local_entries()

        def matches(entry: dict) -> bool:
            metric = filters.get("metric")
            material = filters.get("material")
            vendor = filters.get("vendor")
            batch_id = filters.get("batch_id")
            session_id = filters.get("session_id")
            if metric and entry.get("intent") != metric:
                return False
            if material and entry.get("material") != material:
                return False
            if vendor and entry.get("vendor") != vendor:
                return False
            if batch_id and entry.get("batch_id") != batch_id and entry.get("id") != batch_id:
                return False
            if session_id and entry.get("session_id") != session_id:
                return False
            if not self._matches_date_range(entry, filters.get("date_from"), filters.get("date_to")):
                return False
            return True

        return [entry for entry in entries if matches(entry)]

    async def create_entry(self, data: dict) -> dict:
        payload = {**data, "created_at": datetime.utcnow().isoformat()}
        if self._use_local_store:
            entry_id = payload.get("batch_id") or str(uuid4())
            payload["id"] = entry_id
            entries = self._read_local_entries()
            entries.append(payload)
            self._write_local_entries(entries)
            return payload

        ref = self.db.collection("material_entries").document()
        await ref.set(payload)
        return {"id": ref.id, **payload}

    async def query_stats(self, filters: dict) -> dict:
        """Flexible aggregation query based on extracted filter struct."""
        if self._use_local_store:
            entries = self._query_local_entries(filters)
            total_kg = sum(float(e.get("quantity_kg", 0) or 0) for e in entries)
            total_loss = sum(float(e.get("loss_kg", 0) or 0) for e in entries)
            return {
                "count": len(entries),
                "total_kg": round(total_kg, 2),
                "total_loss_kg": round(total_loss, 2),
                "loss_pct": round((total_loss / total_kg * 100) if total_kg else 0, 2),
            }

        collection = self.db.collection("material_entries")
        query = collection

        if metric := filters.get("metric"):
            query = query.where("intent", "==", metric)
        if material := filters.get("material"):
            query = query.where("material", "==", material)
        if vendor := filters.get("vendor"):
            query = query.where("vendor", "==", vendor)

        docs = await query.get()
        entries = [doc.to_dict() for doc in docs]

        total_kg = sum(e.get("quantity_kg", 0) for e in entries)
        total_loss = sum(e.get("loss_kg", 0) or 0 for e in entries)

        return {
            "count": len(entries),
            "total_kg": round(total_kg, 2),
            "total_loss_kg": round(total_loss, 2),
            "loss_pct": round((total_loss / total_kg * 100) if total_kg else 0, 2),
        }

    async def get_batches(self, limit: int = 50) -> list[dict]:
        if self._use_local_store:
            entries = sorted(
                self._read_local_entries(),
                key=lambda entry: self._parse_datetime(entry.get("created_at")),
                reverse=True,
            )
            return entries[:limit]

        docs = await self.db.collection("material_entries") \
            .order_by("created_at", direction="DESCENDING") \
            .limit(limit).get()
        return [{"id": d.id, **d.to_dict()} for d in docs]

    async def get_batch_by_id(self, batch_id: str) -> dict | None:
        if self._use_local_store:
            for entry in self._read_local_entries():
                if entry.get("id") == batch_id or entry.get("batch_id") == batch_id:
                    return entry
            return None

        doc = await self.db.collection("material_entries").document(batch_id).get()
        if doc.exists:
            return {"id": doc.id, **doc.to_dict()}
        return None

    async def get_dashboard_stats(self) -> dict:
        """Aggregated KPIs for the dashboard."""
        if self._use_local_store:
            entries = self._read_local_entries()
        else:
            docs = await self.db.collection("material_entries").get()
            entries = [{"id": d.id, **d.to_dict()} for d in docs]

        by_material: dict[str, float] = {}
        by_stage: dict[str, float] = {}
        total_dispatched = 0.0

        for e in entries:
            mat = e.get("material", "unknown")
            qty = e.get("quantity_kg", 0)
            by_material[mat] = by_material.get(mat, 0) + qty

            stage = e.get("stage", "unknown")
            by_stage[stage] = by_stage.get(stage, 0) + qty

            if e.get("intent") == "dispatch":
                total_dispatched += qty

        return {
            "total_entries": len(entries),
            "by_material": by_material,
            "by_stage": by_stage,
            "total_dispatched_kg": round(total_dispatched, 2),
        }

    async def get_vendors(self) -> list[dict]:
        """Get unique vendors from material entries."""
        vendors: dict[str, dict] = {}
        if self._use_local_store:
            entries = self._read_local_entries()
        else:
            docs = await self.db.collection("material_entries").get()
            entries = [{"id": d.id, **d.to_dict()} for d in docs]

        for entry in entries:
            vendor = entry.get("vendor")
            if vendor and vendor not in vendors:
                vendors[vendor] = {
                    "id": vendor.lower().replace(" ", "-"),
                    "name": vendor,
                    "total_kg": 0.0,
                    "entry_count": 0,
                }
            if vendor:
                vendors[vendor]["total_kg"] += entry.get("quantity_kg", 0)
                vendors[vendor]["entry_count"] += 1
        return list(vendors.values())

    async def get_sankey_data(self) -> dict:
        entries = await self.get_batches(limit=500)
        stage_order = ["collection", "sorting", "processing", "output", "dispatch"]
        stage_labels = {
            "collection": "Collection",
            "sorting": "Sorting",
            "processing": "Processing",
            "output": "Output",
            "dispatch": "Dispatch",
        }
        nodes = [{"name": stage_labels[stage]} for stage in stage_order]
        links: list[dict] = []

        for index, stage in enumerate(stage_order[:-1]):
            value = sum(
                float(entry.get("quantity_kg", 0) or 0)
                for entry in entries
                if entry.get("stage") == stage or entry.get("intent") == stage
            )
            if value > 0:
                links.append({"source": index, "target": index + 1, "value": round(value, 2)})

        return {"nodes": nodes, "links": links}
