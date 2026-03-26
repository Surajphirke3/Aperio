from enum import Enum
from pydantic import BaseModel
from typing import Optional


class BatchStage(str, Enum):
    COLLECTION = "collection"
    SORTING = "sorting"
    PROCESSING = "processing"
    OUTPUT = "output"
    DISPATCH = "dispatch"


class AnomalyAlert(BaseModel):
    batch_id: str
    stage: str
    metric: str
    value: float
    threshold: float
    message: str


class Batch(BaseModel):
    id: Optional[str] = None
    material: str
    quantity_kg: float
    intent: str
    vendor: Optional[str] = None
    stage: Optional[str] = None
    loss_kg: Optional[float] = None
    date: Optional[str] = None
    session_id: Optional[str] = None
    created_at: Optional[str] = None
    notes: Optional[str] = None