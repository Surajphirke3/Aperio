from .models import Batch, BatchLifecycle
from src.shared.constants.thresholds import LOSS_THRESHOLDS, MAX_BATCH_LOSS_PCT


@dataclass
class AnomalyAlert:
    batch_id: str
    stage: str
    loss_pct: float
    threshold: float
    message: str


from dataclasses import dataclass


def detect_stage_anomaly(lifecycle: BatchLifecycle) -> AnomalyAlert | None:
    """Check if a single stage's loss exceeds the threshold."""
    threshold = LOSS_THRESHOLDS.get(lifecycle.stage.value, 5.0)
    if lifecycle.loss_pct > threshold:
        return AnomalyAlert(
            batch_id="",
            stage=lifecycle.stage.value,
            loss_pct=lifecycle.loss_pct,
            threshold=threshold,
            message=f"Loss {lifecycle.loss_pct:.1f}% exceeds threshold {threshold}% at {lifecycle.stage.value}",
        )
    return None


def detect_batch_anomalies(batch: Batch) -> list[AnomalyAlert]:
    """Check all stages and overall batch for anomalies."""
    alerts = []

    for lc in batch.lifecycle:
        alert = detect_stage_anomaly(lc)
        if alert:
            alert.batch_id = batch.id
            alerts.append(alert)

    if batch.total_loss_pct > MAX_BATCH_LOSS_PCT:
        alerts.append(
            AnomalyAlert(
                batch_id=batch.id,
                stage="overall",
                loss_pct=batch.total_loss_pct,
                threshold=MAX_BATCH_LOSS_PCT,
                message=f"Total batch loss {batch.total_loss_pct:.1f}% exceeds max {MAX_BATCH_LOSS_PCT}%",
            )
        )

    return alerts
