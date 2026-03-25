import json
from datetime import datetime, timedelta
from fnmatch import fnmatch
from pathlib import Path

import redis.asyncio as aioredis

from src.config.settings import settings

_redis: aioredis.Redis | None = None
_cache_file = Path(__file__).resolve().parents[3] / ".local_cache" / "redis.json"


class LocalRedis:
    def __init__(self, file_path: Path):
        self.file_path = file_path
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.file_path.exists():
            self.file_path.write_text(json.dumps({"lists": {}, "expires_at": {}}), encoding="utf-8")

    def _load(self) -> dict:
        raw = self.file_path.read_text(encoding="utf-8").strip() or "{}"
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            data = {}
        lists = data.get("lists", {})
        expires_at = data.get("expires_at", {})
        return {"lists": lists, "expires_at": expires_at}

    def _save(self, data: dict) -> None:
        self.file_path.write_text(json.dumps(data, indent=2), encoding="utf-8")

    def _purge_expired(self, data: dict) -> dict:
        now = datetime.utcnow()
        expired_keys = []
        for key, value in data["expires_at"].items():
            try:
                if datetime.fromisoformat(value) <= now:
                    expired_keys.append(key)
            except ValueError:
                expired_keys.append(key)
        for key in expired_keys:
            data["lists"].pop(key, None)
            data["expires_at"].pop(key, None)
        if expired_keys:
            self._save(data)
        return data

    async def ping(self) -> bool:
        return True

    async def lrange(self, key: str, start: int, stop: int) -> list[str]:
        data = self._purge_expired(self._load())
        values = list(data["lists"].get(key, []))
        if stop == -1:
            return values[start:]
        return values[start: stop + 1]

    async def lpush(self, key: str, value: str) -> None:
        data = self._purge_expired(self._load())
        data["lists"].setdefault(key, [])
        data["lists"][key].insert(0, value)
        self._save(data)

    async def ltrim(self, key: str, start: int, stop: int) -> None:
        data = self._purge_expired(self._load())
        values = list(data["lists"].get(key, []))
        if stop == -1:
            data["lists"][key] = values[start:]
        else:
            data["lists"][key] = values[start: stop + 1]
        self._save(data)

    async def expire(self, key: str, seconds: int) -> None:
        data = self._purge_expired(self._load())
        data["expires_at"][key] = (datetime.utcnow() + timedelta(seconds=seconds)).isoformat()
        self._save(data)

    async def delete(self, key: str) -> None:
        data = self._purge_expired(self._load())
        data["lists"].pop(key, None)
        data["expires_at"].pop(key, None)
        self._save(data)

    async def keys(self, pattern: str) -> list[str]:
        data = self._purge_expired(self._load())
        return sorted(key for key in data["lists"] if fnmatch(key, pattern))

    async def close(self) -> None:
        return None


async def init_redis() -> None:
    global _redis
    client = aioredis.from_url(
        settings.redis_url,
        encoding="utf-8",
        decode_responses=True,
    )
    try:
        await client.ping()
        _redis = client
    except Exception:
        _redis = LocalRedis(_cache_file)


async def get_redis() -> aioredis.Redis | LocalRedis:
    if _redis is None:
        await init_redis()
    return _redis


async def close_redis() -> None:
    global _redis
    if _redis is not None:
        await _redis.close()
        _redis = None
