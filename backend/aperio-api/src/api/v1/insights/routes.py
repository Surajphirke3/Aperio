from fastapi import APIRouter, Depends, HTTPException
from .schemas import InsightResponse
from src.domain.insights.services import InsightService
from src.api.dependencies import get_insight_service

router = APIRouter(prefix="/insights", tags=["insights"])


@router.post("/{batch_id}", response_model=InsightResponse)
async def generate_insight(
    batch_id: str,
    insight_service: InsightService = Depends(get_insight_service),
) -> InsightResponse:
    """Generate AI-powered insight for a specific batch."""
    try:
        insight = await insight_service.generate_batch_insight(batch_id)
        return InsightResponse(
            title=insight.title,
            narrative=insight.narrative,
            batch_id=insight.batch_id,
            category=insight.category,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
