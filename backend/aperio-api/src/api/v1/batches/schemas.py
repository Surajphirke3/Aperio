from pydantic import BaseModel
from typing import Optional


class BatchResponse(BaseModel):
    id: str
    material: Optional[str] = None
    quantity_kg: Optional[float] = None
    intent: Optional[str] = None
    vendor: Optional[str] = None
    stage: Optional[str] = None
    loss_kg: Optional[float] = None
    date: Optional[str] = None
    created_at: Optional[str] = None


class BatchListResponse(BaseModel):
    batches: list[dict]
    count: int