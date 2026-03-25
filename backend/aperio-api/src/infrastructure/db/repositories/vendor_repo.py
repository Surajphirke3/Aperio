from src.infrastructure.db.firestore import FirestoreDB


class VendorRepository:
    """Vendor-specific queries over material entries."""

    def __init__(self):
        self.db = FirestoreDB()

    async def get_all(self) -> list[dict]:
        return await self.db.get_vendors()