from .models import Batch, BatchStage, BatchLifecycle
from .exceptions import BatchNotFoundError, InvalidStageTransitionError


class BatchService:
    """Batch creation and stage progression logic."""

    STAGE_ORDER = list(BatchStage)

    def create_batch(
        self,
        batch_id: str,
        material: str,
        vendor: str,
        quantity_kg: float,
    ) -> Batch:
        """Create a new batch at the purchase stage."""
        return Batch(
            id=batch_id,
            material=material,
            vendor=vendor,
            initial_quantity_kg=quantity_kg,
            current_stage=BatchStage.PURCHASE,
        )

    def advance_stage(
        self,
        batch: Batch,
        quantity_kg: float,
        loss_kg: float = 0.0,
        notes: str | None = None,
    ) -> Batch:
        """Move batch to the next processing stage."""
        current_idx = self.STAGE_ORDER.index(batch.current_stage)
        if current_idx >= len(self.STAGE_ORDER) - 1:
            raise InvalidStageTransitionError(
                f"Batch {batch.id} is already at final stage: {batch.current_stage.value}"
            )

        next_stage = self.STAGE_ORDER[current_idx + 1]
        lifecycle_entry = BatchLifecycle(
            stage=next_stage,
            quantity_kg=quantity_kg,
            loss_kg=loss_kg,
            notes=notes,
        )
        batch.lifecycle.append(lifecycle_entry)
        batch.current_stage = next_stage
        return batch
