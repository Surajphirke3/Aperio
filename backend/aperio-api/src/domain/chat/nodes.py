import logging

from src.infrastructure.ai.featherless import FeatherlessAdapter
from src.infrastructure.ai.prompts.intent import INTENT_SYSTEM_PROMPT
from src.infrastructure.ai.prompts.entity import build_entity_prompt
from src.infrastructure.ai.prompts.query import QUERY_SYSTEM_PROMPT
from src.shared.utils.json_parser import extract_json
from src.shared.utils.dates import today_iso

_ai = FeatherlessAdapter()
logger = logging.getLogger(__name__)


def _format_history(messages: list[dict]) -> str:
    if not messages:
        return "(none)"
    return "\n".join(f"{m['role'].upper()}: {m['content']}" for m in messages)


async def classify_intent(state: dict) -> dict:
    groq_intent = state.get("groq_intent", "unknown")

    if groq_intent != "unknown":
        return {"intent": groq_intent}

    try:
        history = _format_history(state["history"][-6:])
        prompt = f"History:\n{history}\n\nMessage: {state['user_message']}"
        response = await _ai.complete(prompt, INTENT_SYSTEM_PROMPT)
        data = extract_json(response.content)
        return {"intent": data.get("intent", "query")}
    except Exception as e:
        logger.warning(f"Intent classification failed, defaulting to 'query': {e}")
        return {"intent": "query"}


async def extract_entities(state: dict) -> dict:
    try:
        prompt = state["user_message"]
        system = build_entity_prompt(today_iso())
        response = await _ai.complete(prompt, system)
        data = extract_json(response.content)
        return {"extracted_data": data}
    except Exception as e:
        logger.warning(f"Entity extraction failed: {e}")
        return {"extracted_data": None, "error": f"Entity extraction failed: {e}"}


async def build_query_filter(state: dict) -> dict:
    try:
        response = await _ai.complete(state["user_message"], QUERY_SYSTEM_PROMPT)
        data = extract_json(response.content)
        return {"extracted_data": data}
    except Exception as e:
        logger.warning(f"Query filter extraction failed: {e}")
        return {"extracted_data": None, "error": f"Query filter extraction failed: {e}"}


async def store_entry(state: dict) -> dict:
    if not state.get("extracted_data"):
        return {"db_result": None, "error": state.get("error", "No data to store")}
    try:
        from src.infrastructure.db.repositories.entry_repo import EntryRepository
        data = {**state["extracted_data"], "session_id": state["session_id"]}
        repo = EntryRepository()
        result = await repo.create(data)
        return {"db_result": {"action": "stored", "id": str(result.inserted_id), "data": data}}
    except Exception as e:
        logger.error(f"Failed to store entry: {e}")
        return {"db_result": None, "error": f"Database store failed: {e}"}


async def run_stats_query(state: dict) -> dict:
    if not state.get("extracted_data"):
        return {"db_result": None, "error": state.get("error", "No query filter available")}
    try:
        from src.infrastructure.db.repositories.entry_repo import EntryRepository
        repo = EntryRepository()
        result = await repo.query_stats(state["extracted_data"])
        return {"db_result": {"action": "queried", "result": result}}
    except Exception as e:
        logger.error(f"Stats query failed: {e}")
        return {"db_result": None, "error": f"Stats query failed: {e}"}


async def generate_reply(state: dict) -> dict:
    db = state.get("db_result") or {}
    action = db.get("action")
    error = state.get("error")

    if action == "stored":
        d = db["data"]
        reply = f"✅ Logged: {d.get('quantity_kg')}kg {d.get('material')} — {d.get('intent')} recorded."
    elif action == "queried":
        r = db.get("result", {})
        reply = (
            f"Found {r.get('count', 0)} entries totalling "
            f"{r.get('total_kg', 0)}kg. Loss: {r.get('loss_pct', 0)}%."
        )
    elif error:
        reply = (
            "⚠️ I understood your request but couldn't fully process it. "
            "The AI service may be temporarily unavailable. "
            "Please check your API keys (FEATHERLESS_API_KEY, GROQ_API_KEY) in the .env file and try again."
        )
    else:
        reply = "I couldn't process that. Try rephrasing — e.g. 'Purchased 200kg PET from Vendor A'."

    return {"reply": reply}
