from fastapi import APIRouter, Query
from .schemas import CarbonStatsResponse
from src.domain.carbon.services import CarbonService

router = APIRouter(prefix="/carbon", tags=["carbon"])

carbon_service = CarbonService()


@router.get("/", response_model=CarbonStatsResponse)
async def get_carbon_stats(
    material: str = Query(default="PET", description="Material type"),
    quantity_kg: float = Query(default=0, description="Quantity in kg"),
) -> CarbonStatsResponse:
    """Calculate carbon footprint for recycled material."""
    calc = carbon_service.calculate(material=material, quantity_kg=quantity_kg)
    return CarbonStatsResponse(
        material=calc.material,
        quantity_kg=calc.quantity_kg,
        emission_factor=calc.emission_factor,
        total_co2_kg=calc.total_co2_kg,
        savings_vs_virgin_kg=calc.savings_vs_virgin_kg,
        savings_pct=calc.savings_pct,
    )
