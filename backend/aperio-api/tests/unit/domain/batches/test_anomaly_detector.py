from src.domain.batches.models import Batch, BatchStage, BatchLifecycle
from src.domain.batches.anomaly_detector import detect_stage_anomaly, detect_batch_anomalies


def test_no_anomaly_within_threshold():
    lc = BatchLifecycle(stage=BatchStage.WASHING, quantity_kg=100, loss_kg=5)
    alert = detect_stage_anomaly(lc)
    assert alert is None


def test_anomaly_above_threshold():
    lc = BatchLifecycle(stage=BatchStage.WASHING, quantity_kg=100, loss_kg=15)
    alert = detect_stage_anomaly(lc)
    assert alert is not None
    assert alert.loss_pct == 15.0


def test_batch_anomalies_overall():
    batch = Batch(
        id="B001",
        material="PET",
        vendor="Vendor A",
        initial_quantity_kg=100,
        lifecycle=[
            BatchLifecycle(stage=BatchStage.SORTING, quantity_kg=100, loss_kg=6),
            BatchLifecycle(stage=BatchStage.WASHING, quantity_kg=94, loss_kg=10),
        ],
    )
    alerts = detect_batch_anomalies(batch)
    assert len(alerts) >= 1
