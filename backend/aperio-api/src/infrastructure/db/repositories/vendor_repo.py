import logging

from src.infrastructure.db.mongo import vendors_col

logger = logging.getLogger(__name__)


class VendorRepository:
    async def list_all(self) -> list[dict]:
        try:
            cursor = vendors_col().find().sort("name", 1)
            docs = await cursor.to_list(length=100)
            for doc in docs:
                if "_id" in doc:
                    doc["id"] = str(doc.pop("_id"))
            return docs
        except Exception as e:
            logger.warning(f"Mongo vendor list_all failed: {e}")
            return []
