from pydantic import BaseModel
from typing import Optional
from datetime import date


class VendorResponse(BaseModel):
    id: str
    name: str
    location: Optional[str] = None
    contact: Optional[str] = None
    created_at: Optional[date] = None


class ScorecardResponse(BaseModel):
    vendor_id: str
    vendor_name: str
    total_batches: int = 0
    total_quantity_kg: float = 0.0
    avg_loss_pct: float = 0.0
    on_time_delivery_pct: float = 0.0
    quality_score: float = 0.0
    overall_rating: str = "unknown"
