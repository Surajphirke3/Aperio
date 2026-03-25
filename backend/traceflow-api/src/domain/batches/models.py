from dataclasses import dataclass, field
from enum import Enum
from datetime import date, datetime
from typing import Optional


class BatchStage(str, Enum):
    PURCHASE = "purchase"
    SORTING = "sorting"
    WASHING = "washing"
    SHREDDING = "shredding"
    EXTRUSION = "extrusion"
    PELLETIZING = "pelletizing"
    DISPATCH = "dispatch"


@dataclass
class BatchLifecycle:
    """Tracks a batch through processing stages."""
    stage: BatchStage
    quantity_kg: float
    loss_kg: float = 0.0
    timestamp: datetime = field(default_factory=datetime.utcnow)
    notes: Optional[str] = None

    @property
    def loss_pct(self) -> float:
        if self.quantity_kg > 0:
            return (self.loss_kg / self.quantity_kg) * 100
        return 0.0


@dataclass
class Batch:
    """Represents a material batch moving through the supply chain."""
    id: str
    material: str
    vendor: str
    initial_quantity_kg: float
    current_stage: BatchStage = BatchStage.PURCHASE
    created_at: date = field(default_factory=date.today)
    lifecycle: list[BatchLifecycle] = field(default_factory=list)

    @property
    def total_loss_kg(self) -> float:
        return sum(stage.loss_kg for stage in self.lifecycle)

    @property
    def total_loss_pct(self) -> float:
        if self.initial_quantity_kg > 0:
            return (self.total_loss_kg / self.initial_quantity_kg) * 100
        return 0.0

    @property
    def current_quantity_kg(self) -> float:
        return self.initial_quantity_kg - self.total_loss_kg
