from enum import Enum
from typing import TypedDict, Optional
from pydantic import BaseModel


class IntentType(str, Enum):
    PURCHASE = "purchase"
    PROCESSING = "processing"
    DISPATCH = "dispatch"
    QUERY = "query"
    REPORT = "report"


class ChatState(TypedDict):
    """Full state passed between LangGraph nodes."""
    session_id: str
    user_message: str
    history: list[dict]
    similar_context: list[dict]
    intent: Optional[IntentType]
    extracted_data: Optional[dict]
    db_result: Optional[dict]
    reply: Optional[str]
    error: Optional[str]


class ParsedEntry(BaseModel):
    intent: str
    material: str | None = None
    quantity_kg: float | None = None
    date: str | None = None
    vendor: str | None = None
    stage: str | None = None
    loss_kg: float | None = None
    batch_id: str | None = None
    notes: str | None = None


class QueryFilter(BaseModel):
    metric: str | None = None
    material: str | None = None
    vendor: str | None = None
    date_from: str | None = None
    date_to: str | None = None
    aggregation: str | None = None
    group_by: str | None = None


class Message(BaseModel):
    role: str
    content: str
    intent: str | None = None
    timestamp: str | None = None