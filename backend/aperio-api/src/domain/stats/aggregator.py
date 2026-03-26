from datetime import datetime, timedelta

from src.infrastructure.db.mongo import entries_col, batches_col


class StatsAggregator:
    async def get_kpis(self, days: int) -> dict:
        since = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"created_at": {"$gte": since.isoformat()}}},
            {"$group": {
                "_id": None,
                "total_kg": {"$sum": "$quantity_kg"},
                "total_loss_kg": {"$sum": {"$ifNull": ["$loss_kg", 0]}},
                "batch_count": {"$sum": 1},
                "dispatched_kg": {"$sum": {
                    "$cond": [{"$eq": ["$intent", "dispatch"]}, "$quantity_kg", 0]
                }},
            }},
        ]
        async for doc in entries_col().aggregate(pipeline):
            total = doc["total_kg"] or 1
            return {
                "total_kg": round(doc["total_kg"], 2),
                "dispatched_kg": round(doc["dispatched_kg"], 2),
                "loss_pct": round((doc["total_loss_kg"] / total) * 100, 2),
                "batch_count": doc["batch_count"],
            }
        return {"total_kg": 0, "dispatched_kg": 0, "loss_pct": 0, "batch_count": 0}

    async def get_sankey(self, days: int) -> dict:
        since = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"created_at": {"$gte": since.isoformat()}, "stage": {"$ne": None}}},
            {"$group": {"_id": {"from": "$intent", "to": "$stage"}, "value": {"$sum": "$quantity_kg"}}},
        ]
        node_set = set()
        links = []
        async for doc in entries_col().aggregate(pipeline):
            src = doc["_id"]["from"]
            tgt = doc["_id"]["to"]
            node_set.update([src, tgt])
            links.append({"source": src, "target": tgt, "value": round(doc["value"], 2)})

        nodes = [{"name": n} for n in sorted(node_set)]
        node_idx = {n["name"]: i for i, n in enumerate(nodes)}
        indexed_links = [
            {"source": node_idx[l["source"]], "target": node_idx[l["target"]], "value": l["value"]}
            for l in links if l["source"] in node_idx and l["target"] in node_idx
        ]
        return {"nodes": nodes, "links": indexed_links}

    async def get_weekly(self, days: int) -> dict:
        since = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"created_at": {"$gte": since.isoformat()}}},
            {"$addFields": {"week": {"$isoWeek": {"$dateFromString": {"dateString": "$created_at"}}}}},
            {"$group": {"_id": "$week", "total_kg": {"$sum": "$quantity_kg"}, "count": {"$sum": 1}}},
            {"$sort": {"_id": 1}},
        ]
        weeks = []
        async for doc in entries_col().aggregate(pipeline):
            weeks.append({"week": f"W{doc['_id']}", "total_kg": round(doc["total_kg"], 2), "count": doc["count"]})
        return {"data": weeks}

    async def get_material_distribution(self, days: int) -> dict:
        since = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"created_at": {"$gte": since.isoformat()}}},
            {"$group": {"_id": "$material", "total_kg": {"$sum": "$quantity_kg"}}},
        ]
        result = []
        async for doc in entries_col().aggregate(pipeline):
            result.append({"material": doc["_id"], "total_kg": round(doc["total_kg"], 2)})
        return {"data": result}

    async def get_stage_distribution(self, days: int) -> dict:
        since = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"created_at": {"$gte": since.isoformat()}, "stage": {"$ne": None}}},
            {"$group": {"_id": "$stage", "total_kg": {"$sum": "$quantity_kg"}, "loss_kg": {"$sum": {"$ifNull": ["$loss_kg", 0]}}}},
        ]
        result = []
        async for doc in entries_col().aggregate(pipeline):
            result.append({
                "stage": doc["_id"],
                "total_kg": round(doc["total_kg"], 2),
                "loss_kg": round(doc["loss_kg"], 2),
            })
        return {"data": result}

    async def get_completeness_score(self) -> dict:
        col = entries_col()
        total = await col.count_documents({})
        if not total:
            return {"score": 0, "total": 0, "complete": 0}

        complete = await col.count_documents({
            "material": {"$ne": None},
            "quantity_kg": {"$ne": None},
            "stage": {"$ne": None},
            "vendor": {"$ne": None},
        })
        return {
            "score": round((complete / total) * 100, 1),
            "total": total,
            "complete": complete,
        }
