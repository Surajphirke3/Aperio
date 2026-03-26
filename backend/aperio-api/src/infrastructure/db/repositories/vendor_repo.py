import logging

from src.infrastructure.db.mongo import vendors_col

logger = logging.getLogger(__name__)


class VendorRepository:
    async def list_all(self) -> list[dict]:
        try:
            cursor = vendors_col().find().sort("name", 1)
            return await cursor.to_list(length=100)
        except Exception as e:
            logger.warning(f"Mongo vendor list_all failed: {e}")
            return []
