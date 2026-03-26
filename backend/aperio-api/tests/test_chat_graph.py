import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from src.domain.chat.graph import route_after_classify
from src.domain.chat.nodes import generate_reply


class TestRouteAfterClassify:
    def test_purchase_routes_to_extract(self):
        state = {"intent": "purchase"}
        assert route_after_classify(state) == "extract_entities"

    def test_processing_routes_to_extract(self):
        state = {"intent": "processing"}
        assert route_after_classify(state) == "extract_entities"

    def test_dispatch_routes_to_extract(self):
        state = {"intent": "dispatch"}
        assert route_after_classify(state) == "extract_entities"

    def test_query_routes_to_filter(self):
        state = {"intent": "query"}
        assert route_after_classify(state) == "build_query_filter"

    def test_report_routes_to_filter(self):
        state = {"intent": "report"}
        assert route_after_classify(state) == "build_query_filter"

    def test_unknown_routes_to_reply(self):
        state = {"intent": "unknown"}
        assert route_after_classify(state) == "generate_reply"


class TestGenerateReply:
    def test_stored_reply(self):
        state = {
            "db_result": {
                "action": "stored",
                "data": {"quantity_kg": 300, "material": "PET", "intent": "purchase"}
            }
        }
        result = generate_reply(state)
        assert "300" in result["reply"]
        assert "PET" in result["reply"]

    def test_queried_reply(self):
        state = {
            "db_result": {
                "action": "queried",
                "result": {"count": 5, "total_kg": 1500, "loss_pct": 2.0}
            }
        }
        result = generate_reply(state)
        assert "5" in result["reply"]
        assert "1500" in result["reply"]

    def test_fallback_reply(self):
        state = {"db_result": {}}
        result = generate_reply(state)
        assert "couldn't process" in result["reply"].lower()
