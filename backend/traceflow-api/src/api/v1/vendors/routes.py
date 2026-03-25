from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .schemas import VendorResponse, ScorecardResponse
from src.infrastructure.repositories.vendor_repository import VendorRepository
from src.infrastructure.database.connection import get_db_session

router = APIRouter(prefix="/vendors", tags=["vendors"])


def get_vendor_repository(db: Session = Depends(get_db_session)) -> VendorRepository:
    return VendorRepository(db)


@router.get("/", response_model=list[VendorResponse])
async def list_vendors(
    repo: VendorRepository = Depends(get_vendor_repository),
) -> list[VendorResponse]:
    """List all vendors."""
    try:
        vendors = repo.list_vendors()
        return [
            VendorResponse(
                id=v.id,
                name=v.name,
                location=v.location,
                contact=v.contact,
                created_at=v.created_at,
            )
            for v in vendors
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list vendors: {str(e)}")


@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor(
    vendor_id: str,
    repo: VendorRepository = Depends(get_vendor_repository),
) -> VendorResponse:
    """Get a specific vendor by ID."""
    try:
        vendor = repo.get_vendor(vendor_id)
        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor not found")
        return VendorResponse(
            id=vendor.id,
            name=vendor.name,
            location=vendor.location,
            contact=vendor.contact,
            created_at=vendor.created_at,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get vendor: {str(e)}")


@router.get("/{vendor_id}/scorecard", response_model=ScorecardResponse)
async def get_vendor_scorecard(
    vendor_id: str,
    repo: VendorRepository = Depends(get_vendor_repository),
) -> ScorecardResponse:
    """Get vendor performance scorecard."""
    try:
        scorecard = repo.get_scorecard(vendor_id)
        return ScorecardResponse(
            vendor_id=scorecard.vendor_id,
            vendor_name=scorecard.vendor_name,
            total_batches=scorecard.total_batches,
            total_quantity_kg=scorecard.total_quantity_kg,
            avg_loss_pct=scorecard.avg_loss_pct,
            on_time_delivery_pct=scorecard.on_time_delivery_pct,
            quality_score=scorecard.quality_score,
            overall_rating=scorecard.overall_rating,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get scorecard: {str(e)}")
