from fastapi import APIRouter, Depends
from .schemas import DashboardStatsResponse, SankeyResponse
from src.infrastructure.repositories.stats_repository import StatsRepository
from src.api.dependencies import get_batch_repository

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/dashboard", response_model=DashboardStatsResponse)
async def get_dashboard_stats() -> DashboardStatsResponse:
    """Get overall dashboard statistics."""
    # TODO: Wire up StatsRepository via dependency injection
    return DashboardStatsResponse(
        total_batches=0,
        total_quantity_kg=0.0,
        avg_loss_pct=0.0,
        active_vendors=0,
    )


@router.get("/sankey", response_model=SankeyResponse)
async def get_sankey_data() -> SankeyResponse:
    """Get Sankey diagram data for material flow visualization."""
    # TODO: Wire up StatsRepository via dependency injection
    return SankeyResponse(nodes=[], links=[])
