from src.infrastructure.db.repositories.batch_repo import BatchRepository


class BatchService:
    """Batch CRUD + anomaly detection."""

    def __init__(self):
        self.repo = BatchRepository()

    async def get_batches(self, limit: int = 50) -> list[dict]:
        return await self.repo.get_all(limit=limit)

    async def get_batch(self, batch_id: str) -> dict | None:
        return await self.repo.get_by_id(batch_id)

    async def get_dashboard_stats(self) -> dict:
        return await self.repo.get_stats()

    async def get_sankey_data(self) -> dict:
        return await self.repo.get_sankey()

    def detect_anomalies(self, batch: dict) -> list[dict]:
        """Simple anomaly detection based on loss thresholds."""
        anomalies = []
        qty = batch.get("quantity_kg", 0)
        loss = batch.get("loss_kg", 0) or 0

        if qty > 0 and loss > 0:
            loss_pct = (loss / qty) * 100
            if loss_pct > 5.0:
                anomalies.append({
                    "batch_id": batch.get("id", "unknown"),
                    "stage": batch.get("stage", "unknown"),
                    "metric": "loss_percentage",
                    "value": round(loss_pct, 2),
                    "threshold": 5.0,
                    "message": f"High material loss: {loss_pct:.1f}% exceeds 5% threshold",
                })
        return anomalies
