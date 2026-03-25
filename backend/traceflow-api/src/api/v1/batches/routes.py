from fastapi import APIRouter, Depends, HTTPException, Query
from .schemas import BatchResponse, BatchListResponse
from src.api.dependencies import get_batch_repository
from src.infrastructure.repositories.batch_repository import BatchRepository

router = APIRouter(prefix="/batches", tags=["batches"])


@router.get("/", response_model=BatchListResponse)
async def list_batches(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    batch_repo: BatchRepository = Depends(get_batch_repository),
) -> BatchListResponse:
    """List all batches with pagination."""
    batches = await batch_repo.list_batches(skip=skip, limit=limit)
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
