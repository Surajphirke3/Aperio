# architecture-python.md — Enterprise Architecture Reference
## Aperio — Python Backend Project Structure
### For immediate team use

---

## Dependency Flow (Read This First)

```
┌─────────────────────────────────────────────────────────┐
│                      api/v1/                            │  ← HTTP layer only
│         chat/  |  batches/  |  stats/  |  vendors/      │    No business logic
└──────────────────────────┬──────────────────────────────┘
                           │ calls
┌──────────────────────────▼──────────────────────────────┐
│                      domain/                            │  ← All business rules
│      chat/  |  batches/  |  insights/  |  carbon/       │    Pure Python, no I/O
└──────────────────────────┬──────────────────────────────┘
                           │ uses
┌──────────────────────────▼──────────────────────────────┐
│                  infrastructure/                        │  ← External world
│    repositories/ | adapters/ai/ | database/ | cache/    │    DB, LLMs, external
└──────────────────────────┬──────────────────────────────┘
                           │ uses
┌──────────────────────────▼──────────────────────────────┐
│                      shared/                            │  ← Pure utilities
│           utils/  |  types/  |  constants/              │    No side effects
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                      config/                            │  ← Configuration
│                  (used by all layers)                   │    Read-only from above
└─────────────────────────────────────────────────────────┘

RULE: domain/ has ZERO imports from infrastructure/, api/, or config/.
      It only imports from shared/. This makes it fully unit-testable.
```

---

## Complete Folder Structure

