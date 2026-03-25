from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END

from .nodes import classify_intent, extract_entities, build_query_filter
from .nodes import store_entry, run_stats_query, generate_reply


class ChatState(TypedDict):
    session_id: str
    user_message: str
    history: list[dict]
    similar_context: list[dict]
    groq_intent: str
    intent: Optional[str]
    extracted_data: Optional[dict]
    db_result: Optional[dict]
    reply: Optional[str]
    error: Optional[str]


def route_after_classify(state: ChatState) -> str:
    intent = state.get("intent", "query")
    if intent in ("query", "report"):
        return "build_query_filter"
    if intent in ("purchase", "processing", "dispatch"):
        return "extract_entities"
    return "generate_reply"


def build_chat_graph():
    g = StateGraph(ChatState)

    g.add_node("classify_intent",    classify_intent)
    g.add_node("extract_entities",   extract_entities)
    g.add_node("build_query_filter", build_query_filter)
    g.add_node("store_entry",        store_entry)
    g.add_node("run_stats_query",    run_stats_query)
    g.add_node("generate_reply",     generate_reply)

    g.set_entry_point("classify_intent")
    g.add_conditional_edges("classify_intent", route_after_classify, {
        "extract_entities":   "extract_entities",
        "build_query_filter": "build_query_filter",
        "generate_reply":     "generate_reply",
    })
    g.add_edge("extract_entities",   "store_entry")
    g.add_edge("build_query_filter", "run_stats_query")
    g.add_edge("store_entry",        "generate_reply")
    g.add_edge("run_stats_query",    "generate_reply")
    g.add_edge("generate_reply",     END)

    return g.compile()


chat_graph = build_chat_graph()
