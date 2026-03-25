from fastapi import APIRouter, Depends
from src.domain.batches.services import BatchService
from src.api.dependencies import verify_token

router = APIRouter(prefix="/stats", tags=["stats"])

_service = BatchService()


@router.get("/")
async def get_dashboard_stats(
    user_id: str = Depends(verify_token),
):
    """GET /v1/stats — dashboard KPIs, Sankey data."""
    stats = await _service.get_dashboard_stats()
    return stats