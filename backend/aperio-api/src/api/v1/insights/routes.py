from fastapi import APIRouter, Depends

from .schemas import InsightRequest, InsightResponse, BatchInsightResponse
from src.api.dependencies import verify_token
from src.domain.insights.generator import InsightGenerator

router = APIRouter(prefix="/insights", tags=["insights"])
_gen = InsightGenerator()


@router.post("/", response_model=InsightResponse)
async def generate_dashboard_insight(
    request: InsightRequest,
    user_id: str = Depends(verify_token),
):
    narrative = await _gen.generate_dashboard_narrative(request.days)
    return {"narrative": narrative, "success": True}


@router.post("/batch/{batch_id}", response_model=BatchInsightResponse)
async def generate_batch_insight(
    batch_id: str,
    user_id: str = Depends(verify_token),
):
    result = await _gen.generate_batch_narrative(batch_id)
    return result
