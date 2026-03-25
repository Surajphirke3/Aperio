from pydantic import BaseModel
from typing import Any


class MaterialBreakdown(BaseModel):
    material: str
    quantity_kg: float
    count: int


class DashboardStatsResponse(BaseModel):
    total_batches: int
    total_quantity_kg: float
    total_received_kg: float
    total_dispatched_kg: float
    efficiency_pct: float
    carbon_saved_kg: float
    active_batches: int
    alert_count: int
    completeness_score: int
    avg_loss_pct: float
    active_vendors: int
    material_breakdown: list[MaterialBreakdown]


class SankeyNode(BaseModel):
    id: str
    name: str
    value: float


class SankeyLink(BaseModel):
    source: str
    target: str
    value: float


class SankeyResponse(BaseModel):
    nodes: list[SankeyNode]
    links: list[SankeyLink]
