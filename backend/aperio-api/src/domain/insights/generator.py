from src.infrastructure.ai.groq_client import GroqAdapter
from src.infrastructure.ai.prompts.insight import INSIGHT_SYSTEM_PROMPT, BATCH_INSIGHT_PROMPT
from src.domain.stats.aggregator import StatsAggregator
from src.infrastructure.db.repositories.batch_repo import BatchRepository
from src.shared.utils.json_parser import extract_json

_ai = GroqAdapter()


class InsightGenerator:
    async def generate_dashboard_narrative(self, days: int = 30) -> str:
        kpis = await StatsAggregator().get_kpis(days)
        stages = await StatsAggregator().get_stage_distribution(days)
        prompt = (
            f"Last {days} days data: {kpis}. "
            f"Stage breakdown: {stages['data']}. "
            "Generate a 3-sentence operational summary highlighting key metrics, "
            "any losses worth noting, and one actionable recommendation."
        )
        response = await _ai.complete(prompt, INSIGHT_SYSTEM_PROMPT, max_tokens=200)
        data = extract_json(response.content)
        return data.get("summary", response.content.strip())

    async def generate_batch_narrative(self, batch_id: str) -> dict:
        batch = await BatchRepository().get_by_id(batch_id)
        if not batch:
            return {"narrative": "Batch not found.", "traceability_score": 0, "anomalies": []}

        prompt = f"Batch data: {batch}. Analyze this batch's material journey, identify any losses or anomalies, and give a traceability score 0-100."
        response = await _ai.complete(prompt, BATCH_INSIGHT_PROMPT, max_tokens=300)
        data = extract_json(response.content)

        return {
            "narrative": data.get("narrative", response.content),
            "traceability_score": data.get("traceability_score", 75),
            "anomalies": data.get("anomalies", []),
        }
