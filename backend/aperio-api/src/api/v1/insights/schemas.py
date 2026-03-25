from pydantic import BaseModel
from typing import Optional


class InsightRequest(BaseModel):
    days: int = 30


class InsightResponse(BaseModel):
    narrative: str
    success: bool = True


class BatchInsightResponse(BaseModel):
    narrative: str
    traceability_score: float = 75
    anomalies: list[str] = []
