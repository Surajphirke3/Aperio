from datetime import datetime, timedelta

from src.infrastructure.db.mongo import entries_col

CO2_FACTORS = {
    "PET": 2.1,
    "HDPE": 1.8,
    "PP": 1.9,
    "LDPE": 1.7,
    "PVC": 2.4,
    "mixed": 1.5,
}


class CarbonCalculator:
    async def get_all(self, days: int) -> dict:
        since = datetime.utcnow() - timedelta(days=days)
        col = entries_col()

        total_co2_saved = 0.0
        by_material = {}
        monthly: dict[str, float] = {}

        async for doc in col.find({"created_at": {"$gte": since.isoformat()}, "intent": "dispatch"}):
            doc.pop("_id", None)
            mat = doc.get("material", "mixed")
            qty = doc.get("quantity_kg", 0)
            co2 = qty * CO2_FACTORS.get(mat, 1.5)
            total_co2_saved += co2
            by_material[mat] = by_material.get(mat, 0) + co2

            month = doc.get("created_at", "")[:7]
            monthly[month] = monthly.get(month, 0) + co2

        return {
            "total_co2_saved_kg": round(total_co2_saved, 2),
            "total_co2_saved_tonnes": round(total_co2_saved / 1000, 3),
            "trees_equivalent": round(total_co2_saved / 21.7, 0),
            "by_material": {k: round(v, 2) for k, v in by_material.items()},
            "monthly": [
                {"month": m, "co2_saved_kg": round(v, 2)}
                for m, v in sorted(monthly.items())
            ],
        }
