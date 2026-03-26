from typing import TypedDict, Optional, Annotated
from langgraph.graph import StateGraph, END
import operator

from .nodes import classify_intent, extract_entities, build_query_filter
from .nodes import store_entry, run_stats_query, generate_reply
from .models import IntentType


class ChatState(TypedDict):
    """Full state passed between LangGraph nodes."""
    session_id: str
    user_message: str
    history: list[dict]              # Last N messages from Redis
    similar_context: list[dict]      # Top-k cosine-similar past messages
    intent: Optional[IntentType]
    extracted_data: Optional[dict]   # Parsed entities or query filters
    db_result: Optional[dict]        # Result from Firestore
    reply: Optional[str]             # Final reply to user
    error: Optional[str]


def route_by_intent(state: ChatState) -> str:
    """Edge function: decides which node to call after classification."""
    intent = state.get("intent")
    if intent in (IntentType.QUERY, IntentType.REPORT):
        return "build_query_filter"
    elif intent in (IntentType.PURCHASE, IntentType.PROCESSING, IntentType.DISPATCH):
        return "extract_entities"
    return "generate_reply"  # fallback for unrecognized


def build_chat_graph() -> StateGraph:
    graph = StateGraph(ChatState)

    graph.add_node("classify_intent", classify_intent)
    graph.add_node("extract_entities", extract_entities)
    graph.add_node("build_query_filter", build_query_filter)
    graph.add_node("store_entry", store_entry)
    graph.add_node("run_stats_query", run_stats_query)
    graph.add_node("generate_reply", generate_reply)

    graph.set_entry_point("classify_intent")

    graph.add_conditional_edges(
        "classify_intent",
        route_by_intent,
        {
            "extract_entities": "extract_entities",
            "build_query_filter": "build_query_filter",
            "generate_reply": "generate_reply",
        }
    )

    graph.add_edge("extract_entities", "store_entry")
    graph.add_edge("build_query_filter", "run_stats_query")
    graph.add_edge("store_entry", "generate_reply")
    graph.add_edge("run_stats_query", "generate_reply")
    graph.add_edge("generate_reply", END)

    return graph.compile()


# Singleton — compiled once at startup
chat_graph = build_chat_graph()