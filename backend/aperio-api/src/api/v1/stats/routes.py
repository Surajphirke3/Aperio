from fastapi import APIRouter, Depends
from src.api.dependencies import verify_token

router = APIRouter(prefix="/stats", tags=["stats"])


def _get_service():
    from src.domain.batches.services import BatchService
    return BatchService()


@router.get("/")
async def get_dashboard_stats(
    user_id: str = Depends(verify_token),
):
    """GET /v1/stats — dashboard KPIs."""
    service = _get_service()
    stats = await service.get_dashboard_stats()
    return stats


@router.get("/sankey")
async def get_sankey_stats(
    user_id: str = Depends(verify_token),
):
    service = _get_service()
    return await service.get_sankey_data()
