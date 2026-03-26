from pydantic import BaseModel


class VendorResponse(BaseModel):
    id: str
    name: str
    total_kg: float = 0.0
    reliability: float = 0.0
    score: float = 0.0
    risk: str = "low"
    trend: str = "stable"


class VendorListResponse(BaseModel):
    vendors: list[VendorResponse]
    count: int
