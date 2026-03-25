from pydantic import BaseModel
from typing import Optional


class BatchInsight(BaseModel):
    batch_id: str
    summary: str
    anomalies: list[str] = []
    recommendations: list[str] = []
    risk_level: str = "low"