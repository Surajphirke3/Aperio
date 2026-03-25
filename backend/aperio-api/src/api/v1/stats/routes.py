from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .schemas import DashboardStatsResponse, SankeyResponse
from src.infrastructure.repositories.stats_repository import StatsRepository
from src.infrastructure.database.connection import get_db_session

router = APIRouter(prefix="/stats", tags=["stats"])


def get_stats_repository(db: Session = Depends(get_db_session)) -> StatsRepository:
    return StatsRepository(db)


@router.get("/dashboard", response_model=DashboardStatsResponse)
async def get_dashboard_stats(
    repo: StatsRepository = Depends(get_stats_repository),
) -> DashboardStatsResponse:
    """Get overall dashboard statistics."""
    try:
        stats = repo.get_dashboard_stats()
        return DashboardStatsResponse(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch dashboard stats: {str(e)}")


@router.get("/sankey", response_model=SankeyResponse)
async def get_sankey_data(
    repo: StatsRepository = Depends(get_stats_repository),
) -> SankeyResponse:
    """Get Sankey diagram data for material flow visualization."""
    try:
        data = repo.get_sankey_data()
        return SankeyResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch sankey data: {str(e)}")
