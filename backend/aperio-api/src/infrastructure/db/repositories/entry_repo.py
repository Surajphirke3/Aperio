from datetime import datetime
from typing import Any

import logging

from src.infrastructure.db.mongo import entries_col

logger = logging.getLogger(__name__)


class EntryRepository:
    async def create(self, data: dict) -> Any:
        try:
            data["created_at"] = datetime.utcnow().isoformat()
            result = await entries_col().insert_one(data)
            return result
        except Exception as e:
            logger.error(f"Mongo entry create failed: {e}")
            raise

    async def get_with_losses(self, days: int) -> list[dict]:
        from datetime import timedelta
        since = datetime.utcnow() - timedelta(days=days)
        try:
            cursor = entries_col().find({
                "created_at": {"$gte": since.isoformat()},
                "loss_kg": {"$exists": True, "$ne": None},
            })
            docs = await cursor.to_list(length=200)
            for doc in docs:
                if "_id" in doc:
                    doc["id"] = str(doc.pop("_id"))
            return docs
        except Exception as e:
            logger.warning(f"Mongo get_with_losses failed: {e}")
            return []

    async def query_stats(self, filters: dict) -> dict:
        query: dict = {}
        if filters.get("material"):
            query["material"] = filters["material"]
        if filters.get("vendor"):
            query["vendor"] = filters["vendor"]
        if filters.get("stage"):
            query["stage"] = filters["stage"]
        if filters.get("date_from"):
            query.setdefault("created_at", {})["$gte"] = filters["date_from"]
        if filters.get("date_to"):
            query.setdefault("created_at", {})["$lte"] = filters["date_to"]

        pipeline = [
            {"$match": query},
            {"$group": {
                "_id": None,
                "count": {"$sum": 1},
                "total_kg": {"$sum": "$quantity_kg"},
                "total_loss": {"$sum": {"$ifNull": ["$loss_kg", 0]}},
            }},
        ]
        try:
            async for doc in entries_col().aggregate(pipeline):
                total = doc["total_kg"] or 1
                return {
                    "count": doc["count"],
                    "total_kg": round(doc["total_kg"], 2),
                    "loss_pct": round((doc["total_loss"] / total) * 100, 2),
                }
            return {"count": 0, "total_kg": 0, "loss_pct": 0}
        except Exception as e:
            logger.warning(f"Mongo query_stats failed: {e}")
            return {"count": 0, "total_kg": 0, "loss_pct": 0}

    async def list_all(self, limit: int = 200) -> list[dict]:
        try:
            cursor = entries_col().find().sort("created_at", -1).limit(limit)
            docs = await cursor.to_list(length=limit)
            for doc in docs:
                if "_id" in doc:
                    doc["id"] = str(doc.pop("_id"))
            return docs
        except Exception as e:
            logger.warning(f"Mongo list_all failed: {e}")
            return []
