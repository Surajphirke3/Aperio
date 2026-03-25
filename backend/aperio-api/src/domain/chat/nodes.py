"""Each node is a pure async function: (state) -> partial state dict.
Nodes never call each other directly — LangGraph wires the edges."""

from src.infrastructure.ai.adapter import FeatherlessAdapter
from src.infrastructure.ai.prompts.intent import INTENT_SYSTEM_PROMPT
from src.infrastructure.ai.prompts.entity import ENTITY_SYSTEM_PROMPT
from src.infrastructure.ai.prompts.query import QUERY_SYSTEM_PROMPT
from src.shared.utils.json_parser import extract_json
from .models import IntentType, ChatState


_adapter = FeatherlessAdapter()


async def classify_intent(state: ChatState) -> dict:
    """Node 1: classify user message intent via Qwen2.5-3B."""
    history_text = _format_history(state["history"])
    similar_text = _format_history(state["similar_context"])

    prompt = f"""Conversation so far:
{history_text}

Relevant past context:
{similar_text}

Current message: {state["user_message"]}"""

    response = await _adapter.complete(prompt, INTENT_SYSTEM_PROMPT)
    data = extract_json(response.content)
    intent_str = data.get("intent", "query").lower()

    try:
        intent = IntentType(intent_str)
    except ValueError:
        intent = IntentType.QUERY

    return {"intent": intent}


async def extract_entities(state: ChatState) -> dict:
    """Node 2a: extract structured entities from data-entry messages."""
    response = await _adapter.complete(state["user_message"], ENTITY_SYSTEM_PROMPT)
    data = extract_json(response.content)
    return {"extracted_data": data}


async def build_query_filter(state: ChatState) -> dict:
    """Node 2b: extract query filters from reporting questions."""
    response = await _adapter.complete(state["user_message"], QUERY_SYSTEM_PROMPT)
    data = extract_json(response.content)
    return {"extracted_data": data}


async def store_entry(state: ChatState) -> dict:
    """Node 3a: write extracted entity data to Firestore."""
    from src.infrastructure.db.firestore import FirestoreDB
    db = FirestoreDB()
    data = state["extracted_data"]
    data["session_id"] = state["session_id"]
    result = await db.create_entry(data)
    return {"db_result": {"action": "stored", "id": result["id"], "data": data}}


async def run_stats_query(state: ChatState) -> dict:
    """Node 3b: run aggregation query against Firestore."""
    from src.infrastructure.db.firestore import FirestoreDB
    db = FirestoreDB()
    filters = state["extracted_data"]
    result = await db.query_stats(filters)
    return {"db_result": {"action": "queried", "result": result}}


async def generate_reply(state: ChatState) -> dict:
    """Final node: compose human-readable reply from db_result."""
    db_result = state.get("db_result") or {}
    action = db_result.get("action")

    if action == "stored":
        d = db_result["data"]
        reply = f"✅ Logged: {d.get('quantity_kg')}kg {d.get('material')} — {d.get('intent')} recorded."
    elif action == "queried":
        result = db_result.get("result", {})
        reply = _format_query_result(result)
    else:
        reply = "I understood your message but could not process it. Please rephrase."

    return {"reply": reply}


def _format_history(messages: list[dict]) -> str:
    if not messages:
        return "(none)"
    return "\n".join(f"{m['role'].upper()}: {m['content']}" for m in messages)


def _format_query_result(result: dict) -> str:
    if not result:
        return "No data found for that query."
    lines = [f"- {k}: {v}" for k, v in result.items()]
    return "Here's what I found:\n" + "\n".join(lines)