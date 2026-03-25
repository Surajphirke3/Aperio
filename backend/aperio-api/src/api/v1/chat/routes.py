import uuid

from fastapi import APIRouter, Depends, HTTPException

from .schemas import ChatRequest, ChatResponse
from src.api.dependencies import verify_token
from src.domain.chat.graph import chat_graph
from src.domain.chat.memory import ChatMemory
from src.domain.chat.similarity import get_similar_context
from src.infrastructure.ai.groq_client import GroqAdapter

router = APIRouter(prefix="/chat", tags=["chat"])
_groq = GroqAdapter()


@router.post("/", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    user_id: str = Depends(verify_token),
) -> ChatResponse:
    session_id = request.session_id or str(uuid.uuid4())
    memory = ChatMemory(session_id=session_id)

    history = await memory.get_history()
    similar_context = await get_similar_context(request.message, history)

    groq_intent = await _groq.fast_classify(request.message)

    initial_state = {
        "session_id": session_id,
        "user_message": request.message,
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
        raise HTTPException(status_code=500, detail=f"Chat pipeline failed: {str(e)}")

    await memory.append("user", request.message, intent=groq_intent)
    await memory.append("assistant", final_state["reply"], intent=str(final_state.get("intent")))

    db_result = final_state.get("db_result") or {}
    if db_result.get("action") == "stored":
        structured_data = db_result.get("data")
    elif db_result.get("action") == "queried":
        structured_data = db_result.get("result")
    else:
        structured_data = None

    return ChatResponse(
        session_id=session_id,
        reply=final_state["reply"],
        intent=str(final_state.get("intent", "unknown")),
        structured_data=structured_data,
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
