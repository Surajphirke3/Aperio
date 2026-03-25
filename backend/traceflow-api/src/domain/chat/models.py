from dataclasses import dataclass, field
from enum import Enum
from datetime import date
from typing import Optional


class IntentType(str, Enum):
    PURCHASE = "purchase"
    PROCESSING = "processing"
    DISPATCH = "dispatch"
    QUERY = "query"
    REPORT = "report"


class MaterialType(str, Enum):
    PET = "PET"
    HDPE = "HDPE"
    PP = "PP"
    LDPE = "LDPE"
    PVC = "PVC"
    MIXED = "mixed"


@dataclass
class ParsedEntry:
    """Represents a successfully parsed data entry from NL input."""
    intent: IntentType
    material: MaterialType
    quantity_kg: float
    date: date
    vendor: Optional[str] = None
    stage: Optional[str] = None
    loss_kg: Optional[float] = None
    batch_id: Optional[str] = None
    notes: Optional[str] = None
    raw_input: str = ""

    @property
    def loss_pct(self) -> Optional[float]:
        if self.loss_kg and self.quantity_kg:
            return (self.loss_kg / self.quantity_kg) * 100
        return None


@dataclass
class QueryFilter:
    """Represents a structured query filter extracted from NL question."""
    metric: str                              # "dispatched", "processed", "loss"
    date_range_start: Optional[date] = None
    date_range_end: Optional[date] = None
    stage: Optional[str] = None
    material: Optional[MaterialType] = None
    vendor: Optional[str] = None
    batch_id: Optional[str] = None
