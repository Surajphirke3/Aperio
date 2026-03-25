import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.async_client import AsyncClient
from src.config.settings import settings
from datetime import datetime


def _init_firebase() -> AsyncClient:
    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.firebase_credentials_path)
        firebase_admin.initialize_app(cred)
    return firestore.AsyncClient(project=settings.firebase_project_id)


_db: AsyncClient | None = None


def get_firestore() -> AsyncClient:
    global _db
    if _db is None:
        _db = _init_firebase()
    return _db


class FirestoreDB:
    def __init__(self):
        self.db = get_firestore()

    async def create_entry(self, data: dict) -> dict:
        data["created_at"] = datetime.utcnow().isoformat()
        ref = self.db.collection("material_entries").document()
        await ref.set(data)
        return {"id": ref.id, **data}

    async def query_stats(self, filters: dict) -> dict:
        """Flexible aggregation query based on extracted filter struct."""
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
        docs = await self.db.collection("material_entries") \
            .order_by("created_at", direction="DESCENDING") \
            .limit(limit).get()
        return [{"id": d.id, **d.to_dict()} for d in docs]

    async def get_batch_by_id(self, batch_id: str) -> dict | None:
        doc = await self.db.collection("material_entries").document(batch_id).get()
        if doc.exists:
            return {"id": doc.id, **doc.to_dict()}
        return None

    async def get_dashboard_stats(self) -> dict:
        """Aggregated KPIs for the dashboard."""
        docs = await self.db.collection("material_entries").get()
        entries = [d.to_dict() for d in docs]

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
        docs = await self.db.collection("material_entries").get()
        vendors: dict[str, dict] = {}
        for d in docs:
            entry = d.to_dict()
            vendor = entry.get("vendor")
            if vendor and vendor not in vendors:
                vendors[vendor] = {
                    "name": vendor,
                    "total_kg": 0.0,
                    "entry_count": 0,
                }
            if vendor:
                vendors[vendor]["total_kg"] += entry.get("quantity_kg", 0)
                vendors[vendor]["entry_count"] += 1
        return list(vendors.values())