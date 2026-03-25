"""
Seed the database with sample data from Kaggle dataset or generated fixtures.
Usage: python scripts/seed_db.py
"""
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from src.infrastructure.database.connection import engine, SessionLocal, Base
from src.infrastructure.database.models import BatchORM, BatchLifecycleORM, EntryORM, VendorORM
from datetime import date, datetime


SAMPLE_VENDORS = [
    {"id": "V001", "name": "EcoPlast Recyclers", "location": "Mumbai", "contact": "eco@example.com"},
    {"id": "V002", "name": "GreenCycle Corp", "location": "Pune", "contact": "green@example.com"},
    {"id": "V003", "name": "ReNew Materials", "location": "Delhi", "contact": "renew@example.com"},
    {"id": "V004", "name": "PlastiTrade Inc", "location": "Chennai", "contact": "plasti@example.com"},
]

SAMPLE_BATCHES = [
    {"id": "B-2024-001", "material": "PET", "vendor": "V001", "initial_quantity_kg": 500.0, "current_stage": "dispatch"},
    {"id": "B-2024-002", "material": "HDPE", "vendor": "V002", "initial_quantity_kg": 800.0, "current_stage": "extrusion"},
    {"id": "B-2024-003", "material": "PP", "vendor": "V003", "initial_quantity_kg": 300.0, "current_stage": "washing"},
    {"id": "B-2024-004", "material": "PET", "vendor": "V001", "initial_quantity_kg": 1000.0, "current_stage": "pelletizing"},
    {"id": "B-2024-005", "material": "LDPE", "vendor": "V004", "initial_quantity_kg": 450.0, "current_stage": "sorting"},
]

SAMPLE_LIFECYCLE = [
    {"batch_id": "B-2024-001", "stage": "sorting", "quantity_kg": 500, "loss_kg": 15},
    {"batch_id": "B-2024-001", "stage": "washing", "quantity_kg": 485, "loss_kg": 25},
    {"batch_id": "B-2024-001", "stage": "shredding", "quantity_kg": 460, "loss_kg": 10},
    {"batch_id": "B-2024-001", "stage": "extrusion", "quantity_kg": 450, "loss_kg": 12},
    {"batch_id": "B-2024-001", "stage": "pelletizing", "quantity_kg": 438, "loss_kg": 5},
    {"batch_id": "B-2024-001", "stage": "dispatch", "quantity_kg": 433, "loss_kg": 3},
    {"batch_id": "B-2024-002", "stage": "sorting", "quantity_kg": 800, "loss_kg": 20},
    {"batch_id": "B-2024-002", "stage": "washing", "quantity_kg": 780, "loss_kg": 40},
    {"batch_id": "B-2024-002", "stage": "shredding", "quantity_kg": 740, "loss_kg": 15},
    {"batch_id": "B-2024-002", "stage": "extrusion", "quantity_kg": 725, "loss_kg": 18},
    {"batch_id": "B-2024-003", "stage": "sorting", "quantity_kg": 300, "loss_kg": 12},
    {"batch_id": "B-2024-003", "stage": "washing", "quantity_kg": 288, "loss_kg": 30},
    {"batch_id": "B-2024-004", "stage": "sorting", "quantity_kg": 1000, "loss_kg": 35},
    {"batch_id": "B-2024-004", "stage": "washing", "quantity_kg": 965, "loss_kg": 55},
    {"batch_id": "B-2024-004", "stage": "shredding", "quantity_kg": 910, "loss_kg": 20},
    {"batch_id": "B-2024-004", "stage": "extrusion", "quantity_kg": 890, "loss_kg": 28},
    {"batch_id": "B-2024-004", "stage": "pelletizing", "quantity_kg": 862, "loss_kg": 8},
    {"batch_id": "B-2024-005", "stage": "sorting", "quantity_kg": 450, "loss_kg": 18},
]


def seed():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Clear existing data
        db.query(BatchLifecycleORM).delete()
        db.query(EntryORM).delete()
        db.query(BatchORM).delete()
        db.query(VendorORM).delete()

        print("Seeding vendors...")
        for v in SAMPLE_VENDORS:
            db.add(VendorORM(**v, created_at=date.today()))
        db.flush()

        print("Seeding batches...")
        for b in SAMPLE_BATCHES:
            db.add(BatchORM(**b, created_at=date.today()))
        db.flush()

        print("Seeding lifecycle stages...")
        for lc in SAMPLE_LIFECYCLE:
            db.add(BatchLifecycleORM(**lc, timestamp=datetime.utcnow()))
        db.flush()

        db.commit()
        print(f"Done! Seeded {len(SAMPLE_VENDORS)} vendors, {len(SAMPLE_BATCHES)} batches, {len(SAMPLE_LIFECYCLE)} lifecycle entries.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
