import json
from src.infrastructure.ai.adapter import FeatherlessAdapter
from src.infrastructure.ai.prompts.insight import INSIGHT_SYSTEM_PROMPT
from src.infrastructure.db.firestore import FirestoreDB
from src.shared.utils.json_parser import extract_json


class InsightService:
    """AI-driven batch narrative generation."""

    def __init__(self):
        self.adapter = FeatherlessAdapter()
        self.db = FirestoreDB()

    async def generate_insight(self, batch_id: str) -> dict:
        batch = await self.db.get_batch_by_id(batch_id)
        if not batch:
            raise ValueError(f"Batch not found: {batch_id}")

        prompt = f"Analyze this batch lifecycle data:\n{json.dumps(batch, indent=2)}"
        response = await self.adapter.complete(prompt, INSIGHT_SYSTEM_PROMPT)
        insight = extract_json(response.content)

        return {
            "batch_id": batch_id,
            "narrative": insight.get("narrative") or insight.get("summary", "No narrative generated."),
            "anomalies": insight.get("anomalies", []),
            "recommendations": insight.get("recommendations", []),
            "risk_level": insight.get("risk_level", "low"),
        }
