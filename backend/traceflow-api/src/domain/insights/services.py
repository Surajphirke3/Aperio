from .models import Insight, BatchSummary
from src.shared.types.protocols import AIAdapterProtocol, BatchRepositoryProtocol


class InsightService:
    """Insight generation orchestration."""

    def __init__(
        self,
        ai_adapter: AIAdapterProtocol,
        batch_repo: BatchRepositoryProtocol,
    ):
        self.ai = ai_adapter
        self.batch_repo = batch_repo

    async def generate_batch_insight(self, batch_id: str) -> Insight:
        """Generate an AI narrative insight for a specific batch."""
        batch = await self.batch_repo.get_batch(batch_id)
        from src.infrastructure.adapters.ai.prompts.insight_prompt import INSIGHT_SYSTEM_PROMPT

        prompt = f"Generate insight for batch: {batch}"
        response = await self.ai.complete(prompt, INSIGHT_SYSTEM_PROMPT)

        return Insight(
            title=f"Insight for Batch {batch_id}",
            narrative=response.content,
            batch_id=batch_id,
            category="batch_analysis",
        )

    async def generate_summary(self, batch_id: str) -> BatchSummary:
        """Generate a statistical summary for a batch."""
        batch = await self.batch_repo.get_batch(batch_id)
        # Build summary from batch data
        return BatchSummary(
            batch_id=batch_id,
            material=getattr(batch, "material", "unknown"),
            vendor=getattr(batch, "vendor", "unknown"),
            initial_kg=getattr(batch, "initial_quantity_kg", 0),
            final_kg=getattr(batch, "current_quantity_kg", 0),
            total_loss_pct=getattr(batch, "total_loss_pct", 0),
            stages_completed=len(getattr(batch, "lifecycle", [])),
        )
