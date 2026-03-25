from pydantic import BaseModel


class CarbonStatsResponse(BaseModel):
    material: str
    quantity_kg: float
    emission_factor: float
    total_co2_kg: float
    savings_vs_virgin_kg: float
    savings_pct: float
