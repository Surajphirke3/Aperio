from fastapi import APIRouter, Depends, HTTPException
from .schemas import DashboardStatsResponse, SankeyResponse
from src.infrastructure.repositories.stats_repository import StatsRepository
from src.api.dependencies import get_batch_repository

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/dashboard", response_model=DashboardStatsResponse)
async def get_dashboard_stats() -> DashboardStatsResponse:
    """Get overall dashboard statistics."""
    # TODO: Implement with StatsRepository
    raise HTTPException(status_code=501, detail="Endpoint not yet implemented")


@router.get("/sankey", response_model=SankeyResponse)
async def get_sankey_data() -> SankeyResponse:
    """Get Sankey diagram data for material flow visualization."""
    # TODO: Implement with StatsRepository
    raise HTTPException(status_code=501, detail="Endpoint not yet implemented")