```
aperio-api/
│
├── src/
│   │
│   ├── domain/                            # 🧠 Pure business logic
│   │   │                                  # NO external I/O — fully unit-testable
│   │   ├── chat/
│   │   │   ├── __init__.py
│   │   │   ├── models.py                  # ChatIntent, ParsedEntry, QueryFilter
│   │   │   ├── services.py                # Intent routing, orchestration
│   │   │   ├── intent_classifier.py       # Pure classification logic
│   │   │   ├── entity_extractor.py        # Entity extraction + validation
│   │   │   └── exceptions.py             # AmbiguousIntentError, etc.
│   │   │
│   │   ├── batches/
│   │   │   ├── __init__.py
│   │   │   ├── models.py                  # Batch, BatchStage, BatchLifecycle
│   │   │   ├── services.py                # Batch creation, stage progression
│   │   │   ├── anomaly_detector.py        # Loss threshold business rules
│   │   │   ├── completeness_scorer.py     # Data completeness calculation
│   │   │   └── exceptions.py             # BatchNotFoundError, etc.
│   │   │
│   │   ├── insights/
│   │   │   ├── __init__.py
│   │   │   ├── models.py                  # Insight, AnomalyAlert, BatchSummary
│   │   │   ├── services.py                # Insight generation orchestration
│   │   │   └── exceptions.py
│   │   │
│   │   ├── vendors/
│   │   │   ├── __init__.py
│   │   │   ├── models.py                  # Vendor, VendorScorecard
│   │   │   ├── services.py                # Scorecard calculation
│   │   │   └── exceptions.py
│   │   │
│   │   └── carbon/
│   │       ├── __init__.py
│   │       ├── models.py                  # CarbonCalculation, MaterialFactor
│   │       ├── services.py                # CO₂ calculation logic
│   │       └── exceptions.py
│   │
│   ├── infrastructure/                    # 🔌 External world integrations
│   │   │
│   │   ├── repositories/                  # Data access (depends on database/)
│   │   │   ├── __init__.py
│   │   │   ├── batch_repository.py        # CRUD for batches
│   │   │   ├── entry_repository.py        # CRUD for material entries
│   │   │   ├── vendor_repository.py       # CRUD for vendors
│   │   │   └── stats_repository.py        # Aggregation queries
│   │   │
│   │   ├── adapters/                      # External service integrations
│   │   │   ├── __init__.py
│   │   │   ├── ai/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py                # AIAdapter abstract base class
│   │   │   │   ├── featherless.py         # Featherless API adapter
│   │   │   │   ├── ollama.py              # Ollama local adapter
│   │   │   │   ├── factory.py             # Returns correct adapter from config
│   │   │   │   └── prompts/
│   │   │   │       ├── __init__.py
│   │   │   │       ├── intent_prompt.py   # Intent classification prompt
│   │   │   │       ├── entity_prompt.py   # Entity extraction prompt
│   │   │   │       ├── insight_prompt.py  # Batch narrative prompt
│   │   │   │       └── query_prompt.py    # NL query → filter prompt
│   │   │   └── kaggle/
│   │   │       ├── __init__.py
│   │   │       └── transformer.py         # CSV → domain models
│   │   │
│   │   └── database/
│   │       ├── __init__.py
│   │       ├── connection.py              # SQLAlchemy engine + session factory
│   │       ├── models.py                  # ORM models (separate from domain models)
│   │       └── migrations/                # Alembic migrations
│   │           └── versions/
│   │
│   ├── api/                               # 🌐 HTTP presentation layer
│   │   ├── __init__.py
│   │   ├── app.py                         # FastAPI app factory
│   │   ├── dependencies.py                # Shared FastAPI dependencies (DI)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py                  # Combines all v1 routers
│   │       ├── chat/
│   │       │   ├── __init__.py
│   │       │   ├── routes.py              # POST /v1/chat
│   │       │   └── schemas.py             # ChatRequest, ChatResponse (Pydantic)
│   │       ├── batches/
│   │       │   ├── __init__.py
│   │       │   ├── routes.py              # GET /v1/batches, GET /v1/batches/{id}
│   │       │   └── schemas.py             # BatchResponse, BatchListResponse
│   │       ├── stats/
│   │       │   ├── __init__.py
│   │       │   ├── routes.py              # GET /v1/stats
│   │       │   └── schemas.py             # DashboardStatsResponse, SankeyResponse
│   │       ├── vendors/
│   │       │   ├── __init__.py
│   │       │   ├── routes.py              # GET /v1/vendors
│   │       │   └── schemas.py             # VendorResponse, ScorecardResponse
│   │       ├── insights/
│   │       │   ├── __init__.py
│   │       │   ├── routes.py              # POST /v1/insights/{batch_id}
│   │       │   └── schemas.py             # InsightResponse
│   │       └── carbon/
│   │           ├── __init__.py
│   │           ├── routes.py              # GET /v1/carbon
│   │           └── schemas.py             # CarbonStatsResponse
│   │
│   ├── shared/                            # 🔄 Pure utilities (no side effects)
│   │   ├── __init__.py
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── dates.py                   # Date parsing ("yesterday" → ISO)
│   │   │   ├── json_parser.py             # Robust LLM JSON extraction
│   │   │   └── validators.py              # Zod-equivalent validation helpers
│   │   ├── types/
│   │   │   ├── __init__.py
│   │   │   └── protocols.py               # Python Protocols (interfaces)
│   │   └── constants/
│   │       ├── __init__.py
│   │       ├── materials.py               # MaterialType enum
│   │       ├── stages.py                  # ProcessStage enum
│   │       └── thresholds.py              # Loss % thresholds per stage
│   │
│   └── config/
│       ├── __init__.py
│       ├── settings.py                    # Pydantic BaseSettings — validated env
│       └── logging.py                     # Structured logging config
│
├── tests/
│   ├── unit/
│   │   ├── domain/
│   │   │   ├── chat/
│   │   │   │   ├── test_intent_classifier.py
│   │   │   │   ├── test_entity_extractor.py
│   │   │   │   └── test_chat_service.py
│   │   │   ├── batches/
│   │   │   │   ├── test_anomaly_detector.py
│   │   │   │   └── test_completeness_scorer.py
│   │   │   └── carbon/
│   │   │       └── test_carbon_service.py
│   │   └── shared/
│   │       ├── test_date_utils.py
│   │       └── test_json_parser.py
│   │
│   ├── integration/
│   │   ├── test_chat_flow.py              # Chat → DB full flow
│   │   ├── test_stats_aggregation.py      # DB → stats endpoint
│   │   └── test_ai_adapters.py            # LLM adapter integration
│   │
│   └── fixtures/
│       ├── __init__.py
│       ├── conftest.py                    # pytest fixtures (DB, AI mock)
│       ├── batch_fixtures.py              # Sample batch data
│       └── sample_inputs.py              # 20+ NL test inputs + expected outputs
│
├── scripts/
│   ├── seed_db.py                         # Load Kaggle dataset into DB
│   └── test_prompts.py                    # Manual prompt testing script
│
├── alembic.ini
├── pyproject.toml                         # Dependencies + tool config
├── .env.example
└── README.md
```

