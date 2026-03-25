from .models import CarbonCalculation, MaterialFactor


# Default emission factors (kg CO2 per kg material)
# Virgin plastic production vs recycled
VIRGIN_FACTORS: dict[str, float] = {
    "PET": 2.15,
    "HDPE": 1.80,
    "PP": 1.95,
    "LDPE": 2.10,
    "PVC": 2.40,
    "mixed": 2.00,
}

RECYCLED_FACTORS: dict[str, float] = {
    "PET": 0.45,
    "HDPE": 0.35,
    "PP": 0.40,
    "LDPE": 0.42,
    "PVC": 0.50,
    "mixed": 0.43,
}


class CarbonService:
    """CO2 calculation logic for recycled materials."""

    def calculate(
        self,
        material: str,
        quantity_kg: float,
        batch_id: str | None = None,
    ) -> CarbonCalculation:
        """Calculate carbon footprint and savings for recycled material."""
        recycled_factor = RECYCLED_FACTORS.get(material, 0.43)
        virgin_factor = VIRGIN_FACTORS.get(material, 2.00)

        total_co2 = quantity_kg * recycled_factor
        virgin_co2 = quantity_kg * virgin_factor
        savings = virgin_co2 - total_co2

        return CarbonCalculation(
            batch_id=batch_id,
            material=material,
            quantity_kg=quantity_kg,
            emission_factor=recycled_factor,
            total_co2_kg=total_co2,
            savings_vs_virgin_kg=savings,
        )

    def get_material_factor(self, material: str) -> MaterialFactor:
        """Get the emission factor for a material type."""
        factor = RECYCLED_FACTORS.get(material, 0.43)
        return MaterialFactor(
            material=material,
            co2_per_kg=factor,
        )
