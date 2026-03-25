from fastapi import APIRouter, Depends, Query

from .schemas import BatchListResponse, BatchDetailResponse
from src.api.dependencies import verify_token
from src.infrastructure.db.repositories.batch_repo import BatchRepository

router = APIRouter(prefix="/batches", tags=["batches"])


@router.get("/", response_model=BatchListResponse)
async def list_batches(
    material: str | None = Query(default=None),
    stage: str | None = Query(default=None),
    status: str | None = Query(default=None),
    search: str | None = Query(default=None),
    limit: int = Query(default=50, le=200),
    user_id: str = Depends(verify_token),
):
    repo = BatchRepository()
    batches = await repo.list(
        material=material, stage=stage,
        status=status, search=search, limit=limit
    )
    return {"batches": batches, "count": len(batches)}


@router.get("/{batch_id}", response_model=BatchDetailResponse)
async def get_batch(
    batch_id: str,
    user_id: str = Depends(verify_token),
):
    repo = BatchRepository()
    batch = await repo.get_by_id(batch_id)
    if not batch:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Batch not found: {batch_id}")
    return {**batch, "timeline": [], "custody_chain": [], "traceability_score": 75, "anomalies": []}