---

## Critical File Contents

### `src/config/settings.py` — Validated Settings
```python
from pydantic_settings import BaseSettings
from pydantic import Field, validator
from enum import Enum


class AIProvider(str, Enum):
    FEATHERLESS = "featherless"
    OLLAMA = "ollama"


class Settings(BaseSettings):
    # AI Configuration
    ai_provider: AIProvider = AIProvider.FEATHERLESS
    featherless_api_key: str = Field(default="", description="Featherless API key")
    ollama_base_url: str = Field(default="http://localhost:11434")
    primary_model: str = Field(default="meta-llama/Llama-3.2-3B-Instruct")
    fallback_model: str = Field(default="Qwen/Qwen2.5-3B-Instruct")

    # Database
    database_url: str = Field(default="sqlite:///./aperio.db")

    # App
    environment: str = Field(default="development")
    debug: bool = Field(default=False)
    cors_origins: list[str] = Field(default=["http://localhost:3000"])

    @validator("featherless_api_key")
    def validate_featherless_key(cls, v, values):
        if values.get("ai_provider") == AIProvider.FEATHERLESS and not v:
            raise ValueError("FEATHERLESS_API_KEY required when AI_PROVIDER=featherless")
        return v

    class Config:
        env_file = ".env"
        case_sensitive = False


# Singleton — import this everywhere
settings = Settings()
```

---

### `src/infrastructure/adapters/ai/base.py` — AI Adapter Contract
```python
from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class AIResponse:
    content: str
    model: str
    tokens_used: int


class AIAdapter(ABC):
    """Abstract base class for AI providers.
    Both Featherless and Ollama implement this interface.
    Domain services depend on this abstraction, not concrete implementations.
    """

    @abstractmethod
    async def complete(
        self,
        prompt: str,
        system_prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.1,
    ) -> AIResponse:
        """Generate a completion from the LLM."""
        ...

    @abstractmethod
    async def health_check(self) -> bool:
        """Returns True if the provider is reachable."""
        ...
```

---

### `src/infrastructure/adapters/ai/factory.py` — Dual Model Factory
```python
from src.config.settings import settings, AIProvider
from .base import AIAdapter
from .featherless import FeatherlessAdapter
from .ollama import OllamaAdapter

_adapter_instance: AIAdapter | None = None


def get_ai_adapter() -> AIAdapter:
    """Returns the configured AI adapter.
    Switches between cloud (Featherless) and local (Ollama) based on settings.
    Used as a FastAPI dependency — injected into services.
    """
    global _adapter_instance
    if _adapter_instance is None:
        if settings.ai_provider == AIProvider.OLLAMA:
            _adapter_instance = OllamaAdapter(base_url=settings.ollama_base_url)
        else:
            _adapter_instance = FeatherlessAdapter(
                api_key=settings.featherless_api_key,
                primary_model=settings.primary_model,
                fallback_model=settings.fallback_model,
            )
    return _adapter_instance
```

---

### `src/infrastructure/adapters/ai/featherless.py` — Cloud Adapter
```python
import httpx
from .base import AIAdapter, AIResponse
from src.config.settings import settings


class FeatherlessAdapter(AIAdapter):
    def __init__(self, api_key: str, primary_model: str, fallback_model: str):
        self.api_key = api_key
        self.primary_model = primary_model
        self.fallback_model = fallback_model
        self.base_url = "https://api.featherless.ai/v1"

    async def complete(
        self,
        prompt: str,
        system_prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.1,
    ) -> AIResponse:
        async with httpx.AsyncClient() as client:
            response = await self._call(
                client, prompt, system_prompt, self.primary_model, max_tokens, temperature
            )
            if response is None:
                # Automatic fallback to secondary model
                response = await self._call(
                    client, prompt, system_prompt, self.fallback_model, max_tokens, temperature
                )
            return response

    async def _call(self, client, prompt, system_prompt, model, max_tokens, temperature):
        try:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt},
                    ],
                },
                timeout=30.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return AIResponse(
                content=data["choices"][0]["message"]["content"],
                model=model,
                tokens_used=data.get("usage", {}).get("total_tokens", 0),
            )
        except httpx.HTTPError:
            return None

    async def health_check(self) -> bool:
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(f"{self.base_url}/models", timeout=5.0)
                return resp.status_code == 200
            except httpx.HTTPError:
                return False
```

