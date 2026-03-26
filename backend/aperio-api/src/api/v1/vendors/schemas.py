from pydantic import BaseModel


class VendorResponse(BaseModel):
    name: str
    total_kg: float = 0.0
    entry_count: int = 0


class VendorListResponse(BaseModel):
    vendors: list[VendorResponse]
    count: int