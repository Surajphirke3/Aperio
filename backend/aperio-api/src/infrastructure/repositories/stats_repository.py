from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from src.infrastructure.database.models import BatchORM, BatchLifecycleORM, VendorORM

CARBON_FACTORS: dict[str, float] = {
    "PET": 2.15,
    "HDPE": 1.97,
    "LDPE": 2.01,
    "PP": 1.89,
    "PS": 2.23,
}

STAGE_ORDER = ["collection", "sorting", "washing", "shredding", "melting", "pelletizing", "dispatch"]


class StatsRepository:
    """Aggregation queries for dashboard statistics."""

    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_stats(self) -> dict:
        """Get overall dashboard statistics."""
        total_batches = self.db.query(func.count(BatchORM.id)).scalar() or 0
        total_quantity = self.db.query(func.sum(BatchORM.initial_quantity_kg)).scalar() or 0.0
        active_vendors = self.db.query(func.count(distinct(BatchORM.vendor))).scalar() or 0

        # Get total loss and output from lifecycle
        total_loss = self.db.query(func.sum(BatchLifecycleORM.loss_kg)).scalar() or 0.0
        total_lifecycle_qty = self.db.query(func.sum(BatchLifecycleORM.quantity_kg)).scalar() or 0.0
        avg_loss_pct = (total_loss / total_lifecycle_qty * 100) if total_lifecycle_qty > 0 else 0.0

        # Dispatched = quantity at last stage (dispatch or pelletizing)
        total_dispatched = 0.0
        dispatch_stages = self.db.query(BatchLifecycleORM).filter(
            BatchLifecycleORM.stage.in_(["dispatch", "pelletizing"])
        ).all()
        for s in dispatch_stages:
            total_dispatched += (s.quantity_kg - s.loss_kg)

        efficiency_pct = (total_dispatched / total_quantity * 100) if total_quantity > 0 else 0.0

        # Carbon saved
        carbon_saved = 0.0
        batches = self.db.query(BatchORM).all()
        for batch in batches:
            factor = CARBON_FACTORS.get(batch.material, 2.0)
            last_lc = self.db.query(BatchLifecycleORM).filter(
                BatchLifecycleORM.batch_id == batch.id
            ).order_by(BatchLifecycleORM.timestamp.desc()).first()
            output_kg = (last_lc.quantity_kg - last_lc.loss_kg) if last_lc else 0.0
            carbon_saved += output_kg * factor

        # Anomaly count
        anomaly_count = 0
        all_lifecycle = self.db.query(BatchLifecycleORM).all()
        for lc in all_lifecycle:
            if lc.quantity_kg > 0:
                loss_pct = (lc.loss_kg / lc.quantity_kg) * 100
                if loss_pct > 15:
                    anomaly_count += 1

        # Completeness: batches with >=3 stages
        complete = 0
        for batch in batches:
            stage_count = self.db.query(func.count(BatchLifecycleORM.id)).filter(
                BatchLifecycleORM.batch_id == batch.id
            ).scalar() or 0
            if stage_count >= 3:
                complete += 1
        completeness_score = round((complete / total_batches * 100) if total_batches > 0 else 0)

        material_breakdown = self.get_material_breakdown()

        return {
            "total_batches": total_batches,
            "total_quantity_kg": round(total_quantity, 2),
            "total_received_kg": round(total_quantity, 2),
            "total_dispatched_kg": round(total_dispatched, 2),
            "efficiency_pct": round(efficiency_pct, 1),
            "carbon_saved_kg": round(carbon_saved, 2),
            "active_batches": total_batches,
            "alert_count": anomaly_count,
            "completeness_score": completeness_score,
            "avg_loss_pct": round(avg_loss_pct, 2),
            "active_vendors": active_vendors,
            "material_breakdown": material_breakdown,
        }

    def get_sankey_data(self) -> dict:
        """Get Sankey diagram data for material flow visualization."""
        stage_agg: dict[str, dict[str, float]] = {}

        all_lifecycle = self.db.query(BatchLifecycleORM).all()
        for lc in all_lifecycle:
            stage = lc.stage
            if stage not in stage_agg:
                stage_agg[stage] = {"input": 0.0, "output": 0.0, "loss": 0.0}
            stage_agg[stage]["input"] += lc.quantity_kg
            stage_agg[stage]["loss"] += lc.loss_kg
            stage_agg[stage]["output"] += (lc.quantity_kg - lc.loss_kg)

        # Build nodes
        nodes: list[dict] = []
        links: list[dict] = []

        ordered = [s for s in STAGE_ORDER if s in stage_agg]

        for stage in ordered:
            agg = stage_agg[stage]
            nodes.append({"id": stage, "name": stage.capitalize(), "value": round(agg["input"], 2)})
            if agg["loss"] > 0:
                loss_id = f"{stage}_loss"
                nodes.append({"id": loss_id, "name": f"{stage.capitalize()} Loss", "value": round(agg["loss"], 2)})

        # Build links between consecutive stages + loss branches
        for i, stage in enumerate(ordered):
            agg = stage_agg[stage]
            # Loss branch
            if agg["loss"] > 0:
                links.append({"source": stage, "target": f"{stage}_loss", "value": round(agg["loss"], 2)})
            # Flow to next stage
            if i + 1 < len(ordered):
                next_stage = ordered[i + 1]
                links.append({"source": stage, "target": next_stage, "value": round(agg["output"], 2)})

        return {"nodes": nodes, "links": links}

    def get_stage_breakdown(self) -> list[dict]:
        """Get quantity and loss breakdown by processing stage."""
        results = self.db.query(
            BatchLifecycleORM.stage,
            func.sum(BatchLifecycleORM.quantity_kg).label("quantity_kg"),
            func.sum(BatchLifecycleORM.loss_kg).label("loss_kg"),
        ).group_by(BatchLifecycleORM.stage).all()

        return [
            {
                "stage": r.stage,
                "quantity_kg": round(r.quantity_kg, 2),
                "loss_kg": round(r.loss_kg, 2),
                "loss_pct": round((r.loss_kg / r.quantity_kg * 100) if r.quantity_kg > 0 else 0, 2),
            }
            for r in results
        ]

    def get_material_breakdown(self) -> list[dict]:
        """Get quantity breakdown by material type."""
        results = self.db.query(
            BatchORM.material,
            func.sum(BatchORM.initial_quantity_kg).label("quantity_kg"),
            func.count(BatchORM.id).label("count"),
        ).group_by(BatchORM.material).all()

        return [
            {"material": r.material, "quantity_kg": round(r.quantity_kg, 2), "count": r.count}
            for r in results
        ]

    def get_loss_by_stage(self) -> list[dict]:
        """Get loss percentage per processing stage."""
        results = self.db.query(
            BatchLifecycleORM.stage,
            func.avg(
                func.case(
                    (BatchLifecycleORM.quantity_kg > 0,
                     BatchLifecycleORM.loss_kg / BatchLifecycleORM.quantity_kg * 100),
                    else_=0
                )
            ).label("avg_loss_pct"),
        ).group_by(BatchLifecycleORM.stage).all()

        return [
            {"stage": r.stage, "avg_loss_pct": round(float(r.avg_loss_pct), 2)}
            for r in results
        ]
