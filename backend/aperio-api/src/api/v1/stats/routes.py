from fastapi import APIRouter, Depends, Query

from .schemas import (
    KPIResponse, SankeyResponse, WeeklyChartResponse,
    MaterialDistResponse, StageDistResponse, CompletenessResponse
)
from src.api.dependencies import verify_token
from src.domain.stats.aggregator import StatsAggregator

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/", response_model=KPIResponse)
async def get_kpis(
    days: int = Query(default=30, ge=7, le=90),
    user_id: str = Depends(verify_token),
):
    return await StatsAggregator().get_kpis(days)


@router.get("/sankey", response_model=SankeyResponse)
async def get_sankey(
    days: int = Query(default=30),
    user_id: str = Depends(verify_token),
):
    return await StatsAggregator().get_sankey(days)


@router.get("/weekly", response_model=WeeklyChartResponse)
async def get_weekly(
    days: int = Query(default=30),
    user_id: str = Depends(verify_token),
):
    return await StatsAggregator().get_weekly(days)


@router.get("/materials", response_model=MaterialDistResponse)
async def get_materials(
    days: int = Query(default=30),
    user_id: str = Depends(verify_token),
):
    return await StatsAggregator().get_material_distribution(days)


@router.get("/stages", response_model=StageDistResponse)
async def get_stages(
    days: int = Query(default=30),
    user_id: str = Depends(verify_token),
):
    return await StatsAggregator().get_stage_distribution(days)


@router.get("/completeness", response_model=CompletenessResponse)
async def get_completeness(
    user_id: str = Depends(verify_token),
):
    return await StatsAggregator().get_completeness_score()
