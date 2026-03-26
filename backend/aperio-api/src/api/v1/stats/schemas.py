from pydantic import BaseModel
from typing import Optional


class KPIResponse(BaseModel):
    total_kg: float
    dispatched_kg: float
    loss_pct: float
    batch_count: int
    # Next.js dashboard hook expects these fields for aggregation normalization.
    total_entries: int
    by_material: dict[str, float]
    by_stage: dict[str, float]


class SankeyNode(BaseModel):
    name: str


class SankeyLink(BaseModel):
    source: int
    target: int
    value: float


class SankeyResponse(BaseModel):
    nodes: list[SankeyNode]
    links: list[SankeyLink]


class WeeklyDataPoint(BaseModel):
    week: str
    total_kg: float
    count: int


class WeeklyChartResponse(BaseModel):
    data: list[WeeklyDataPoint]


class MaterialDataPoint(BaseModel):
    material: str
    total_kg: float


class MaterialDistResponse(BaseModel):
    data: list[MaterialDataPoint]


class StageDataPoint(BaseModel):
    stage: str
    total_kg: float
    loss_kg: float


class StageDistResponse(BaseModel):
    data: list[StageDataPoint]


class CompletenessResponse(BaseModel):
    score: float
    total: int
    complete: int
