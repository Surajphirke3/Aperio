"""Load Kaggle dataset into Firestore.

Usage:
    python scripts/seed_db.py data/kaggle.csv
"""
import sys
import json
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from src.config.settings import settings


def seed(csv_path: str) -> None:
    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.firebase_credentials_path)
        firebase_admin.initialize_app(cred)

    db = firestore.client()
    collection = db.collection("material_entries")

    df = pd.read_csv(csv_path)
    count = 0

    for _, row in df.iterrows():
        data = {
            "intent": row.get("intent", "purchase"),
            "material": row.get("material", "mixed"),
            "quantity_kg": float(row.get("quantity_kg", 0)),
            "date": str(row.get("date", "")),
            "vendor": row.get("vendor"),
            "stage": row.get("stage"),
            "loss_kg": float(row.get("loss_kg", 0)) if pd.notna(row.get("loss_kg")) else None,
            "batch_id": row.get("batch_id"),
            "notes": row.get("notes"),
        }
        collection.add(data)
        count += 1

    print(f"Seeded {count} entries into Firestore")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/seed_db.py <csv_path>")
        sys.exit(1)
    seed(sys.argv[1])