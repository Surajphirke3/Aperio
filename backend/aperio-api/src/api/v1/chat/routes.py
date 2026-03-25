from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
import uuid

from .schemas import ChatRequest, ChatResponse, SessionListResponse
from src.domain.chat.graph import chat_graph
from src.domain.chat.memory import ChatMemory
from src.domain.chat.similarity import get_similar_context
from src.api.dependencies import verify_token

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    user_id: str = Depends(verify_token),
) -> ChatResponse:
    """
    Core chat endpoint.
    1. Load session history from Redis
    2. Retrieve cosine-similar context
    3. Run LangGraph pipeline
    4. Persist messages to Redis + Firestore
    5. Return structured response
    """
    session_id = request.session_id or str(uuid.uuid4())
    memory = ChatMemory(session_id=session_id)

    history = await memory.get_history()
    similar_context = await get_similar_context(request.message, history)

    initial_state = {
        "session_id": session_id,
        "user_message": request.message,
        "history": history,
        "similar_context": similar_context,
        "intent": None,
        "extracted_data": None,
        "db_result": None,
        "reply": None,
        "error": None,
    }

    try:
        final_state = await chat_graph.ainvoke(initial_state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat pipeline failed: {str(e)}")

    # Persist to Redis session memory
    await memory.append("user", request.message, intent=None)
    await memory.append(
        "assistant",
        final_state["reply"],
        intent=str(final_state.get("intent")),
    )

    return ChatResponse(
        session_id=session_id,
        reply=final_state["reply"],
        intent=str(final_state.get("intent", "unknown")),
        structured_data=final_state.get("db_result"),
        success=True,
    )


@router.get("/sessions/{session_id}/history")
async def get_session_history(
    session_id: str,
    user_id: str = Depends(verify_token),
):
    memory = ChatMemory(session_id=session_id)
    history = await memory.get_history()
    return {"session_id": session_id, "messages": history, "count": len(history)}


@router.delete("/sessions/{session_id}")
async def clear_session(
    session_id: str,
    user_id: str = Depends(verify_token),
):
    memory = ChatMemory(session_id=session_id)
    await memory.clear()
    return {"message": "Session cleared", "session_id": session_id}