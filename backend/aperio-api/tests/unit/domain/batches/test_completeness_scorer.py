from src.domain.batches.models import Batch, BatchStage, BatchLifecycle
from src.domain.batches.completeness_scorer import calculate_completeness


def test_empty_batch_completeness():
    batch = Batch(
        id="B001",
        material="PET",
        vendor="Vendor A",
        initial_quantity_kg=100,
    )
    score = calculate_completeness(batch)
    assert score == 1.0  # All purchase fields filled


def test_batch_with_lifecycle():
    batch = Batch(
        id="B001",
        material="PET",
        vendor="Vendor A",
        initial_quantity_kg=100,
        lifecycle=[
            BatchLifecycle(stage=BatchStage.SORTING, quantity_kg=95, loss_kg=5),
            BatchLifecycle(stage=BatchStage.WASHING, quantity_kg=88, loss_kg=7),
        ],
    )
    score = calculate_completeness(batch)
    assert 0.0 < score <= 1.0


def test_incomplete_batch():
    batch = Batch(
        id="B002",
        material="",
        vendor="",
        initial_quantity_kg=0,
    )
    score = calculate_completeness(batch)
    assert score == 0.0
