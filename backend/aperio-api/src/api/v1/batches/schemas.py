from pydantic import BaseModel
from typing import Optional


class BatchResponse(BaseModel):
    id: Optional[str] = None
    material: Optional[str] = None
    quantity_kg: Optional[float] = None
    intent: Optional[str] = None
    vendor: Optional[str] = None
    stage: Optional[str] = None
    loss_kg: Optional[float] = None
    created_at: Optional[str] = None


class BatchListResponse(BaseModel):
    batches: list[dict]
    count: int


class BatchDetailResponse(BaseModel):
    id: str
    material: Optional[str] = None
    quantity_kg: Optional[float] = None
    intent: Optional[str] = None
    vendor: Optional[str] = None
    stage: Optional[str] = None
    loss_kg: Optional[float] = None
    created_at: Optional[str] = None
    timeline: Optional[list[dict]] = None
    custody_chain: Optional[list[dict]] = None
    traceability_score: Optional[float] = None
    anomalies: Optional[list[str]] = None
