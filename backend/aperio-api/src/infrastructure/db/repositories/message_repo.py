from src.infrastructure.db.firestore import get_firestore
from datetime import datetime


class MessageRepository:
    """Persists chat messages to Firestore for long-term storage."""

    def __init__(self):
        self.db = get_firestore()
        self.collection_name = "chat_messages"

    async def save_message(self, session_id: str, role: str, content: str, intent: str | None = None) -> dict:
        data = {
            "session_id": session_id,
            "role": role,
            "content": content,
            "intent": intent,
            "created_at": datetime.utcnow().isoformat(),
        }
        ref = self.db.collection(self.collection_name).document()
        await ref.set(data)
        return {"id": ref.id, **data}

    async def get_session_messages(self, session_id: str, limit: int = 50) -> list[dict]:
        docs = await self.db.collection(self.collection_name) \
            .where("session_id", "==", session_id) \
            .order_by("created_at") \
            .limit(limit).get()
        return [{"id": d.id, **d.to_dict()} for d in docs]