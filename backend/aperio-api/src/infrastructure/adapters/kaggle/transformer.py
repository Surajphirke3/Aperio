import csv
from typing import Any
from io import StringIO


def transform_csv_to_entries(csv_content: str) -> list[dict[str, Any]]:
    """Transform raw CSV data from Kaggle dataset into domain-compatible entries."""
    reader = csv.DictReader(StringIO(csv_content))
    entries = []

    for row in reader:
        entry = {
            "material": row.get("material", "").strip().upper(),
            "quantity_kg": _safe_float(row.get("quantity_kg", "0")),
            "vendor": row.get("vendor", "").strip(),
            "date": row.get("date", "").strip(),
            "stage": row.get("stage", "").strip().lower(),
            "loss_kg": _safe_float(row.get("loss_kg", "0")),
            "batch_id": row.get("batch_id", "").strip(),
        }
        entries.append(entry)

    return entries


def _safe_float(value: str) -> float:
    """Safely convert a string to float, returning 0.0 on failure."""
    try:
        return float(value.strip())
    except (ValueError, AttributeError):
        return 0.0
