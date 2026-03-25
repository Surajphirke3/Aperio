from typing import Any

from src.infrastructure.db.mongo import batches_col


class BatchRepository:
    async def list(
        self,
        material: str | None = None,
        stage: str | None = None,
        status: str | None = None,
        search: str | None = None,
        limit: int = 50,
    ) -> list[dict]:
        query: dict = {}
        if material:
            query["material"] = {"$regex": material, "$options": "i"}
        if stage:
            query["stage"] = stage
        if status:
            query["status"] = status
        if search:
            query["$or"] = [
                {"id": {"$regex": search, "$options": "i"}},
                {"vendor": {"$regex": search, "$options": "i"}},
            ]

        cursor = batches_col().find(query).sort("created_at", -1).limit(limit)
        return await cursor.to_list(length=limit)

    async def get_by_id(self, batch_id: str) -> dict | None:
        from bson import ObjectId
        try:
            doc = await batches_col().find_one({"_id": ObjectId(batch_id)})
            if doc:
                doc["id"] = str(doc.pop("_id"))
            return doc
        except Exception:
            doc = await batches_col().find_one({"id": batch_id})
            if doc:
                doc.pop("_id", None)
            return doc