---

### `src/domain/chat/models.py` — Domain Models (Pure Python)
```python
from dataclasses import dataclass, field
from enum import Enum
from datetime import date
from typing import Optional


class IntentType(str, Enum):
    PURCHASE = "purchase"
    PROCESSING = "processing"
    DISPATCH = "dispatch"
    QUERY = "query"
    REPORT = "report"


class MaterialType(str, Enum):
    PET = "PET"
    HDPE = "HDPE"
    PP = "PP"
    LDPE = "LDPE"
    PVC = "PVC"
    MIXED = "mixed"


@dataclass
class ParsedEntry:
    """Represents a successfully parsed data entry from NL input."""
    intent: IntentType
    material: MaterialType
    quantity_kg: float
    date: date
    vendor: Optional[str] = None
    stage: Optional[str] = None
    loss_kg: Optional[float] = None
    batch_id: Optional[str] = None
    notes: Optional[str] = None
    raw_input: str = ""

    @property
    def loss_pct(self) -> Optional[float]:
        if self.loss_kg and self.quantity_kg:
            return (self.loss_kg / self.quantity_kg) * 100
        return None


@dataclass
class QueryFilter:
    """Represents a structured query filter extracted from NL question."""
    metric: str                              # "dispatched", "processed", "loss"
    date_range_start: Optional[date] = None
    date_range_end: Optional[date] = None
    stage: Optional[str] = None
    material: Optional[MaterialType] = None
    vendor: Optional[str] = None
    batch_id: Optional[str] = None
```

---

### `src/domain/chat/services.py` — Domain Service
```python
from .models import ParsedEntry, QueryFilter, IntentType
from .exceptions import UnrecognizedIntentError
from src.shared.types.protocols import AIAdapterProtocol, BatchRepositoryProtocol


class ChatService:
    """Orchestrates the chat pipeline.
    
    Depends on ABSTRACTIONS (protocols), not concrete implementations.
    This makes it fully unit-testable with mocks.
    """

    def __init__(
        self,
        ai_adapter: AIAdapterProtocol,
        batch_repo: BatchRepositoryProtocol,
    ):
        self.ai = ai_adapter
        self.batch_repo = batch_repo

    async def process_message(self, message: str) -> dict:
        """Main entry point: routes NL message to correct handler."""
        
        # Step 1: Classify intent
        intent = await self._classify_intent(message)

        if intent in (IntentType.QUERY, IntentType.REPORT):
            return await self._handle_query(message)
        elif intent in (IntentType.PURCHASE, IntentType.PROCESSING, IntentType.DISPATCH):
            return await self._handle_entry(message, intent)
        else:
            raise UnrecognizedIntentError(f"Cannot handle intent: {intent}")

    async def _classify_intent(self, message: str) -> IntentType:
        from src.infrastructure.adapters.ai.prompts.intent_prompt import INTENT_SYSTEM_PROMPT
        response = await self.ai.complete(message, INTENT_SYSTEM_PROMPT)
        # Parse intent from LLM response
        return _parse_intent_response(response.content)

    async def _handle_entry(self, message: str, intent: IntentType) -> dict:
        from src.infrastructure.adapters.ai.prompts.entity_prompt import ENTITY_SYSTEM_PROMPT
        response = await self.ai.complete(message, ENTITY_SYSTEM_PROMPT)
        entry = _parse_entry_response(response.content, intent)
        saved = await self.batch_repo.create_entry(entry)
        return {
            "action": "stored",
            "entry": saved,
            "reply": f"✅ Logged: {entry.quantity_kg}kg {entry.material.value}",
        }

    async def _handle_query(self, message: str) -> dict:
        from src.infrastructure.adapters.ai.prompts.query_prompt import QUERY_SYSTEM_PROMPT
        response = await self.ai.complete(message, QUERY_SYSTEM_PROMPT)
        filters = _parse_query_filter(response.content)
        result = await self.batch_repo.query_stats(filters)
        return {
            "action": "queried",
            "data": result,
            "reply": _format_query_result(result, filters),
        }


def _parse_intent_response(raw: str) -> IntentType:
    """Extract intent from LLM JSON response."""
    import json
    from src.shared.utils.json_parser import extract_json
    data = extract_json(raw)
    return IntentType(data.get("intent", "query"))


def _parse_entry_response(raw: str, intent: IntentType) -> ParsedEntry:
    """Extract entities from LLM JSON response."""
    import json
    from src.shared.utils.json_parser import extract_json
    from src.shared.utils.dates import parse_relative_date
    data = extract_json(raw)
    return ParsedEntry(
        intent=intent,
        material=MaterialType(data.get("material", "PET")),
        quantity_kg=float(data.get("quantity_kg", 0)),
        date=parse_relative_date(data.get("date", "today")),
        vendor=data.get("vendor"),
        stage=data.get("stage"),
        loss_kg=data.get("loss_kg"),
        batch_id=data.get("batch_id"),
    )


def _parse_query_filter(raw: str) -> QueryFilter:
    from src.shared.utils.json_parser import extract_json
    data = extract_json(raw)
    return QueryFilter(metric=data.get("metric", "total"))


def _format_query_result(result: dict, filters: QueryFilter) -> str:
    return f"Found: {result}"  # expand in real impl
```

