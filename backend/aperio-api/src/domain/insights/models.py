from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class AnomalyAlert:
    """Represents an anomaly detected in batch processing."""
    batch_id: str
    stage: str
    loss_pct: float
    threshold: float
    message: str
    detected_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class BatchSummary:
    """Summary statistics for a batch."""
    batch_id: str
    material: str
    vendor: str
    initial_kg: float
    final_kg: float
    total_loss_pct: float
    stages_completed: int
    anomalies: list[AnomalyAlert] = field(default_factory=list)


@dataclass
class Insight:
    """AI-generated narrative insight about a batch or trend."""
    title: str
    narrative: str
    batch_id: Optional[str] = None
    category: str = "general"
    generated_at: datetime = field(default_factory=datetime.utcnow)
