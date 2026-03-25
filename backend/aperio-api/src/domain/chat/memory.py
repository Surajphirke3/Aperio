import json
from datetime import datetime
from src.infrastructure.cache.redis_client import get_redis
from src.config.settings import settings


class ChatMemory:
    """Manages per-session conversation history in Redis.
    
    Design decisions:
    - Redis List (LPUSH + LTRIM) gives O(1) append + bounded size.
    - Each message is a JSON string: {role, content, timestamp, intent}.
    - TTL reset on every write — active sessions stay alive.
    """

    def __init__(self, session_id: str):
        self.session_id = session_id
        self.key = f"chat:session:{session_id}"
        self.ttl = settings.chat_session_ttl
        self.window = settings.context_window_messages

    async def get_history(self) -> list[dict]:
        redis = await get_redis()
        # LRANGE 0 N-1 returns newest-first due to LPUSH order; reverse for chronological
        raw = await redis.lrange(self.key, 0, self.window - 1)
        messages = [json.loads(m) for m in raw]
        return list(reversed(messages))  # chronological order

    async def append(self, role: str, content: str, intent: str | None = None) -> None:
        redis = await get_redis()
        message = json.dumps({
            "role": role,
            "content": content,
            "intent": intent,
            "timestamp": datetime.utcnow().isoformat(),
        })
        await redis.lpush(self.key, message)
        await redis.ltrim(self.key, 0, self.window - 1)  # keep bounded
        await redis.expire(self.key, self.ttl)            # reset TTL

    async def clear(self) -> None:
        redis = await get_redis()
        await redis.delete(self.key)