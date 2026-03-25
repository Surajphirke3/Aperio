from fastapi import APIRouter, Depends
from src.api.dependencies import verify_token

router = APIRouter(prefix="/vendors", tags=["vendors"])


def _get_service():
    from src.domain.vendors.services import VendorService
    return VendorService()


@router.get("/")
async def get_vendors(
    user_id: str = Depends(verify_token),
):
    service = _get_service()
    vendors = await service.get_vendors()
    return {"vendors": vendors, "count": len(vendors)}