import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from src.infrastructure.ai.adapter import AIResponse


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def mock_ai_adapter():
    """Mock FeatherlessAdapter that returns predictable responses."""
    adapter = AsyncMock()
    adapter.complete = AsyncMock(return_value=AIResponse(
        content='{"intent": "purchase", "confidence": 0.95}',
        model="test-model",
        tokens_used=50,
    ))
    return adapter


@pytest.fixture
def mock_redis():
    """Mock Redis client for testing without a real Redis instance."""
    redis = AsyncMock()
    redis.lrange = AsyncMock(return_value=[])
    redis.lpush = AsyncMock()
    redis.ltrim = AsyncMock()
    redis.expire = AsyncMock()
    redis.delete = AsyncMock()
    return redis


@pytest.fixture
def mock_firestore_db():
    """Mock FirestoreDB for testing without real Firestore."""
    db = AsyncMock()
    db.create_entry = AsyncMock(return_value={"id": "test-id-123"})
    db.query_stats = AsyncMock(return_value={
        "count": 5,
        "total_kg": 1500.0,
        "total_loss_kg": 30.0,
        "loss_pct": 2.0,
    })
    db.get_batches = AsyncMock(return_value=[])
    db.get_batch_by_id = AsyncMock(return_value=None)
    db.get_dashboard_stats = AsyncMock(return_value={
        "total_entries": 10,
        "by_material": {"PET": 500.0},
        "by_stage": {"collection": 500.0},
        "total_dispatched_kg": 200.0,
    })
    return db


@pytest.fixture
def sample_chat_state():
    """Sample initial ChatState for testing graph flows."""
    return {
        "session_id": "test-session-001",
        "user_message": "Purchased 300kg of PET bottles from Vendor A yesterday.",
        "history": [],
        "similar_context": [],
        "intent": None,
        "extracted_data": None,
        "db_result": None,
        "reply": None,
        "error": None,
    }