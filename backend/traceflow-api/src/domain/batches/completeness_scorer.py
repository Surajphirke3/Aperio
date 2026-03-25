from .models import Batch, BatchStage


# Fields expected at each stage
STAGE_REQUIRED_FIELDS: dict[str, list[str]] = {
    "purchase": ["material", "vendor", "initial_quantity_kg"],
    "sorting": ["quantity_kg", "loss_kg"],
    "washing": ["quantity_kg", "loss_kg"],
    "shredding": ["quantity_kg", "loss_kg"],
    "extrusion": ["quantity_kg", "loss_kg"],
    "pelletizing": ["quantity_kg", "loss_kg"],
    "dispatch": ["quantity_kg"],
}


def calculate_completeness(batch: Batch) -> float:
    """Calculate data completeness score (0.0 to 1.0) for a batch.
    
    Checks how many expected fields are populated across all recorded stages.
    """
    total_fields = 0
    filled_fields = 0

    # Check purchase-level fields
    purchase_fields = STAGE_REQUIRED_FIELDS["purchase"]
    total_fields += len(purchase_fields)
    if batch.material:
        filled_fields += 1
    if batch.vendor:
        filled_fields += 1
    if batch.initial_quantity_kg > 0:
        filled_fields += 1

    # Check lifecycle stage fields
    for lc in batch.lifecycle:
        stage_fields = STAGE_REQUIRED_FIELDS.get(lc.stage.value, [])
        total_fields += len(stage_fields)
        if lc.quantity_kg > 0:
            filled_fields += 1
        if "loss_kg" in stage_fields and lc.loss_kg is not None:
            filled_fields += 1

    if total_fields == 0:
        return 0.0

    return filled_fields / total_fields
