from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import Optional
from datetime import date
from src.infrastructure.database.models import BatchORM, BatchLifecycleORM, EntryORM
from src.domain.chat.models import ParsedEntry, QueryFilter


class BatchRepository:
    """CRUD operations for batches."""

    def __init__(self, db: Session):
        self.db = db

    def create_entry(self, entry: ParsedEntry) -> dict:
        """Persist a parsed entry to the database."""
        from datetime import datetime

        db_entry = EntryORM(
            batch_id=entry.batch_id,
            intent=entry.intent.value,
            material=entry.material.value,
            quantity_kg=entry.quantity_kg,
            date=entry.date,
            vendor=entry.vendor,
            stage=entry.stage.value if entry.stage else None,
            loss_kg=entry.loss_kg,
            raw_input=entry.raw_input,
            created_at=datetime.utcnow(),
        )
        self.db.add(db_entry)
        self.db.commit()
        self.db.refresh(db_entry)

        return {
            "id": db_entry.id,
            "batch_id": entry.batch_id,
            "material": entry.material.value,
            "quantity_kg": entry.quantity_kg,
            "date": str(entry.date),
            "vendor": entry.vendor,
        }

    def get_batch(self, batch_id: str) -> dict | None:
        """Retrieve a batch by ID with its lifecycle."""
        batch = self.db.query(BatchORM).filter(BatchORM.id == batch_id).first()
        if not batch:
            return None

        lifecycle = [
            {
                "stage": lc.stage,
                "quantity_kg": lc.quantity_kg,
                "loss_kg": lc.loss_kg,
                "timestamp": lc.timestamp.isoformat() if lc.timestamp else None,
            }
            for lc in batch.lifecycle
        ]

        return {
            "id": batch.id,
            "material": batch.material,
            "vendor": batch.vendor,
            "initial_quantity_kg": batch.initial_quantity_kg,
            "current_stage": batch.current_stage,
            "created_at": batch.created_at.isoformat() if batch.created_at else None,
            "stages": lifecycle,
        }

    def list_batches(
        self,
        skip: int = 0,
        limit: int = 100,
        material_type: Optional[str] = None,
        stage: Optional[str] = None,
        vendor: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> list[dict]:
        """List batches with optional filters and pagination."""
        query = self.db.query(BatchORM)

        # Apply filters
        if material_type:
            query = query.filter(BatchORM.material == material_type)
        if vendor:
            query = query.filter(BatchORM.vendor == vendor)
        if start_date:
            query = query.filter(BatchORM.created_at >= start_date)
        if end_date:
            query = query.filter(BatchORM.created_at <= end_date)
        if stage:
            query = query.filter(BatchORM.current_stage == stage)

        batches = query.offset(skip).limit(limit).all()

        return [
            {
                "id": b.id,
                "material": b.material,
                "vendor": b.vendor,
                "initial_quantity_kg": b.initial_quantity_kg,
                "current_stage": b.current_stage,
                "created_at": b.created_at.isoformat() if b.created_at else None,
            }
            for b in batches
        ]

    def query_stats(self, filters: QueryFilter) -> dict:
        """Execute aggregation queries based on filters."""
        query = self.db.query(BatchORM)

        if filters.material_type:
            query = query.filter(BatchORM.material == filters.material_type)
        if filters.vendor:
            query = query.filter(BatchORM.vendor == filters.vendor)
        if filters.start_date:
            query = query.filter(BatchORM.created_at >= filters.start_date)
        if filters.end_date:
            query = query.filter(BatchORM.created_at <= filters.end_date)

        if filters.metric == "total_quantity":
            result = query.with_entities(func.sum(BatchORM.initial_quantity_kg)).scalar()
            return {"metric": "total_quantity", "value": round(result or 0, 2)}
        elif filters.metric == "count":
            result = query.count()
            return {"metric": "count", "value": result}
        elif filters.metric == "avg_loss":
            # Calculate average loss from lifecycle
            lifecycle_query = self.db.query(BatchLifecycleORM).join(BatchORM)
            if filters.material_type:
                lifecycle_query = lifecycle_query.filter(BatchORM.material == filters.material_type)
            total_loss = lifecycle_query.with_entities(func.sum(BatchLifecycleORM.loss_kg)).scalar() or 0
            total_qty = lifecycle_query.with_entities(func.sum(BatchLifecycleORM.quantity_kg)).scalar() or 0
            avg_loss = (total_loss / total_qty * 100) if total_qty > 0 else 0
            return {"metric": "avg_loss", "value": round(avg_loss, 2)}
        else:
            return {"metric": filters.metric, "value": 0}
