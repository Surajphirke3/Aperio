from fastapi import APIRouter, Depends

from .schemas import VendorListResponse
from src.api.dependencies import verify_token
from src.infrastructure.db.repositories.vendor_repo import VendorRepository

router = APIRouter(prefix="/vendors", tags=["vendors"])


@router.get("/", response_model=VendorListResponse)
async def list_vendors(
    user_id: str = Depends(verify_token),
):
    repo = VendorRepository()
    vendors = await repo.list_all()
    return {"vendors": vendors, "count": len(vendors)}
