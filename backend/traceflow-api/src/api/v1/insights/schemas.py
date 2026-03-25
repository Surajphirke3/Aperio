from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class InsightResponse(BaseModel):
    title: str
    narrative: str
    batch_id: Optional[str] = None
    category: str = "general"
    generated_at: datetime = Field(default_factory=datetime.utcnow)
