import pytest
from src.domain.chat.services import ChatService
from src.domain.chat.models import IntentType
from src.infrastructure.adapters.ai.base import AIResponse


class MockAIAdapter:
    def __init__(self, response_content: str = '{"intent": "purchase"}'):
        self.response_content = response_content

    async def complete(self, prompt, system_prompt, max_tokens=512, temperature=0.1):
        return AIResponse(content=self.response_content, model="mock", tokens_used=0)

    async def health_check(self):
        return True


class MockBatchRepo:
    async def create_entry(self, entry):
        return {"id": "test-batch", "material": entry.material.value, "quantity_kg": entry.quantity_kg}

    async def get_batch(self, batch_id):
        return {"id": batch_id}

    async def list_batches(self, **filters):
        return []

    async def query_stats(self, filters):
        return {"metric": filters.metric, "value": 100}


@pytest.mark.asyncio
async def test_process_purchase_message():
    ai = MockAIAdapter('{"intent": "purchase"}')
    repo = MockBatchRepo()
    service = ChatService(ai_adapter=ai, batch_repo=repo)

    # Override _classify_intent to return PURCHASE directly
    ai.response_content = '{"intent": "purchase"}'
    # The second call for entity extraction
    class DualMockAI:
        def __init__(self):
            self.call_count = 0
        async def complete(self, prompt, system_prompt, max_tokens=512, temperature=0.1):
            self.call_count += 1
            if self.call_count == 1:
                return AIResponse(content='{"intent": "purchase"}', model="mock", tokens_used=0)
            return AIResponse(content='{"material": "PET", "quantity_kg": 300, "date": "today"}', model="mock", tokens_used=0)
        async def health_check(self):
            return True

    service.ai = DualMockAI()
    result = await service.process_message("Bought 300kg PET from Vendor A")
    assert result["action"] == "stored"


@pytest.mark.asyncio
async def test_process_query_message():
    class DualMockAI:
        def __init__(self):
            self.call_count = 0
        async def complete(self, prompt, system_prompt, max_tokens=512, temperature=0.1):
            self.call_count += 1
            if self.call_count == 1:
                return AIResponse(content='{"intent": "query"}', model="mock", tokens_used=0)
            return AIResponse(content='{"metric": "total"}', model="mock", tokens_used=0)
        async def health_check(self):
            return True

    repo = MockBatchRepo()
    service = ChatService(ai_adapter=DualMockAI(), batch_repo=repo)
    result = await service.process_message("How much was dispatched?")
    assert result["action"] == "queried"
