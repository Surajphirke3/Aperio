"""
Seed the database with sample data from Kaggle dataset or generated fixtures.
Usage: python scripts/seed_db.py [--kaggle path/to/dataset.csv]
"""
import sys
import os
import argparse
import csv
import uuid

# Add project root to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from src.infrastructure.database.connection import engine, SessionLocal, Base
from src.infrastructure.database.models import BatchORM, BatchLifecycleORM, EntryORM, VendorORM
from datetime import date, datetime, timedelta
import random


SAMPLE_VENDORS = [
    {"id": "V001", "name": "EcoPlast Recyclers", "location": "Mumbai", "contact": "eco@example.com"},
    {"id": "V002", "name": "GreenCycle Corp", "location": "Pune", "contact": "green@example.com"},
    {"id": "V003", "name": "ReNew Materials", "location": "Delhi", "contact": "renew@example.com"},
    {"id": "V004", "name": "PlastiTrade Inc", "location": "Chennai", "contact": "plasti@example.com"},
    {"id": "V005", "name": "PolyRecovery Ltd", "location": "Bangalore", "contact": "poly@example.com"},
]

MATERIALS = ["PET", "HDPE", "PP", "LDPE", "PS"]
STAGES = ["collection", "sorting", "washing", "shredding", "melting", "pelletizing", "dispatch"]


def generate_batch_code(year: int, index: int) -> str:
    return f"B-{year}-{index:03d}"


def generate_lifecycle(batch_id: str, initial_qty: float, material: str) -> list[dict]:
    """Generate realistic lifecycle stages with appropriate loss percentages."""
    lifecycle = []
    current_qty = initial_qty

    # Loss percentages by stage (realistic ranges)
    loss_ranges = {
        "collection": (0, 2),
        "sorting": (3, 12),
        "washing": (2, 8),
        "shredding": (1, 5),
        "melting": (5, 18),
        "pelletizing": (2, 8),
        "dispatch": (0.5, 3),
    }

    for stage in STAGES:
        loss_min, loss_max = loss_ranges.get(stage, (1, 5))
        # Material-specific adjustments
        if material == "PET" and stage == "melting":
            loss_min, loss_max = 8, 15  # PET melts cleaner
        elif material in ["PP", "PS"] and stage == "melting":
            loss_min, loss_max = 10, 22  # These can degrade more

        loss_pct = random.uniform(loss_min, loss_max)
        loss_kg = current_qty * (loss_pct / 100)

        lifecycle.append({
            "batch_id": batch_id,
            "stage": stage,
            "quantity_kg": round(current_qty, 2),
            "loss_kg": round(loss_kg, 2),
        })

        current_qty -= loss_kg
        if current_qty < 0:
            current_qty = 0

    return lifecycle


def generate_synthetic_batches(count: int = 20) -> tuple[list[dict], list[dict]]:
    """Generate synthetic batch data with realistic lifecycle."""
    batches = []
    lifecycle = []
    year = datetime.now().year

    for i in range(count):
        batch_id = generate_batch_code(year, i + 1)
        material = random.choice(MATERIALS)
        vendor = random.choice(SAMPLE_VENDORS)["id"]
        initial_qty = random.uniform(200, 1500)

        batches.append({
            "id": batch_id,
            "material": material,
            "vendor": vendor,
            "initial_quantity_kg": round(initial_qty, 2),
            "current_stage": random.choice(STAGES[2:]),  # Skip early stages for variety
            "created_at": date.today() - timedelta(days=random.randint(0, 30)),
        })

        # Generate lifecycle for this batch
        batch_lifecycle = generate_lifecycle(batch_id, initial_qty, material)
        lifecycle.extend(batch_lifecycle)

    return batches, lifecycle


def load_kaggle_csv(csv_path: str) -> tuple[list[dict], list[dict], list[dict]]:
    """Load data from Kaggle CSV format."""
    vendors = []
    batches = []
    lifecycle = []
    vendor_map = {}

    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Extract or create vendor
            vendor_name = row.get('supplier', row.get('vendor', 'Unknown'))
            if vendor_name not in vendor_map:
                vendor_id = f"V{len(vendor_map)+1:03d}"
                vendor_map[vendor_name] = vendor_id
                vendors.append({
                    "id": vendor_id,
                    "name": vendor_name,
                    "location": row.get('location', 'Unknown'),
                    "contact": row.get('contact', ''),
                })

            # Create batch
            batch_id = row.get('batch_id', f"B-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}")
            material = row.get('material', row.get('type', 'PET')).upper()
            qty = float(row.get('quantity_kg', row.get('weight_kg', 500)))

            batches.append({
                "id": batch_id,
                "material": material,
                "vendor": vendor_map[vendor_name],
                "initial_quantity_kg": qty,
                "current_stage": row.get('stage', 'sorting'),
                "created_at": date.today(),
            })

            # Create lifecycle entry
            lifecycle.append({
                "batch_id": batch_id,
                "stage": row.get('stage', 'sorting'),
                "quantity_kg": qty,
                "loss_kg": float(row.get('loss_kg', 0)),
            })

    return vendors, batches, lifecycle


def seed(kaggle_path: str | None = None, synthetic_count: int = 20):
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Clear existing data
        db.query(BatchLifecycleORM).delete()
        db.query(EntryORM).delete()
        db.query(BatchORM).delete()
        db.query(VendorORM).delete()

        if kaggle_path and os.path.exists(kaggle_path):
            print(f"Loading Kaggle dataset from {kaggle_path}...")
            vendors, batches, lifecycle = load_kaggle_csv(kaggle_path)
        else:
            if kaggle_path:
                print(f"Kaggle file not found at {kaggle_path}, using synthetic data...")
            else:
                print("Generating synthetic demo data...")
            vendors = SAMPLE_VENDORS
            batches, lifecycle = generate_synthetic_batches(synthetic_count)

        print(f"Seeding {len(vendors)} vendors...")
        for v in vendors:
            db.add(VendorORM(**v, created_at=date.today()))
        db.flush()

        print(f"Seeding {len(batches)} batches...")
        for b in batches:
            db.add(BatchORM(**b))
        db.flush()

        print(f"Seeding {len(lifecycle)} lifecycle entries...")
        for lc in lifecycle:
            db.add(BatchLifecycleORM(**lc, timestamp=datetime.utcnow()))
        db.flush()

        db.commit()
        print(f"Done! Seeded {len(vendors)} vendors, {len(batches)} batches, {len(lifecycle)} lifecycle entries.")

        # Calculate some stats
        total_input = sum(b["initial_quantity_kg"] for b in batches)
        total_loss = sum(lc["loss_kg"] for lc in lifecycle)
        efficiency = ((total_input - total_loss) / total_input * 100) if total_input > 0 else 0
        print(f"\nStats:")
        print(f"  Total input: {total_input:,.1f} kg")
        print(f"  Total loss: {total_loss:,.1f} kg")
        print(f"  Efficiency: {efficiency:.1f}%")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed the TraceFlow database")
    parser.add_argument("--kaggle", help="Path to Kaggle CSV dataset")
    parser.add_argument("--synthetic", type=int, default=20, help="Number of synthetic batches to generate")
    args = parser.parse_args()

    seed(kaggle_path=args.kaggle, synthetic_count=args.synthetic)
