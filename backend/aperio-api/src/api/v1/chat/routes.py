import uuid
import logging

from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File

from .schemas import ChatRequest, ChatResponse
from src.api.dependencies import verify_token
from src.domain.chat.graph import chat_graph
from src.domain.chat.memory import ChatMemory
from src.domain.chat.similarity import get_similar_context
from src.infrastructure.ai.groq_client import GroqAdapter

router = APIRouter(prefix="/chat", tags=["chat"])
_groq = GroqAdapter()
logger = logging.getLogger(__name__)


@router.post("/", response_model=ChatResponse)
async def send_message(
    message: str = Form(...),
    session_id: str | None = Form(None),
    audio: UploadFile | None = File(None),
    user_id: str = Depends(verify_token),
) -> ChatResponse:
    sid = session_id or str(uuid.uuid4())
    memory = ChatMemory(session_id=sid, user_id=user_id)

    user_message = message

    if audio:
        try:
            audio_bytes = await audio.read()
            if len(audio_bytes) > 25 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="Audio file too large (max 25MB)")
            user_message = await _groq.transcribe(audio_bytes, filename=audio.filename or "audio.webm")
        except HTTPException:
            raise
        except Exception as e:
            logger.warning(f"Whisper transcription failed: {e}")
            raise HTTPException(status_code=400, detail=f"Audio transcription failed: {str(e)}")

    try:
        history = await memory.get_history()
    except Exception as e:
        logger.error(f"Failed to load chat history: {e}")
        history = []

    try:
        similar_context = await get_similar_context(user_message, history)
    except Exception as e:
        logger.warning(f"Similarity search failed: {e}")
        similar_context = []

    try:
        groq_intent = await _groq.fast_classify(user_message)
    except Exception as e:
        logger.warning(f"Groq classification failed: {e}")
        groq_intent = "unknown"

    initial_state = {
        "session_id": sid,
        "user_message": user_message,
        "history": history,
        "similar_context": similar_context,
        "groq_intent": groq_intent,
        "intent": None,
        "extracted_data": None,
        "db_result": None,
        "reply": None,
        "error": None,
    }

    try:
        final_state = await chat_graph.ainvoke(initial_state)
    except Exception as e:
        logger.error(f"Chat pipeline failed: {e}")
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

    try:
        await memory.append("user", user_message, intent=groq_intent)
        await memory.append("assistant", final_state.get("reply", ""), intent=str(final_state.get("intent")))
    except Exception as e:
        logger.error(f"Failed to persist messages: {e}")

    db_result = final_state.get("db_result") or {}
    if db_result.get("action") == "stored":
        structured_data = db_result.get("data")
    elif db_result.get("action") == "queried":
        structured_data = db_result.get("result")
    else:
        structured_data = None

    return ChatResponse(
        session_id=sid,
        reply=final_state.get("reply", "I couldn't process that request."),
        intent=str(final_state.get("intent", groq_intent)),
        structured_data=structured_data,
        success=final_state.get("error") is None,
    )


@router.get("/sessions/{session_id}/history")
async def get_session_history(
    session_id: str,
    user_id: str = Depends(verify_token),
):
    memory = ChatMemory(session_id=session_id, user_id=user_id)
    history = await memory.get_history()
    return {"session_id": session_id, "messages": history, "count": len(history)}


@router.delete("/sessions/{session_id}")
async def clear_session(
    session_id: str,
    user_id: str = Depends(verify_token),
):
    memory = ChatMemory(session_id=session_id, user_id=user_id)
    await memory.clear()
    return {"message": "Session cleared", "session_id": session_id}


@router.get("/sessions")
async def list_user_sessions(
    user_id: str = Depends(verify_token),
):
    """List all chat sessions for the authenticated user."""
    memory = ChatMemory(session_id="", user_id=user_id)
    sessions = await memory.get_user_sessions(user_id)
    return {"user_id": user_id, "sessions": sessions, "count": len(sessions)}
