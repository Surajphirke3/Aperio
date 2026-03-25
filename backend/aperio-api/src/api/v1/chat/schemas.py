from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    intent: str
    structured_data: Optional[dict] = None
    success: bool = True


class SessionListResponse(BaseModel):
    session_id: str
    messages: list[dict]
    count: int