import re
from typing import Optional
from .models import MaterialType


def extract_quantity(text: str) -> Optional[float]:
    """Extract quantity in kg from natural language text."""
    patterns = [
        r"(\d+(?:\.\d+)?)\s*(?:kg|kilos|kilograms)",
        r"(\d+(?:\.\d+)?)\s*(?:tons?|tonnes?)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            value = float(match.group(1))
            if "ton" in pattern:
                value *= 1000
            return value
    return None


def extract_material(text: str) -> Optional[MaterialType]:
    """Extract material type from natural language text."""
    text_upper = text.upper()
    for material in MaterialType:
        if material.value in text_upper:
            return material
    return None


def validate_entry_completeness(data: dict) -> list[str]:
    """Return list of missing required fields for a parsed entry."""
    required = ["material", "quantity_kg"]
    missing = []
    for field in required:
        if not data.get(field):
            missing.append(field)
    return missing
