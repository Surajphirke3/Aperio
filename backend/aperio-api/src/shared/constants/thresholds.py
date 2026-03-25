from typing import Final

LOSS_THRESHOLDS: Final[dict[str, float]] = {
    "collection": 5.0,
    "sorting": 8.0,
    "processing": 10.0,
    "output": 5.0,
    "dispatch": 2.0,
}
