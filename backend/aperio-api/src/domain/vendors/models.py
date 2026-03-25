from dataclasses import dataclass, field
from datetime import date
from typing import Optional


@dataclass
class Vendor:
    """Represents a material supplier."""
    id: str
    name: str
    location: Optional[str] = None
    contact: Optional[str] = None
    created_at: date = field(default_factory=date.today)


@dataclass
class VendorScorecard:
    """Performance scorecard for a vendor."""
    vendor_id: str
    vendor_name: str
    total_batches: int = 0
    total_quantity_kg: float = 0.0
    avg_loss_pct: float = 0.0
    on_time_delivery_pct: float = 0.0
    quality_score: float = 0.0  # 0.0 to 100.0

    @property
    def overall_rating(self) -> str:
        if self.quality_score >= 80:
            return "excellent"
        elif self.quality_score >= 60:
            return "good"
        elif self.quality_score >= 40:
            return "average"
        else:
            return "poor"
