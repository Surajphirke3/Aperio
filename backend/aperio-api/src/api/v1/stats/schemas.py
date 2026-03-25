from pydantic import BaseModel
from typing import Any


class DashboardStatsResponse(BaseModel):
    total_batches: int
    total_quantity_kg: float
    avg_loss_pct: float
    active_vendors: int


class SankeyNode(BaseModel):
    id: str
    label: str


class SankeyLink(BaseModel):
    source: str
    target: str
    value: float


class SankeyResponse(BaseModel):
    nodes: list[Any]
    links: list[Any]
