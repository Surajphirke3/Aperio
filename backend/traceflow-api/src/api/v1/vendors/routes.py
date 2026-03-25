from fastapi import APIRouter, Depends, HTTPException
from .schemas import VendorResponse, ScorecardResponse

router = APIRouter(prefix="/vendors", tags=["vendors"])


@router.get("/", response_model=list[VendorResponse])
async def list_vendors() -> list[VendorResponse]:
    """List all vendors."""
    # TODO: Wire up VendorRepository via dependency injection
    return []


@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor(vendor_id: str) -> VendorResponse:
    """Get a specific vendor by ID."""
    # TODO: Wire up VendorRepository via dependency injection
    raise HTTPException(status_code=404, detail=f"Vendor {vendor_id} not found")


@router.get("/{vendor_id}/scorecard", response_model=ScorecardResponse)
async def get_vendor_scorecard(vendor_id: str) -> ScorecardResponse:
    """Get vendor performance scorecard."""
    # TODO: Wire up VendorService via dependency injection
    raise HTTPException(status_code=404, detail=f"Vendor {vendor_id} not found")
