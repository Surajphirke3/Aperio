from src.infrastructure.db.mongo import vendors_col


class VendorRepository:
    async def list_all(self) -> list[dict]:
        cursor = vendors_col().find().sort("name", 1)
        return await cursor.to_list(length=100)
