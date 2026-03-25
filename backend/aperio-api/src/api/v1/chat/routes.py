from fastapi import APIRouter, Depends, HTTPException
from .schemas import ChatRequest, ChatResponse
from src.domain.chat.services import ChatService
from src.domain.chat.exceptions import UnrecognizedIntentError
from src.api.dependencies import get_chat_service
from src.shared.utils.validators import sanitize_input

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def handle_chat(
    request: ChatRequest,
    chat_service: ChatService = Depends(get_chat_service),
) -> ChatResponse:
    """
    Process a natural language message.
    Routes to data entry or query based on detected intent.
    """
    try:
        # Sanitize input to prevent prompt injection
        sanitized_message = sanitize_input(request.message)
        result = await chat_service.process_message(sanitized_message)
        return ChatResponse(
            success=True,
            reply=result["reply"],
            action=result["action"],
            structured_data=result.get("entry") or result.get("data"),
        )
    except UnrecognizedIntentError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
