from pydantic import BaseModel
from typing import Optional, Any
from datetime import date


class BatchResponse(BaseModel):
    id: str
    material: Optional[str] = None
    vendor: Optional[str] = None
    initial_quantity_kg: Optional[float] = None
    current_stage: Optional[str] = None
    created_at: Optional[date] = None
    lifecycle: Optional[list[Any]] = None


class BatchListResponse(BaseModel):
    batches: list[Any]
    total: int
