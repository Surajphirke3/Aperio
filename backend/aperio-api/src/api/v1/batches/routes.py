from fastapi import APIRouter, Depends, HTTPException
from src.api.dependencies import verify_token

router = APIRouter(prefix="/batches", tags=["batches"])


def _get_service():
    from src.domain.batches.services import BatchService
    return BatchService()


@router.get("/")
async def get_batches(
    limit: int = 50,
    user_id: str = Depends(verify_token),
):
    service = _get_service()
    return await service.get_batches(limit=limit)


@router.get("/{batch_id}")
async def get_batch(
    batch_id: str,
    user_id: str = Depends(verify_token),
):
    service = _get_service()
    batch = await service.get_batch(batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail=f"Batch not found: {batch_id}")
    anomalies = service.detect_anomalies(batch)
    return {**batch, "anomalies": anomalies}
