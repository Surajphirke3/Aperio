import json
import uuid
from .models import ParsedEntry, QueryFilter, IntentType, MaterialType
from .exceptions import UnrecognizedIntentError
from src.shared.types.protocols import AIAdapterProtocol, BatchRepositoryProtocol
from src.shared.utils.json_parser import extract_json
from src.shared.utils.dates import parse_relative_date
from src.infrastructure.adapters.ai.prompts.intent_prompt import INTENT_SYSTEM_PROMPT
from src.infrastructure.adapters.ai.prompts.entity_prompt import ENTITY_SYSTEM_PROMPT
from src.infrastructure.adapters.ai.prompts.query_prompt import QUERY_SYSTEM_PROMPT


class ChatService:
    """Orchestrates the chat pipeline.
    
    Depends on ABSTRACTIONS (protocols), not concrete implementations.
    This makes it fully unit-testable with mocks.
    """

    def __init__(
        self,
        ai_adapter: AIAdapterProtocol,
        batch_repo: BatchRepositoryProtocol,
    ):
        self.ai = ai_adapter
        self.batch_repo = batch_repo

    async def process_message(self, message: str) -> dict:
        """Main entry point: routes NL message to correct handler."""
        
        # Step 1: Classify intent
        intent = await self._classify_intent(message)

        if intent in (IntentType.QUERY, IntentType.REPORT):
            return await self._handle_query(message)
        elif intent in (IntentType.PURCHASE, IntentType.PROCESSING, IntentType.DISPATCH):
            return await self._handle_entry(message, intent)
        else:
            raise UnrecognizedIntentError(f"Cannot handle intent: {intent}")

    async def _classify_intent(self, message: str) -> IntentType:
        response = await self.ai.complete(message, INTENT_SYSTEM_PROMPT)
        # Parse intent from LLM response
        return _parse_intent_response(response.content)

    async def _handle_entry(self, message: str, intent: IntentType) -> dict:
        response = await self.ai.complete(message, ENTITY_SYSTEM_PROMPT)
        entry = _parse_entry_response(response.content, intent)
        saved = await self.batch_repo.create_entry(entry)
        return {
            "action": "stored",
            "entry": saved,
            "reply": f"[SUCCESS] Logged: {entry.quantity_kg}kg {entry.material.value}",
        }

    async def _handle_query(self, message: str) -> dict:
        response = await self.ai.complete(message, QUERY_SYSTEM_PROMPT)
        filters = _parse_query_filter(response.content)
        result = await self.batch_repo.query_stats(filters)
        return {
            "action": "queried",
            "data": result,
            "reply": _format_query_result(result, filters),
        }


def _parse_intent_response(raw: str) -> IntentType:
    """Extract intent from LLM JSON response."""
    data = extract_json(raw)
    return IntentType(data.get("intent", "query"))


def _parse_entry_response(raw: str, intent: IntentType) -> ParsedEntry:
    """Extract entities from LLM JSON response."""
    data = extract_json(raw)
    # Auto-generate batch_id if not provided to avoid collisions
    batch_id = data.get("batch_id")
    if not batch_id:
        batch_id = f"B-{uuid.uuid4().hex[:12].upper()}"
    return ParsedEntry(
        intent=intent,
        material=MaterialType(data.get("material", "PET")),
        quantity_kg=float(data.get("quantity_kg", 0)),
        date=parse_relative_date(data.get("date", "today")),
        vendor=data.get("vendor"),
        stage=data.get("stage"),
        loss_kg=data.get("loss_kg"),
        batch_id=batch_id,
    )


def _parse_query_filter(raw: str) -> QueryFilter:
    data = extract_json(raw)
    return QueryFilter(metric=data.get("metric", "total"))


def _format_query_result(result: dict, filters: QueryFilter) -> str:
    return f"Found: {result}"  # expand in real impl
