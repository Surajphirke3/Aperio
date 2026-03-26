from pydantic import BaseModel


class CarbonDataPoint(BaseModel):
    material: str
    co2_saved_kg: float


class CarbonMonthlyPoint(BaseModel):
    month: str
    co2_saved_kg: float


class CarbonResponse(BaseModel):
    total_co2_saved_kg: float
    total_co2_saved_tonnes: float
    trees_equivalent: int
    by_material: dict[str, float]
    monthly: list[CarbonMonthlyPoint]
