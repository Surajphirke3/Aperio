from dataclasses import dataclass
from typing import Optional


@dataclass
class MaterialFactor:
    """CO2 emission factor per kg for a material type."""
    material: str
    co2_per_kg: float  # kg CO2 per kg material
    source: str = "default"


@dataclass
class CarbonCalculation:
    """Result of a carbon footprint calculation."""
    batch_id: Optional[str] = None
    material: str = ""
    quantity_kg: float = 0.0
    emission_factor: float = 0.0
    total_co2_kg: float = 0.0
    savings_vs_virgin_kg: float = 0.0

    @property
    def savings_pct(self) -> float:
        if self.total_co2_kg > 0 and self.savings_vs_virgin_kg > 0:
            return (self.savings_vs_virgin_kg / (self.total_co2_kg + self.savings_vs_virgin_kg)) * 100
        return 0.0
