from src.domain.batches.models import Batch, BatchStage, BatchLifecycle


def sample_batch_minimal() -> Batch:
    """A minimal batch with only purchase data."""
    return Batch(
        id="B001",
        material="PET",
        vendor="Vendor A",
        initial_quantity_kg=500.0,
    )


def sample_batch_full_lifecycle() -> Batch:
    """A batch that has gone through all processing stages."""
    return Batch(
        id="B002",
        material="HDPE",
        vendor="Vendor B",
        initial_quantity_kg=1000.0,
        current_stage=BatchStage.DISPATCH,
        lifecycle=[
            BatchLifecycle(stage=BatchStage.SORTING, quantity_kg=1000, loss_kg=30),
            BatchLifecycle(stage=BatchStage.WASHING, quantity_kg=970, loss_kg=50),
            BatchLifecycle(stage=BatchStage.SHREDDING, quantity_kg=920, loss_kg=20),
            BatchLifecycle(stage=BatchStage.EXTRUSION, quantity_kg=900, loss_kg=25),
            BatchLifecycle(stage=BatchStage.PELLETIZING, quantity_kg=875, loss_kg=10),
            BatchLifecycle(stage=BatchStage.DISPATCH, quantity_kg=865, loss_kg=5),
        ],
    )


def sample_batch_high_loss() -> Batch:
    """A batch with anomalously high loss at washing stage."""
    return Batch(
        id="B003",
        material="PP",
        vendor="Vendor C",
        initial_quantity_kg=800.0,
        current_stage=BatchStage.WASHING,
        lifecycle=[
            BatchLifecycle(stage=BatchStage.SORTING, quantity_kg=800, loss_kg=20),
            BatchLifecycle(stage=BatchStage.WASHING, quantity_kg=780, loss_kg=120),
        ],
    )
