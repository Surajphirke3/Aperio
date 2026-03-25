from fastapi import APIRouter, Depends, HTTPException
from .schemas import VendorResponse, ScorecardResponse

router = APIRouter(prefix="/vendors", tags=["vendors"])


@router.get("/", response_model=list[VendorResponse])
async def list_vendors() -> list[VendorResponse]:
    """List all vendors."""
    # TODO: Implement with VendorRepository
    raise HTTPException(status_code=501, detail="Endpoint not yet implemented")


@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor(vendor_id: str) -> VendorResponse:
    """Get a specific vendor by ID."""
    # TODO: Implement with VendorRepository
    raise HTTPException(status_code=501, detail="Endpoint not yet implemented")


@router.get("/{vendor_id}/scorecard", response_model=ScorecardResponse)
async def get_vendor_scorecard(vendor_id: str) -> ScorecardResponse:
    """Get vendor performance scorecard."""
    # TODO: Implement with VendorService
    raise HTTPException(status_code=501, detail="Endpoint not yet implemented")