---

### `src/api/v1/chat/routes.py` — API Route (Shell Pattern)
```python
from fastapi import APIRouter, Depends, HTTPException
from .schemas import ChatRequest, ChatResponse
from src.domain.chat.services import ChatService
from src.domain.chat.exceptions import UnrecognizedIntentError
from src.api.dependencies import get_chat_service

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def handle_chat(
    request: ChatRequest,
    chat_service: ChatService = Depends(get_chat_service),
) -> ChatResponse:
    """
    Process a natural language message.
    Routes to data entry or query based on detected intent.
    """
    try:
        result = await chat_service.process_message(request.message)
        return ChatResponse(
            success=True,
            reply=result["reply"],
            action=result["action"],
            structured_data=result.get("entry") or result.get("data"),
        )
    except UnrecognizedIntentError as e:
        raise HTTPException(status_code=422, detail=str(e))
```

---

### `src/api/v1/chat/schemas.py` — Pydantic Schemas
```python
from pydantic import BaseModel, Field
from typing import Optional, Literal, Any
from datetime import datetime


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)


class ChatResponse(BaseModel):
    success: bool
    reply: str
    action: Literal["stored", "queried", "error"]
    structured_data: Optional[Any] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
```

---

### `src/api/dependencies.py` — FastAPI Dependency Injection
```python
from functools import lru_cache
from fastapi import Depends
from sqlalchemy.orm import Session

from src.infrastructure.database.connection import get_db_session
from src.infrastructure.adapters.ai.factory import get_ai_adapter
from src.infrastructure.repositories.batch_repository import BatchRepository
from src.infrastructure.repositories.vendor_repository import VendorRepository
from src.domain.chat.services import ChatService
from src.domain.insights.services import InsightService


def get_batch_repository(
    db: Session = Depends(get_db_session),
) -> BatchRepository:
    return BatchRepository(db)


def get_chat_service(
    batch_repo: BatchRepository = Depends(get_batch_repository),
) -> ChatService:
    ai_adapter = get_ai_adapter()
    return ChatService(ai_adapter=ai_adapter, batch_repo=batch_repo)


def get_insight_service(
    batch_repo: BatchRepository = Depends(get_batch_repository),
) -> InsightService:
    ai_adapter = get_ai_adapter()
    return InsightService(ai_adapter=ai_adapter, batch_repo=batch_repo)
```

---

### `src/shared/utils/json_parser.py` — Robust LLM JSON Extractor
```python
import json
import re
from typing import Any


def extract_json(raw: str) -> dict[str, Any]:
    """
    Robustly extract JSON from LLM output.
    Handles: plain JSON, JSON in markdown code blocks, JSON with trailing text.
    """
    # Strategy 1: Direct parse
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        pass

    # Strategy 2: Extract from markdown code block
    code_block = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw)
    if code_block:
        try:
            return json.loads(code_block.group(1))
        except json.JSONDecodeError:
            pass

    # Strategy 3: Find first {...} block
    brace_match = re.search(r"\{[\s\S]*\}", raw)
    if brace_match:
        try:
            return json.loads(brace_match.group(0))
        except json.JSONDecodeError:
            pass

    # Fallback: return empty dict — caller handles missing fields
    return {}
```

