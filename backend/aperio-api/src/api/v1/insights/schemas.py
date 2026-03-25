from pydantic import BaseModel


class InsightResponse(BaseModel):
    batch_id: str
    summary: str
    anomalies: list[str] = []
    recommendations: list[str] = []
    risk_level: str = "low"