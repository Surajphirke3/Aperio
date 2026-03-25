from sqlalchemy.orm import Session
from sqlalchemy import func
from src.infrastructure.database.models import BatchORM, VendorORM
from src.domain.vendors.models import Vendor, VendorScorecard


class VendorRepository:
    """CRUD operations for vendors."""

    def __init__(self, db: Session):
        self.db = db

    def get_vendor(self, vendor_id: str) -> Vendor | None:
        """Retrieve a vendor by ID."""
        orm_vendor = self.db.query(VendorORM).filter(VendorORM.id == vendor_id).first()
        if not orm_vendor:
            return None
        return Vendor(
            id=orm_vendor.id,
            name=orm_vendor.name,
            location=orm_vendor.location,
            contact=orm_vendor.contact,
            created_at=orm_vendor.created_at,
        )

    def get_vendor_by_name(self, name: str) -> Vendor | None:
        """Retrieve a vendor by name."""
        orm_vendor = self.db.query(VendorORM).filter(VendorORM.name == name).first()
        if not orm_vendor:
            return None
        return Vendor(
            id=orm_vendor.id,
            name=orm_vendor.name,
            location=orm_vendor.location,
            contact=orm_vendor.contact,
            created_at=orm_vendor.created_at,
        )

    def list_vendors(self) -> list[Vendor]:
        """List all vendors."""
        orm_vendors = self.db.query(VendorORM).all()
        return [
            Vendor(
                id=v.id,
                name=v.name,
                location=v.location,
                contact=v.contact,
                created_at=v.created_at,
            )
            for v in orm_vendors
        ]

    def get_scorecard(self, vendor_id: str) -> VendorScorecard:
        """Calculate vendor performance scorecard from batch data."""
        vendor = self.get_vendor(vendor_id)
        if not vendor:
            return VendorScorecard(vendor_id=vendor_id, vendor_name="Unknown")

        # Get all batches for this vendor
        batches = self.db.query(BatchORM).filter(BatchORM.vendor == vendor.name).all()

        if not batches:
            return VendorScorecard(
                vendor_id=vendor_id,
                vendor_name=vendor.name,
            )

        total_batches = len(batches)
        total_quantity = sum(b.initial_quantity_kg for b in batches)

        # Calculate average loss across all batches
        total_loss = 0.0
        batch_with_loss = 0
        for batch in batches:
            if batch.total_loss_pct is not None:
                total_loss += batch.total_loss_pct
                batch_with_loss += 1
        avg_loss = total_loss / batch_with_loss if batch_with_loss > 0 else 0.0

        # Quality score: inverse of loss percentage (lower loss = higher score)
        quality_score = max(0.0, 100.0 - (avg_loss * 5))

        return VendorScorecard(
            vendor_id=vendor_id,
            vendor_name=vendor.name,
            total_batches=total_batches,
            total_quantity_kg=total_quantity,
            avg_loss_pct=round(avg_loss, 2),
            quality_score=round(quality_score, 1),
        )

    def create(self, vendor_data: dict) -> Vendor:
        """Create a new vendor."""
        from src.infrastructure.database.models import VendorORM
        import uuid
        from datetime import date

        orm_vendor = VendorORM(
            id=str(uuid.uuid4()),
            name=vendor_data["name"],
            location=vendor_data.get("location"),
            contact=vendor_data.get("contact"),
            created_at=date.today(),
        )
        self.db.add(orm_vendor)
        self.db.commit()
        self.db.refresh(orm_vendor)

        return Vendor(
            id=orm_vendor.id,
            name=orm_vendor.name,
            location=orm_vendor.location,
            contact=orm_vendor.contact,
            created_at=orm_vendor.created_at,
        )

    def update(self, vendor_id: str, vendor_data: dict) -> Vendor | None:
        """Update an existing vendor."""
        orm_vendor = self.db.query(VendorORM).filter(VendorORM.id == vendor_id).first()
        if not orm_vendor:
            return None

        if "name" in vendor_data:
            orm_vendor.name = vendor_data["name"]
        if "location" in vendor_data:
            orm_vendor.location = vendor_data["location"]
        if "contact" in vendor_data:
            orm_vendor.contact = vendor_data["contact"]

        self.db.commit()
        self.db.refresh(orm_vendor)

        return Vendor(
            id=orm_vendor.id,
            name=orm_vendor.name,
            location=orm_vendor.location,
            contact=orm_vendor.contact,
            created_at=orm_vendor.created_at,
        )
