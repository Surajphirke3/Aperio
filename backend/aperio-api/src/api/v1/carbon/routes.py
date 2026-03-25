from fastapi import APIRouter, Depends, Query

from src.api.dependencies import verify_token
from src.domain.carbon.calculator import CarbonCalculator

router = APIRouter(prefix="/carbon", tags=["carbon"])


@router.get("/")
async def get_carbon_data(
    days: int = Query(default=30),
    user_id: str = Depends(verify_token),
):
    return await CarbonCalculator().get_all(days)
