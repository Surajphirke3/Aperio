import pytest
from src.domain.chat.services import ChatService
from src.infrastructure.adapters.ai.base import AIResponse


class MockAIResponse:
    def __init__(self, content: str):
        self.content = content
        self.model = "mock"
        self.tokens_used = 0


@pytest.fixture
def mock_ai_adapter():
    class MockAdapter:
        async def complete(self, prompt, system_prompt, max_tokens=512, temperature=0.1):
            return AIResponse(
                content='{"intent": "purchase", "material": "PET", "quantity_kg": 300}',
                model="mock",
                tokens_used=0,
            )

        async def health_check(self):
            return True

    return MockAdapter()


@pytest.fixture
def mock_batch_repo():
    class MockBatchRepo:
        async def create_entry(self, entry):
            return {
                "id": "test-batch",
                "material": entry.material.value,
                "quantity_kg": entry.quantity_kg,
            }

        async def get_batch(self, batch_id):
            return {"id": batch_id}

        async def list_batches(self, **filters):
            return []

        async def query_stats(self, filters):
            return {"metric": filters.metric, "value": 100}

    return MockBatchRepo()


@pytest.fixture
def chat_service(mock_ai_adapter, mock_batch_repo):
    return ChatService(ai_adapter=mock_ai_adapter, batch_repo=mock_batch_repo)
