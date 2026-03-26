from pydantic import BaseModel
from typing import Optional


class DashboardStats(BaseModel):
    total_entries: int
    by_material: dict[str, float]
    by_stage: dict[str, float]
    total_dispatched_kg: float