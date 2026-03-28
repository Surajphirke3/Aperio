import json
from datetime import datetime
from typing import Optional

from src.infrastructure.cache.redis_client import get_redis
from src.infrastructure.db.mongo import sessions_col
from src.config.settings import settings


class ChatMemory:
    """Manages per-session conversation history with dual storage.
    
    Design decisions:
    - Redis: Fast read/write for active sessions
    - MongoDB: Persistent long-term storage with user association
    - Each message is a JSON string: {role, content, timestamp, intent, user_id}.
    - TTL reset on every write — active sessions stay alive in Redis.
    """

    def __init__(self, session_id: str, user_id: Optional[str] = None):
        self.session_id = session_id
        self.user_id = user_id or "anonymous"
        self.key = f"chat:session:{session_id}"
        self.ttl = settings.chat_session_ttl
        self.window = settings.context_window_messages

    async def get_history(self) -> list[dict]:
        redis = await get_redis()
        # Try Redis first (fast path)
        raw = await redis.lrange(self.key, 0, self.window - 1)
        if raw:
            messages = [json.loads(m) for m in raw]
            return list(reversed(messages))
        # Fallback to MongoDB if Redis is empty
        return await self.load_from_persistent_storage()

    async def load_from_persistent_storage(self) -> list[dict]:
        """Load session history from MongoDB (fallback if Redis is empty)."""
        try:
            doc = await sessions_col().find_one({"session_id": self.session_id, "user_id": self.user_id})
            if doc and "messages" in doc:
                return list(doc["messages"])
        except Exception:
            pass
        return []

    async def append(self, role: str, content: str, intent: str | None = None) -> None:
        redis = await get_redis()
        timestamp = datetime.utcnow().isoformat()
        message = json.dumps({
            "role": role,
            "content": content,
            "intent": intent,
            "timestamp": timestamp,
            "user_id": self.user_id,
        })
        # Update Redis (fast access)
        await redis.lpush(self.key, message)
        await redis.ltrim(self.key, 0, self.window - 1)
        await redis.expire(self.key, self.ttl)
        
        # Update MongoDB (persistent storage)
        try:
            await sessions_col().update_one(
                {"session_id": self.session_id, "user_id": self.user_id},
                {
                    "$set": {
                        "session_id": self.session_id,
                        "user_id": self.user_id,
                        "updated_at": timestamp,
                    },
                    "$push": {
                        "messages": {
                            "$each": [{"role": role, "content": content, "intent": intent, "timestamp": timestamp}],
                            "$slice": -self.window,
                        }
                    },
                },
                upsert=True,
            )
        except Exception as e:
            import logging
            logging.getLogger(__name__).warning(f"Failed to persist session to MongoDB: {e}")

    async def clear(self) -> None:
        redis = await get_redis()
        await redis.delete(self.key)
        try:
            await sessions_col().delete_one({"session_id": self.session_id, "user_id": self.user_id})
        except Exception:
            pass

    async def get_user_sessions(self, user_id: str) -> list[dict]:
        """Get all session IDs for a specific user from MongoDB."""
        try:
            cursor = sessions_col().find(
                {"user_id": user_id},
                {"session_id": 1, "updated_at": 1, "messages": {"$slice": -1}}
            ).sort("updated_at", -1).limit(50)
            sessions = []
            async for doc in cursor:
                doc.pop("_id", None)
                sessions.append({
                    "session_id": doc["session_id"],
                    "last_updated": doc.get("updated_at"),
                    "preview": doc.get("messages", [{}])[-1].get("content", "")[:50] + "..." if doc.get("messages") else "",
                })
            return sessions
        except Exception:
            return []