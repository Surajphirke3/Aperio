from fastapi import APIRouter, Depends
from src.domain.vendors.services import VendorService
from src.api.dependencies import verify_token

router = APIRouter(prefix="/vendors", tags=["vendors"])

_service = VendorService()


@router.get("/")
async def get_vendors(
    user_id: str = Depends(verify_token),
):
    vendors = await _service.get_vendors()
    return {"vendors": vendors, "count": len(vendors)}