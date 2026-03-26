"""Seed MongoDB with sample material entries.

Usage:
    python scripts/seed_db.py
"""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.infrastructure.db.mongo import init_mongo, close_mongo, entries_col, vendors_col
from datetime import datetime, timedelta
import random


MATERIALS = ["PET", "HDPE", "PP", "LDPE", "PVC", "mixed"]
VENDORS = ["GreenCycle Ltd", "EcoPlast Co", "RePolymer Inc", "CleanScrap LLC", "OceanBound Plastics"]
STAGES = ["collection", "sorting", "processing", "output", "dispatch"]
INTENTS = ["purchase", "processing", "dispatch"]


async def seed():
    await init_mongo()

    entries = []
    vendors_data = {}

    base_date = datetime.utcnow() - timedelta(days=90)

    for i in range(100):
        days_ago = random.randint(0, 90)
        dt = base_date + timedelta(days=days_ago, hours=random.randint(0, 23))

        material = random.choice(MATERIALS)
        vendor = random.choice(VENDORS)
        intent = random.choice(INTENTS)
        qty = round(random.uniform(50, 500), 2)
        loss = round(qty * random.uniform(0, 0.1), 2) if random.random() > 0.7 else 0

        entry = {
            "material": material,
            "quantity_kg": qty,
            "intent": intent,
            "vendor": vendor,
            "stage": STAGES[INTENTS.index(intent)] if intent in INTENTS else "processing",
            "loss_kg": loss,
            "created_at": dt.isoformat(),
            "batch_id": f"BATCH-{1000 + i}",
        }
        entries.append(entry)

        if vendor not in vendors_data:
            vendors_data[vendor] = {"name": vendor, "total_kg": 0, "reliability": 0, "score": 0}
        vendors_data[vendor]["total_kg"] += qty

    col = entries_col()
    if entries:
        await col.insert_many(entries)

    for vendor_name, data in vendors_data.items():
        data["reliability"] = round(random.uniform(70, 99), 1)
        data["score"] = round(random.uniform(70, 95), 1)
        data["risk"] = random.choice(["low", "medium", "low", "low"])
        data["trend"] = random.choice(["up", "stable", "up"])

    v_col = vendors_col()
    if vendors_data:
        await v_col.insert_many(list(vendors_data.values()))

    print(f"Seeded {len(entries)} entries and {len(vendors_data)} vendors into MongoDB")

    await close_mongo()


if __name__ == "__main__":
    asyncio.run(seed())
