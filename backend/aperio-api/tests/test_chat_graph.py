import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from src.domain.chat.models import IntentType
from src.domain.chat.nodes import classify_intent, extract_entities, build_query_filter, generate_reply
from src.domain.chat.graph import route_by_intent
from src.infrastructure.ai.adapter import AIResponse


@pytest.fixture
def purchase_state():
    return {
        "session_id": "test-001",
        "user_message": "Purchased 300kg of PET from Vendor A yesterday",
        "history": [],
        "similar_context": [],
        "intent": None,
        "extracted_data": None,
        "db_result": None,
        "reply": None,
        "error": None,
    }


@pytest.fixture
def query_state():
    return {
        "session_id": "test-002",
        "user_message": "How much PET was dispatched last week?",
        "history": [],
        "similar_context": [],
        "intent": None,
        "extracted_data": None,
        "db_result": None,
        "reply": None,
        "error": None,
    }


class TestRouteByIntent:
    def test_purchase_routes_to_extract(self):
        state = {"intent": IntentType.PURCHASE}
        assert route_by_intent(state) == "extract_entities"

    def test_processing_routes_to_extract(self):
        state = {"intent": IntentType.PROCESSING}
        assert route_by_intent(state) == "extract_entities"

    def test_dispatch_routes_to_extract(self):
        state = {"intent": IntentType.DISPATCH}
        assert route_by_intent(state) == "extract_entities"

    def test_query_routes_to_filter(self):
        state = {"intent": IntentType.QUERY}
        assert route_by_intent(state) == "build_query_filter"

    def test_report_routes_to_filter(self):
        state = {"intent": IntentType.REPORT}
        assert route_by_intent(state) == "build_query_filter"

    def test_none_routes_to_reply(self):
        state = {"intent": None}
        assert route_by_intent(state) == "generate_reply"


class TestClassifyIntent:
    @pytest.mark.asyncio
    async def test_classify_purchase(self, purchase_state):
        mock_response = AIResponse(
            content='{"intent": "purchase", "confidence": 0.95}',
            model="test",
            tokens_used=10,
        )
        with patch("src.domain.chat.nodes._adapter") as mock_adapter:
            mock_adapter.complete = AsyncMock(return_value=mock_response)
            result = await classify_intent(purchase_state)
            assert result["intent"] == IntentType.PURCHASE

    @pytest.mark.asyncio
    async def test_classify_fallback_to_query(self, purchase_state):
        mock_response = AIResponse(
            content='{"intent": "unknown_intent", "confidence": 0.5}',
            model="test",
            tokens_used=10,
        )
        with patch("src.domain.chat.nodes._adapter") as mock_adapter:
            mock_adapter.complete = AsyncMock(return_value=mock_response)
            result = await classify_intent(purchase_state)
            assert result["intent"] == IntentType.QUERY


class TestGenerateReply:
    @pytest.mark.asyncio
    async def test_stored_reply(self):
        state = {
            "db_result": {
                "action": "stored",
                "id": "abc",
                "data": {"quantity_kg": 300, "material": "PET", "intent": "purchase"},
            }
        }
        result = await generate_reply(state)
        assert "300" in result["reply"]
        assert "PET" in result["reply"]

    @pytest.mark.asyncio
    async def test_queried_reply(self):
        state = {
            "db_result": {
                "action": "queried",
                "result": {"count": 5, "total_kg": 1500.0},
            }
        }
        result = await generate_reply(state)
        assert "count" in result["reply"]

    @pytest.mark.asyncio
    async def test_empty_reply(self):
        state = {"db_result": None}
        result = await generate_reply(state)
        assert "rephrase" in result["reply"].lower()