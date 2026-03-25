from pydantic import BaseModel, Field
from typing import Optional, Literal, Any
from datetime import datetime


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)


class ChatResponse(BaseModel):
    success: bool
    reply: str
    action: Literal["stored", "queried", "error"]
    structured_data: Optional[Any] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
