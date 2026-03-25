from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InsightResponse(BaseModel):
    title: str
    narrative: str
    batch_id: Optional[str] = None
    category: str = "general"
    generated_at: datetime = None