---

## Developer Guidelines

### Where Does New Code Go?

| I want to... | Create it in... |
|---|---|
| Add business rule for loss calculation | `src/domain/batches/anomaly_detector.py` |
| Add a new AI prompt | `src/infrastructure/adapters/ai/prompts/` |
| Add a new DB query | `src/infrastructure/repositories/` |
| Add a new HTTP endpoint | `src/api/v1/[resource]/routes.py` + `schemas.py` |
| Add a request/response shape | `src/api/v1/[resource]/schemas.py` |
| Add a shared utility | `src/shared/utils/` |
| Add an enum/constant | `src/shared/constants/` |
| Add environment config | `src/config/settings.py` |
| Add a domain exception | `src/domain/[domain]/exceptions.py` |

### The 5 Rules Every Developer Must Follow

**Rule 1: Domain has zero infrastructure imports**
```python
# ❌ WRONG — domain importing DB or AI
from src.infrastructure.repositories.batch_repository import BatchRepository  # in domain/

# ✅ RIGHT — domain depends on a Protocol (interface)
from src.shared.types.protocols import BatchRepositoryProtocol  # in domain/
```

**Rule 2: API routes are thin shells**
```python
# ❌ WRONG — business logic in route
@router.post("/chat")
async def chat(request: ChatRequest):
    response = await httpx.post("https://api.featherless.ai/...", ...)
    parsed = extract_json(response.text)
    await db.execute("INSERT INTO entries ...")
    return {"reply": "..."}

# ✅ RIGHT — delegate everything
@router.post("/chat")
async def chat(
    request: ChatRequest,
    service: ChatService = Depends(get_chat_service)
):
    result = await service.process_message(request.message)
    return ChatResponse(**result)
```

**Rule 3: Use Protocols for testability**
```python
# src/shared/types/protocols.py
from typing import Protocol, runtime_checkable

@runtime_checkable
class AIAdapterProtocol(Protocol):
    async def complete(self, prompt: str, system_prompt: str) -> AIResponse: ...
    async def health_check(self) -> bool: ...

# In tests — inject a mock:
class MockAIAdapter:
    async def complete(self, prompt, system_prompt):
        return AIResponse(content='{"intent": "purchase"}', model="mock", tokens_used=0)
    async def health_check(self):
        return True
```

**Rule 4: Each module has a clean `__init__.py`**
```python
# src/domain/chat/__init__.py
# Only export the public API of this module
from .services import ChatService
from .models import ParsedEntry, QueryFilter, IntentType

__all__ = ["ChatService", "ParsedEntry", "QueryFilter", "IntentType"]
```

**Rule 5: All tests use fixtures, never live services**
```python
# tests/fixtures/conftest.py
import pytest
from src.domain.chat.services import ChatService

@pytest.fixture
def mock_ai_adapter():
    class MockAdapter:
        async def complete(self, prompt, system_prompt):
            return MockAIResponse('{"intent": "purchase", "material": "PET", "quantity_kg": 300}')
    return MockAdapter()

@pytest.fixture
def chat_service(mock_ai_adapter, mock_batch_repo):
    return ChatService(ai_adapter=mock_ai_adapter, batch_repo=mock_batch_repo)

# In test:
async def test_purchase_intent(chat_service):
    result = await chat_service.process_message("Bought 300kg PET from Vendor A")
    assert result["action"] == "stored"
    assert result["entry"].quantity_kg == 300
```

---

## Quick-Start Setup

```bash
# 1. Install dependencies
pip install fastapi uvicorn sqlalchemy alembic pydantic-settings httpx pytest pytest-asyncio

# 2. Set up environment
cp .env.example .env
# Fill in FEATHERLESS_API_KEY or set AI_PROVIDER=ollama

# 3. Run migrations
alembic upgrade head

# 4. Seed database
python scripts/seed_db.py

# 5. Start server
uvicorn src.api.app:app --reload --port 8000

# 6. Test prompts manually
python scripts/test_prompts.py

# 7. Run tests
pytest tests/unit/          # Fast, no external dependencies
pytest tests/integration/   # Requires DB + AI adapter
```