from fastapi import APIRouter, Depends, HTTPException
from src.api.dependencies import verify_token

router = APIRouter(prefix="/insights", tags=["insights"])


def _get_service():
    from src.domain.insights.services import InsightService
    return InsightService()


@router.post("/{batch_id}")
async def generate_insight(
    batch_id: str,
    user_id: str = Depends(verify_token),
):
    """POST /v1/insights/{batch_id} — AI-driven batch narrative."""
    try:
        service = _get_service()
        insight = await service.generate_insight(batch_id)
        return insight
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Insight generation failed: {str(e)}")