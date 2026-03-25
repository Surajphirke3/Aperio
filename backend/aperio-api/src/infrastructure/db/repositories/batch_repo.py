from src.infrastructure.db.firestore import FirestoreDB


class BatchRepository:
    """Thin wrapper over FirestoreDB for batch-specific operations."""

    def __init__(self):
        self.db = FirestoreDB()

    async def get_all(self, limit: int = 50) -> list[dict]:
        return await self.db.get_batches(limit=limit)

    async def get_by_id(self, batch_id: str) -> dict | None:
        return await self.db.get_batch_by_id(batch_id)

    async def get_stats(self) -> dict:
        return await self.db.get_dashboard_stats()