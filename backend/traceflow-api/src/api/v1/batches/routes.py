from fastapi import APIRouter, Depends, HTTPException
from .schemas import BatchResponse, BatchListResponse
from src.api.dependencies import get_batch_repository
from src.infrastructure.repositories.batch_repository import BatchRepository

router = APIRouter(prefix="/batches", tags=["batches"])


@router.get("/", response_model=BatchListResponse)
async def list_batches(
    batch_repo: BatchRepository = Depends(get_batch_repository),
) -> BatchListResponse:
    """List all batches with optional filters."""
    batches = await batch_repo.list_batches()
    return BatchListResponse(batches=batches, total=len(batches))


@router.get("/{batch_id}", response_model=BatchResponse)
async def get_batch(
    batch_id: str,
    batch_repo: BatchRepository = Depends(get_batch_repository),
) -> BatchResponse:
    """Get a specific batch by ID."""
    batch = await batch_repo.get_batch(batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail=f"Batch {batch_id} not found")
    return BatchResponse(**batch)
