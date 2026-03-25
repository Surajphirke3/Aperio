from .models import Vendor, VendorScorecard


class VendorService:
    """Scorecard calculation logic for vendors."""

    def calculate_scorecard(
        self,
        vendor: Vendor,
        batches: list,
    ) -> VendorScorecard:
        """Calculate a vendor's performance scorecard from their batch history."""
        if not batches:
            return VendorScorecard(
                vendor_id=vendor.id,
                vendor_name=vendor.name,
            )

        total_quantity = sum(getattr(b, "initial_quantity_kg", 0) for b in batches)
        total_loss = sum(getattr(b, "total_loss_pct", 0) for b in batches)
        avg_loss = total_loss / len(batches) if batches else 0

        # Quality score: inverse of average loss (lower loss = higher score)
        quality_score = max(0, 100 - (avg_loss * 5))

        return VendorScorecard(
            vendor_id=vendor.id,
            vendor_name=vendor.name,
            total_batches=len(batches),
            total_quantity_kg=total_quantity,
            avg_loss_pct=avg_loss,
            quality_score=quality_score,
        )
