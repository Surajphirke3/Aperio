import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def mock_ai_response():
    from dataclasses import dataclass
    @dataclass
    class AIResponse:
        content: str
        model: str
        tokens_used: int
    return AIResponse


@pytest.fixture
def mock_redis():
    redis = AsyncMock()
    redis.lrange = AsyncMock(return_value=[])
    redis.lpush = AsyncMock()
    redis.ltrim = AsyncMock()
    redis.expire = AsyncMock()
    redis.delete = AsyncMock()
    redis.ping = AsyncMock(return_value=True)
    return redis


@pytest.fixture
def mock_mongo_col():
    col = AsyncMock()
    col.insert_one = AsyncMock()
    col.find = MagicMock()
    col.aggregate = MagicMock()
    col.count_documents = AsyncMock(return_value=0)
    return col
