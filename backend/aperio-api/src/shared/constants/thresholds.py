# Loss percentage thresholds per processing stage
# Values represent the maximum acceptable loss % before triggering an anomaly alert

LOSS_THRESHOLDS: dict[str, float] = {
    "sorting": 5.0,
    "washing": 8.0,
    "shredding": 3.0,
    "extrusion": 4.0,
    "pelletizing": 2.0,
    "dispatch": 1.0,
}

# Overall batch loss threshold
MAX_BATCH_LOSS_PCT: float = 15.0
