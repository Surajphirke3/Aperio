from fastapi import APIRouter, Depends, Query

from src.api.dependencies import verify_token
from src.infrastructure.db.repositories.entry_repo import EntryRepository
from src.shared.constants.thresholds import LOSS_THRESHOLDS

router = APIRouter(prefix="/anomalies", tags=["anomalies"])


@router.get("/")
async def get_anomalies(
    days: int = Query(default=30),
    user_id: str = Depends(verify_token),
):
    repo = EntryRepository()
    entries = await repo.get_with_losses(days)
    anomalies = []
    for e in entries:
        qty = e.get("quantity_kg", 0)
        loss = e.get("loss_kg", 0) or 0
        stage = e.get("stage", "processing")
        threshold = LOSS_THRESHOLDS.get(stage, 10.0)
        if qty > 0:
            loss_pct = (loss / qty) * 100
            if loss_pct > threshold:
                anomalies.append({
                    "id": str(e.get("_id", "")),
                    "batch_id": e.get("batch_id", ""),
                    "stage": stage,
                    "material": e.get("material"),
                    "loss_pct": round(loss_pct, 2),
                    "threshold": threshold,
                    "severity": "critical" if loss_pct > threshold * 2 else "warning",
                })
    return {"anomalies": anomalies, "count": len(anomalies)}
