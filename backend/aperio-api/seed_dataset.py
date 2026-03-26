import asyncio
import csv
import os
from pathlib import Path
from datetime import datetime

# Adjust Python path if needed so `src` imports work reliably
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.infrastructure.db.mongo import init_mongo, close_mongo, entries_col, batches_col, vendors_col

PROCESS_MAP = {
    'PR': 'collection',
    'SEG': 'sorting',
    'MB': 'processing',
    'WT': 'dispatch',
    'WTR': 'collection',
    'QC': 'processing',
}

async def seed_data():
    await init_mongo()
    
    # We will seed Scenario 1
    scenario_path = Path("D:/Aperio/problem_statement_3/Scenario 1")
    
    tx_events = {}
    with open(scenario_path / "transaction_events.csv", "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            tx_events[row["transaction_id"]] = row
            
    # Build historical state for intent derivation
    inventory_stage = {}
    parent_inventory = {}
            
    docs_to_insert = []
    with open(scenario_path / "inventory_transforms.csv", "r") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            tx_id = row.get("transaction_id")
            event = tx_events.get(tx_id, {})
            
            qty = float(row.get("quantity", 0))
            loss_pct = float(row.get("loss_percent", 0))
            loss_kg = round(qty * (loss_pct / 100), 2)
            
            if loss_pct > 20 or event.get("status") == "REJECTED":
                status = "anomaly"
            elif loss_pct > 0:
                status = "warning"
            else:
                status = "complete"
                
            p_code = event.get("process_code", "MB")
            rem = event.get("remarks", "").lower()
            
            # Map robustly to exact UI Stages ['Collection', 'Sorting', 'Processing', 'Output', 'Dispatch']
            if p_code in ("PR", "WTR"):
                stage = "Collection"
            elif p_code == "SEG" or ("bale" in rem and p_code == "MB"):
                stage = "Sorting"
            elif p_code in ("WT", "SD"):
                stage = "Dispatch"
            elif "granul" in rem or "recy" in rem or "prod" in rem or "pipe" in rem:
                stage = "Output"
            else:
                stage = "Processing"
                
            dest_id = row.get("destination_inventory_id")
            src_id = row.get("source_inventory_id")
            
            inventory_stage[dest_id] = stage
            if src_id and src_id != "NULL":
                parent_inventory[dest_id] = src_id
                
                # Trace back skipping identical self-loops which break D3 Sankey
                prev_id = src_id
                while prev_id in inventory_stage and inventory_stage[prev_id] == stage:
                    prev_id = parent_inventory.get(prev_id)
                
                intent = inventory_stage.get(prev_id, "Collection") if prev_id else "Collection"
            else:
                intent = "Collection"
            
            date_str = event.get("transaction_date", datetime.utcnow().strftime("%Y-%m-%d"))
            
            doc = {
                "batch_id": f"B-SCENARIO-1-{idx}",
                "session_id": "seed-scenario-1",
                "material": "Mixed Plastic" if "Plastic" not in event.get("remarks", "") else "Recycled Plastic",
                "vendor": event.get("warehouse_code", "Aperio Network"),
                "quantity_kg": qty,
                "loss_kg": loss_kg,
                "stage": stage,
                "intent": intent, 
                "status": status,
                "completeness": 100 if event.get("status") == "APPROVED" else 20,
                "created_at": f"{date_str}T12:00:00Z"
            }
            docs_to_insert.append(doc)
            
    if docs_to_insert:
        # Save into entries_col
        await entries_col().delete_many({"session_id": "seed-scenario-1"})
        await entries_col().insert_many(docs_to_insert)
        
        # Save into batches_col mirroring real logic constraints
        await batches_col().delete_many({"session_id": "seed-scenario-1"})
        await batches_col().insert_many([{"id": d["batch_id"], **d} for d in docs_to_insert])

        # Aggregate and save into vendors_col
        vendor_stats = {}
        for d in docs_to_insert:
            vnd = d["vendor"]
            if vnd not in vendor_stats:
                vendor_stats[vnd] = {"name": vnd, "total_kg": 0, "entry_count": 0, "session_id": "seed-scenario-1"}
            vendor_stats[vnd]["total_kg"] += d["quantity_kg"]
            vendor_stats[vnd]["entry_count"] += 1
            
        if vendor_stats:
            await vendors_col().delete_many({"session_id": "seed-scenario-1"})
            await vendors_col().insert_many(list(vendor_stats.values()))
            
        print(f"Successfully seeded {len(docs_to_insert)} payloads into backend collections (Entries, Batches, Vendors)!")
    else:
        print("No valid transforms parsed.")

    await close_mongo()
    print("Database connection closed.")

if __name__ == "__main__":
    asyncio.run(seed_data())
