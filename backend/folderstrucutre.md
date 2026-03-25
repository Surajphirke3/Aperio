# MASTER_PROMPT_BACKEND_V2.md — TraceFlow Backend
## Python FastAPI — Built Exactly For This Frontend
### Stack: FastAPI + MongoDB + Redis + Groq + Featherless (Qwen2.5-3B) + LangGraph

---

## 🎯 Mission

Build a **minimal, production-grade FastAPI backend** that serves exactly what the TraceFlow
frontend needs — no more, no less. Every endpoint maps to a real frontend page or component.
Mock data in `lib/mockData.ts` gets replaced by real API responses. The chat feature is the
core — it must be exceptional.

---

## 🧱 Final Tech Stack

| Layer | Technology | Why |
|---|---|---|
| API | FastAPI (async, Python 3.11+) | Fast, typed, async-native |
| AI Inference | Featherless AI — `Qwen/Qwen2.5-3B-Instruct` | Small model, PS1 constraint ≤3B |
| Voice + Fast NLP | Groq API (`whisper-large-v3` + `llama3-8b`) | Sub-second transcription + NLP |
| Chat Orchestration | LangGraph | Stateful multi-step chat flows |
| Semantic Memory | Cosine similarity (`all-MiniLM-L6-v2`) | Retrieve relevant past context |
| Session Memory | Redis | Bounded chat history per session |
| Database | MongoDB (Motor async driver) | Flexible schema for traceability data |
| Validation | Pydantic v2 | Typed request/response schemas |
| Auth | Firebase Admin SDK (JWT verify) | Frontend already uses Firebase Auth |

---

## 📡 API Contract — What The Frontend Actually Calls

These are the ONLY endpoints needed. Derived directly from frontend pages + components.

```
GET    /health                           → Health check

# Chat (core feature)
POST   /v1/chat/                         → Send message, get AI reply
GET    /v1/chat/sessions/{id}/history    → Load past messages (SessionSidebar)
DELETE /v1/chat/sessions/{id}            → Clear session

# Dashboard (/dashboard page)
GET    /v1/stats                         → KPI cards (4 metrics)
GET    /v1/stats/sankey                  → MaterialFlowSankey data
GET    /v1/stats/weekly                  → WeeklyLineChart data
GET    /v1/stats/materials               → MaterialPieChart data
GET    /v1/stats/stages                  → BatchStageBarChart data
GET    /v1/stats/completeness            → CompletenessGauge score
GET    /v1/anomalies                     → AnomalyPanel data
POST   /v1/insights                      → AIInsightsPanel narrative

# Batches (/batches page + /batches/[id])
GET    /v1/batches                       → BatchCard grid (with filters)
GET    /v1/batches/{id}                  → BatchDetail + timeline + custody chain
POST   /v1/insights/batch/{id}           → Loss analysis narrative for batch

# Vendors (/vendors page)
GET    /v1/vendors                       → VendorScorecard list

# Carbon (/carbon page)
GET    /v1/carbon                        → All carbon metrics + monthly data

# Voice input
POST   /v1/voice/transcribe              → Audio → text via Groq Whisper
```

---

## 📁 Folder Structure (Every File Justified)

```
traceflow-api/
│
├── src/
│   ├── api/
│   │   ├── app.py                        # FastAPI factory + lifespan + middleware
│   │   ├── dependencies.py               # DI: db, redis, ai adapters, verify_token
│   │   └── v1/
│   │       ├── router.py                 # Mounts all sub-routers
│   │       ├── chat/
│   │       │   ├── routes.py             # POST /chat, GET/DELETE sessions
│   │       │   └── schemas.py            # ChatRequest, ChatResponse
│   │       ├── stats/
│   │       │   ├── routes.py             # All /stats/* endpoints
│   │       │   └── schemas.py            # KPIResponse, SankeyResponse, etc.
│   │       ├── batches/
│   │       │   ├── routes.py
│   │       │   └── schemas.py
│   │       ├── vendors/
│   │       │   ├── routes.py
│   │       │   └── schemas.py
│   │       ├── carbon/
│   │       │   ├── routes.py
│   │       │   └── schemas.py
│   │       ├── insights/
│   │       │   ├── routes.py
│   │       │   └── schemas.py
│   │       └── voice/
│   │           ├── routes.py             # POST /voice/transcribe
│   │           └── schemas.py
│   │
│   ├── domain/
│   │   ├── chat/
│   │   │   ├── graph.py                  # LangGraph StateGraph
│   │   │   ├── nodes.py                  # classify → extract → store/query → reply
│   │   │   ├── memory.py                 # Redis session manager
│   │   │   └── similarity.py             # Cosine similarity retrieval
│   │   ├── stats/
│   │   │   └── aggregator.py             # MongoDB aggregation pipelines
│   │   ├── insights/
│   │   │   └── generator.py              # AI narrative generation
│   │   └── carbon/
│   │       └── calculator.py             # CO2 calculation logic
│   │
│   ├── infrastructure/
│   │   ├── ai/
│   │   │   ├── featherless.py            # Qwen2.5-3B adapter (primary inference)
│   │   │   ├── groq_client.py            # Groq adapter (voice + fast NLP)
│   │   │   └── prompts/
│   │   │       ├── intent.py             # Intent classification prompt
│   │   │       ├── entity.py             # Entity extraction prompt
│   │   │       ├── query.py              # NL → filter prompt
│   │   │       └── insight.py            # Batch narrative prompt
│   │   ├── db/
│   │   │   ├── mongo.py                  # Motor async client + collections
│   │   │   └── repositories/
│   │   │       ├── entry_repo.py         # Material entries CRUD + aggregation
│   │   │       ├── batch_repo.py         # Batch lifecycle CRUD
│   │   │       └── vendor_repo.py        # Vendor CRUD + scorecard queries
│   │   └── cache/
│   │       └── redis_client.py           # Redis init + session helpers
│   │
│   ├── shared/
│   │   ├── utils/
│   │   │   ├── json_parser.py            # Robust LLM JSON extractor
│   │   │   └── dates.py                  # "yesterday" → ISO date
│   │   └── constants/
│   │       ├── materials.py              # MaterialType enum: PET, HDPE, PP...
│   │       ├── stages.py                 # ProcessStage enum
│   │       └── thresholds.py             # Loss % thresholds per stage
│   │
│   └── config/
│       ├── settings.py                   # Pydantic BaseSettings
│       └── logging.py                    # Structured JSON logging
│
├── tests/
│   ├── conftest.py
│   ├── test_chat_graph.py
│   └── test_aggregations.py
│
├── scripts/
│   └── seed_db.py                        # Kaggle CSV → MongoDB seed
│
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
├── .env.example
└── README.md
```

---

## 🔑 Critical Implementations

### `src/config/settings.py`
```python
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # Featherless AI (primary model — Qwen2.5-3B)
    featherless_api_key: str = Field(...)
    primary_model: str = "Qwen/Qwen2.5-3B-Instruct"
    fallback_model: str = "Qwen/Qwen2.5-Coder-3B-Instruct"
    model_temperature: float = 0.1
    model_max_tokens: int = 512

    # Groq (voice transcription + fast NLP assist)
    groq_api_key: str = Field(...)
    groq_whisper_model: str = "whisper-large-v3"
    groq_nlp_model: str = "llama3-8b-8192"

    # MongoDB
    mongodb_url: str = Field(default="mongodb://localhost:27017")
    mongodb_db_name: str = "traceflow"

    # Redis
    redis_url: str = Field(default="redis://localhost:6379")
    chat_session_ttl: int = 86400        # 24h
    context_window_messages: int = 20

    # Cosine similarity
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    similarity_top_k: int = 3

    # Auth
    firebase_credentials_path: str = "firebase-credentials.json"

    # App
    environment: str = "development"
    cors_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
```

---

### `src/infrastructure/db/mongo.py` — MongoDB Client
```python
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from src.config.settings import settings

_client: AsyncIOMotorClient | None = None


async def init_mongo() -> None:
    global _client
    _client = AsyncIOMotorClient(settings.mongodb_url)


async def close_mongo() -> None:
    if _client:
        _client.close()


def get_db() -> AsyncIOMotorDatabase:
    return _client[settings.mongodb_db_name]


# Collection accessors — typed and consistent
def entries_col():   return get_db()["material_entries"]
def batches_col():   return get_db()["batches"]
def vendors_col():   return get_db()["vendors"]
def sessions_col():  return get_db()["chat_sessions"]
```

---

### `src/infrastructure/ai/featherless.py` — Qwen2.5-3B Adapter
```python
import httpx
from dataclasses import dataclass
from src.config.settings import settings


@dataclass
class AIResponse:
    content: str
    model: str
    tokens_used: int


class FeatherlessAdapter:
    """Featherless cloud adapter for Qwen2.5-3B.
    Primary model for all complex reasoning + entity extraction.
    Auto-falls back to secondary model on failure.
    """
    BASE_URL = "https://api.featherless.ai/v1"

    async def complete(
        self,
        prompt: str,
        system_prompt: str,
        max_tokens: int | None = None,
        temperature: float | None = None,
    ) -> AIResponse:
        async with httpx.AsyncClient(timeout=30.0) as client:
            for model in [settings.primary_model, settings.fallback_model]:
                result = await self._call(
                    client, prompt, system_prompt, model,
                    max_tokens or settings.model_max_tokens,
                    temperature or settings.model_temperature,
                )
                if result:
                    return result
        raise RuntimeError("Both Featherless models failed")

    async def _call(self, client, prompt, system_prompt, model, max_tokens, temperature):
        try:
            resp = await client.post(
                f"{self.BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.featherless_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user",   "content": prompt},
                    ],
                },
            )
            resp.raise_for_status()
            d = resp.json()
            return AIResponse(
                content=d["choices"][0]["message"]["content"],
                model=model,
                tokens_used=d.get("usage", {}).get("total_tokens", 0),
            )
        except httpx.HTTPError:
            return None
```

---

### `src/infrastructure/ai/groq_client.py` — Groq Adapter
```python
import httpx
from pathlib import Path
from src.config.settings import settings


class GroqAdapter:
    """Groq adapter — two jobs:
    1. Voice transcription: audio file → text (Whisper large-v3, ~300ms)
    2. Fast NLP assist: simple intent pre-classification to offload Featherless
    """
    BASE_URL = "https://api.groq.com/openai/v1"

    async def transcribe(self, audio_bytes: bytes, filename: str = "audio.webm") -> str:
        """Convert voice audio to text using Groq Whisper."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{self.BASE_URL}/audio/transcriptions",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                files={"file": (filename, audio_bytes, "audio/webm")},
                data={"model": settings.groq_whisper_model},
            )
            resp.raise_for_status()
            return resp.json()["text"]

    async def fast_classify(self, message: str) -> str:
        """Quick intent pre-classification using Groq Llama3-8b.
        Used as a fast first-pass before Featherless Qwen for complex extraction.
        Returns: 'purchase' | 'processing' | 'dispatch' | 'query' | 'report' | 'unknown'
        """
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"{self.BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.groq_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": settings.groq_nlp_model,
                    "max_tokens": 50,
                    "temperature": 0.0,
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "Classify the intent of this recycling operations message. "
                                "Respond with ONLY one word: purchase, processing, dispatch, query, or report."
                            ),
                        },
                        {"role": "user", "content": message},
                    ],
                },
            )
            resp.raise_for_status()
            raw = resp.json()["choices"][0]["message"]["content"].strip().lower()
            valid = {"purchase", "processing", "dispatch", "query", "report"}
            return raw if raw in valid else "unknown"
```

---

### `src/domain/chat/graph.py` — LangGraph Pipeline
```python
from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END
from .nodes import classify_intent, extract_entities, build_query_filter
from .nodes import store_entry, run_stats_query, generate_reply


class ChatState(TypedDict):
    session_id: str
    user_message: str
    history: list[dict]
    similar_context: list[dict]
    groq_intent: str           # fast pre-classification from Groq
    intent: Optional[str]      # confirmed intent from Qwen2.5-3B
    extracted_data: Optional[dict]
    db_result: Optional[dict]
    reply: Optional[str]
    error: Optional[str]


def route_after_classify(state: ChatState) -> str:
    intent = state.get("intent", "query")
    if intent in ("query", "report"):
        return "build_query_filter"
    if intent in ("purchase", "processing", "dispatch"):
        return "extract_entities"
    return "generate_reply"


def build_chat_graph():
    g = StateGraph(ChatState)

    g.add_node("classify_intent",    classify_intent)
    g.add_node("extract_entities",   extract_entities)
    g.add_node("build_query_filter", build_query_filter)
    g.add_node("store_entry",        store_entry)
    g.add_node("run_stats_query",    run_stats_query)
    g.add_node("generate_reply",     generate_reply)

    g.set_entry_point("classify_intent")
    g.add_conditional_edges("classify_intent", route_after_classify, {
        "extract_entities":   "extract_entities",
        "build_query_filter": "build_query_filter",
        "generate_reply":     "generate_reply",
    })
    g.add_edge("extract_entities",   "store_entry")
    g.add_edge("build_query_filter", "run_stats_query")
    g.add_edge("store_entry",        "generate_reply")
    g.add_edge("run_stats_query",    "generate_reply")
    g.add_edge("generate_reply",     END)

    return g.compile()


chat_graph = build_chat_graph()
```

---

### `src/domain/chat/nodes.py` — LangGraph Nodes
```python
from src.infrastructure.ai.featherless import FeatherlessAdapter
from src.infrastructure.ai.prompts.intent import INTENT_SYSTEM_PROMPT
from src.infrastructure.ai.prompts.entity import build_entity_prompt
from src.infrastructure.ai.prompts.query import QUERY_SYSTEM_PROMPT
from src.shared.utils.json_parser import extract_json
from src.shared.utils.dates import today_iso

_ai = FeatherlessAdapter()


async def classify_intent(state: dict) -> dict:
    """Use Groq fast pre-classification first; only call Featherless if uncertain."""
    groq_intent = state.get("groq_intent", "unknown")

    # If Groq was confident, trust it — skip Featherless call for speed
    if groq_intent != "unknown":
        return {"intent": groq_intent}

    history = _format_history(state["history"][-6:])  # last 3 pairs
    prompt = f"History:\n{history}\n\nMessage: {state['user_message']}"
    response = await _ai.complete(prompt, INTENT_SYSTEM_PROMPT)
    data = extract_json(response.content)
    return {"intent": data.get("intent", "query")}


async def extract_entities(state: dict) -> dict:
    """Qwen2.5-3B extracts structured entities from data-entry messages."""
    prompt = state["user_message"]
    system = build_entity_prompt(today_iso())
    response = await _ai.complete(prompt, system)
    data = extract_json(response.content)
    return {"extracted_data": data}


async def build_query_filter(state: dict) -> dict:
    """Qwen2.5-3B extracts query filters from reporting questions."""
    response = await _ai.complete(state["user_message"], QUERY_SYSTEM_PROMPT)
    data = extract_json(response.content)
    return {"extracted_data": data}


async def store_entry(state: dict) -> dict:
    """Write extracted entity to MongoDB."""
    from src.infrastructure.db.repositories.entry_repo import EntryRepository
    data = {**state["extracted_data"], "session_id": state["session_id"]}
    repo = EntryRepository()
    result = await repo.create(data)
    return {"db_result": {"action": "stored", "id": str(result.inserted_id), "data": data}}


async def run_stats_query(state: dict) -> dict:
    """Run aggregation query on MongoDB."""
    from src.infrastructure.db.repositories.entry_repo import EntryRepository
    repo = EntryRepository()
    result = await repo.query_stats(state["extracted_data"])
    return {"db_result": {"action": "queried", "result": result}}


async def generate_reply(state: dict) -> dict:
    """Compose human-readable reply from db_result."""
    db = state.get("db_result") or {}
    action = db.get("action")

    if action == "stored":
        d = db["data"]
        reply = f"✅ Logged: {d.get('quantity_kg')}kg {d.get('material')} — {d.get('intent')} recorded."
    elif action == "queried":
        r = db.get("result", {})
        reply = (
            f"Found {r.get('count', 0)} entries totalling "
            f"{r.get('total_kg', 0)}kg. Loss: {r.get('loss_pct', 0)}%."
        )
    else:
        reply = "I couldn't process that. Try rephrasing — e.g. 'Purchased 200kg PET from Vendor A'."

    return {"reply": reply}


def _format_history(messages: list[dict]) -> str:
    if not messages:
        return "(none)"
    return "\n".join(f"{m['role'].upper()}: {m['content']}" for m in messages)
```

---

### `src/domain/chat/memory.py` — Redis Session Memory
```python
import json
from datetime import datetime
from src.infrastructure.cache.redis_client import get_redis
from src.config.settings import settings


class ChatMemory:
    def __init__(self, session_id: str):
        self.key = f"chat:session:{session_id}"
        self.ttl = settings.chat_session_ttl
        self.window = settings.context_window_messages

    async def get_history(self) -> list[dict]:
        redis = await get_redis()
        raw = await redis.lrange(self.key, 0, self.window - 1)
        return list(reversed([json.loads(m) for m in raw]))

    async def append(self, role: str, content: str, intent: str | None = None) -> None:
        redis = await get_redis()
        msg = json.dumps({
            "role": role, "content": content,
            "intent": intent,
            "timestamp": datetime.utcnow().isoformat(),
        })
        await redis.lpush(self.key, msg)
        await redis.ltrim(self.key, 0, self.window - 1)
        await redis.expire(self.key, self.ttl)

    async def clear(self) -> None:
        redis = await get_redis()
        await redis.delete(self.key)
```

---

### `src/api/v1/chat/routes.py` — Chat Routes
```python
import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File
from .schemas import ChatRequest, ChatResponse
from src.domain.chat.graph import chat_graph
from src.domain.chat.memory import ChatMemory
from src.domain.chat.similarity import get_similar_context
from src.infrastructure.ai.groq_client import GroqAdapter

router = APIRouter(prefix="/chat", tags=["chat"])
_groq = GroqAdapter()


@router.post("/", response_model=ChatResponse)
async def send_message(request: ChatRequest) -> ChatResponse:
    session_id = request.session_id or str(uuid.uuid4())
    memory = ChatMemory(session_id)

    history = await memory.get_history()
    similar_context = await get_similar_context(request.message, history)

    # Groq fast pre-classification — sub-100ms
    groq_intent = await _groq.fast_classify(request.message)

    state = {
        "session_id": session_id,
        "user_message": request.message,
        "history": history,
        "similar_context": similar_context,
        "groq_intent": groq_intent,
        "intent": None, "extracted_data": None,
        "db_result": None, "reply": None, "error": None,
    }

    try:
        final = await chat_graph.ainvoke(state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    await memory.append("user", request.message, intent=groq_intent)
    await memory.append("assistant", final["reply"], intent=final.get("intent"))

    return ChatResponse(
        session_id=session_id,
        reply=final["reply"],
        intent=str(final.get("intent", "unknown")),
        structured_data=final.get("db_result"),
        success=True,
    )


@router.get("/sessions/{session_id}/history")
async def get_history(session_id: str):
    memory = ChatMemory(session_id)
    messages = await memory.get_history()
    return {"session_id": session_id, "messages": messages, "count": len(messages)}


@router.delete("/sessions/{session_id}")
async def clear_session(session_id: str):
    await ChatMemory(session_id).clear()
    return {"message": "Session cleared", "session_id": session_id}
```

---

### `src/api/v1/voice/routes.py` — Groq Voice Transcription
```python
from fastapi import APIRouter, UploadFile, File, HTTPException
from .schemas import TranscribeResponse
from src.infrastructure.ai.groq_client import GroqAdapter

router = APIRouter(prefix="/voice", tags=["voice"])
_groq = GroqAdapter()


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(file: UploadFile = File(...)) -> TranscribeResponse:
    """
    Receives audio from the frontend voice input button.
    Sends to Groq Whisper (large-v3) for sub-second transcription.
    Returns the text to pre-fill the chat input.
    """
    if file.content_type not in ("audio/webm", "audio/wav", "audio/mp4", "audio/mpeg"):
        raise HTTPException(status_code=400, detail="Unsupported audio format")

    audio_bytes = await file.read()
    if len(audio_bytes) > 25 * 1024 * 1024:  # 25MB limit
        raise HTTPException(status_code=400, detail="Audio file too large (max 25MB)")

    text = await _groq.transcribe(audio_bytes, filename=file.filename or "audio.webm")
    return TranscribeResponse(text=text, success=True)
```

---

### `src/api/v1/stats/routes.py` — Dashboard Data Endpoints
```python
from fastapi import APIRouter, Query
from .schemas import (
    KPIResponse, SankeyResponse, WeeklyChartResponse,
    MaterialDistResponse, StageDistResponse, CompletenessResponse
)
from src.domain.stats.aggregator import StatsAggregator

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/", response_model=KPIResponse)
async def get_kpis(days: int = Query(default=30, ge=7, le=90)):
    """4 KPI cards on the dashboard: total_kg, dispatched_kg, loss_pct, batch_count"""
    return await StatsAggregator().get_kpis(days)


@router.get("/sankey", response_model=SankeyResponse)
async def get_sankey(days: int = Query(default=30)):
    """MaterialFlowSankey — nodes + links for material movement visualization"""
    return await StatsAggregator().get_sankey(days)


@router.get("/weekly", response_model=WeeklyChartResponse)
async def get_weekly(days: int = Query(default=30)):
    """WeeklyLineChart — throughput trend over time"""
    return await StatsAggregator().get_weekly(days)


@router.get("/materials", response_model=MaterialDistResponse)
async def get_materials(days: int = Query(default=30)):
    """MaterialPieChart — distribution by material type"""
    return await StatsAggregator().get_material_distribution(days)


@router.get("/stages", response_model=StageDistResponse)
async def get_stages(days: int = Query(default=30)):
    """BatchStageBarChart — volume by process stage"""
    return await StatsAggregator().get_stage_distribution(days)


@router.get("/completeness", response_model=CompletenessResponse)
async def get_completeness():
    """CompletenessGauge — data completeness score 0-100"""
    return await StatsAggregator().get_completeness_score()
```

---

### `src/domain/stats/aggregator.py` — MongoDB Aggregation Pipelines
```python
from datetime import datetime, timedelta
from src.infrastructure.db.mongo import entries_col, batches_col


class StatsAggregator:
    """All MongoDB aggregation pipelines for dashboard data.
    Each method maps 1:1 to a frontend chart component.
    """

    async def get_kpis(self, days: int) -> dict:
        since = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"created_at": {"$gte": since.isoformat()}}},
            {"$group": {
                "_id": None,
                "total_kg":      {"$sum": "$quantity_kg"},
                "total_loss_kg": {"$sum": {"$ifNull": ["$loss_kg", 0]}},
                "batch_count":   {"$sum": 1},
                "dispatched_kg": {"$sum": {
                    "$cond": [{"$eq": ["$intent", "dispatch"]}, "$quantity_kg", 0]
                }},
            }},
        ]
        col = entries_col()
        async for doc in col.aggregate(pipeline):
            total = doc["total_kg"] or 1
            return {
                "total_kg":      round(doc["total_kg"], 2),
                "dispatched_kg": round(doc["dispatched_kg"], 2),
                "loss_pct":      round((doc["total_loss_kg"] / total) * 100, 2),
                "batch_count":   doc["batch_count"],
            }
        return {"total_kg": 0, "dispatched_kg": 0, "loss_pct": 0, "batch_count": 0}

    async def get_sankey(self, days: int) -> dict:
        since = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"created_at": {"$gte": since.isoformat()}, "stage": {"$ne": None}}},
            {"$group": {"_id": {"from": "$intent", "to": "$stage"}, "value": {"$sum": "$quantity_kg"}}},
        ]
        col = entries_col()
        node_set = set()
        links = []
        async for doc in col.aggregate(pipeline):
            src = doc["_id"]["from"]
            tgt = doc["_id"]["to"]
            node_set.update([src, tgt])
            links.append({"source": src, "target": tgt, "value": round(doc["value"], 2)})

        nodes = [{"name": n} for n in sorted(node_set)]
        node_idx = {n["name"]: i for i, n in enumerate(nodes)}
        indexed_links = [
            {"source": node_idx[l["source"]], "target": node_idx[l["target"]], "value": l["value"]}
            for l in links if l["source"] in node_idx and l["target"] in node_idx
        ]
        return {"nodes": nodes, "links": indexed_links}

    async def get_weekly(self, days: int) -> dict:
        since = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"created_at": {"$gte": since.isoformat()}}},
            {"$addFields": {"week": {"$isoWeek": {"$dateFromString": {"dateString": "$created_at"}}}}},
            {"$group": {"_id": "$week", "total_kg": {"$sum": "$quantity_kg"}, "count": {"$sum": 1}}},
            {"$sort": {"_id": 1}},
        ]
        col = entries_col()
        weeks = []
        async for doc in col.aggregate(pipeline):
            weeks.append({"week": f"W{doc['_id']}", "total_kg": round(doc["total_kg"], 2), "count": doc["count"]})
        return {"data": weeks}

    async def get_material_distribution(self, days: int) -> dict:
        since = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"created_at": {"$gte": since.isoformat()}}},
            {"$group": {"_id": "$material", "total_kg": {"$sum": "$quantity_kg"}}},
        ]
        col = entries_col()
        result = []
        async for doc in col.aggregate(pipeline):
            result.append({"material": doc["_id"], "total_kg": round(doc["total_kg"], 2)})
        return {"data": result}

    async def get_stage_distribution(self, days: int) -> dict:
        since = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"created_at": {"$gte": since.isoformat()}, "stage": {"$ne": None}}},
            {"$group": {"_id": "$stage", "total_kg": {"$sum": "$quantity_kg"}, "loss_kg": {"$sum": {"$ifNull": ["$loss_kg", 0]}}}},
        ]
        col = entries_col()
        result = []
        async for doc in col.aggregate(pipeline):
            result.append({
                "stage": doc["_id"],
                "total_kg": round(doc["total_kg"], 2),
                "loss_kg": round(doc["loss_kg"], 2),
            })
        return {"data": result}

    async def get_completeness_score(self) -> dict:
        """Scores data completeness: % of entries with all key fields populated."""
        col = entries_col()
        total = await col.count_documents({})
        if not total:
            return {"score": 0, "total": 0, "complete": 0}

        complete = await col.count_documents({
            "material": {"$ne": None},
            "quantity_kg": {"$ne": None},
            "stage": {"$ne": None},
            "vendor": {"$ne": None},
        })
        return {
            "score": round((complete / total) * 100, 1),
            "total": total,
            "complete": complete,
        }
```

---

### `src/api/v1/batches/routes.py`
```python
from fastapi import APIRouter, Query
from .schemas import BatchListResponse, BatchDetailResponse
from src.infrastructure.db.repositories.batch_repo import BatchRepository

router = APIRouter(prefix="/batches", tags=["batches"])


@router.get("/", response_model=BatchListResponse)
async def list_batches(
    material: str | None = Query(default=None),
    stage: str | None = Query(default=None),
    status: str | None = Query(default=None),
    search: str | None = Query(default=None),
    limit: int = Query(default=50, le=200),
):
    """Serves BatchCard grid + BatchFilters on /batches page."""
    repo = BatchRepository()
    batches = await repo.list(
        material=material, stage=stage,
        status=status, search=search, limit=limit
    )
    return {"batches": batches, "count": len(batches)}


@router.get("/{batch_id}", response_model=BatchDetailResponse)
async def get_batch(batch_id: str):
    """Serves BatchDetail, BatchTimeline, ChainOfCustody on /batches/[id]."""
    repo = BatchRepository()
    return await repo.get_by_id(batch_id)
```

---

### `src/api/v1/insights/routes.py`
```python
from fastapi import APIRouter
from .schemas import InsightRequest, InsightResponse, BatchInsightResponse
from src.domain.insights.generator import InsightGenerator

router = APIRouter(prefix="/insights", tags=["insights"])
_gen = InsightGenerator()


@router.post("/", response_model=InsightResponse)
async def generate_dashboard_insight(request: InsightRequest):
    """AIInsightsPanel on dashboard — narrative + recommendations."""
    narrative = await _gen.generate_dashboard_narrative(request.days)
    return {"narrative": narrative, "success": True}


@router.post("/batch/{batch_id}", response_model=BatchInsightResponse)
async def generate_batch_insight(batch_id: str):
    """LossAnalysisNarrative + TraceabilityScore on batch detail page."""
    result = await _gen.generate_batch_narrative(batch_id)
    return result
```

---

### `src/domain/insights/generator.py` — AI Insight Generation
```python
from src.infrastructure.ai.featherless import FeatherlessAdapter
from src.infrastructure.ai.prompts.insight import INSIGHT_SYSTEM_PROMPT, BATCH_INSIGHT_PROMPT
from src.domain.stats.aggregator import StatsAggregator
from src.infrastructure.db.repositories.batch_repo import BatchRepository

_ai = FeatherlessAdapter()


class InsightGenerator:
    async def generate_dashboard_narrative(self, days: int = 30) -> str:
        """Generates plain-language narrative for AIInsightsPanel."""
        kpis = await StatsAggregator().get_kpis(days)
        stages = await StatsAggregator().get_stage_distribution(days)
        prompt = (
            f"Last {days} days data: {kpis}. "
            f"Stage breakdown: {stages['data']}. "
            "Generate a 3-sentence operational summary highlighting key metrics, "
            "any losses worth noting, and one actionable recommendation."
        )
        response = await _ai.complete(prompt, INSIGHT_SYSTEM_PROMPT, max_tokens=200)
        return response.content.strip()

    async def generate_batch_narrative(self, batch_id: str) -> dict:
        """Generates loss analysis + traceability score for BatchDetail page."""
        batch = await BatchRepository().get_by_id(batch_id)
        if not batch:
            return {"narrative": "Batch not found.", "traceability_score": 0, "anomalies": []}

        prompt = f"Batch data: {batch}. Analyze this batch's material journey, identify any losses or anomalies, and give a traceability score 0-100."
        response = await _ai.complete(prompt, BATCH_INSIGHT_PROMPT, max_tokens=300)

        from src.shared.utils.json_parser import extract_json
        data = extract_json(response.content)

        return {
            "narrative": data.get("narrative", response.content),
            "traceability_score": data.get("traceability_score", 75),
            "anomalies": data.get("anomalies", []),
        }
```

---

### `src/api/v1/anomalies/routes.py`
```python
from fastapi import APIRouter, Query
from src.infrastructure.db.repositories.entry_repo import EntryRepository
from src.shared.constants.thresholds import LOSS_THRESHOLDS

router = APIRouter(prefix="/anomalies", tags=["anomalies"])


@router.get("/")
async def get_anomalies(days: int = Query(default=30)):
    """AnomalyPanel on dashboard — entries exceeding loss thresholds."""
    repo = EntryRepository()
    entries = await repo.get_with_losses(days)
    anomalies = []
    for e in entries:
        qty = e.get("quantity_kg", 0)
        loss = e.get("loss_kg", 0) or 0
        stage = e.get("stage", "processing")
        threshold = LOSS_THRESHOLDS.get(stage, 10.0)
        if qty > 0:
            loss_pct = (loss / qty) * 100
            if loss_pct > threshold:
                anomalies.append({
                    "id":        str(e.get("_id", "")),
                    "batch_id":  e.get("batch_id", ""),
                    "stage":     stage,
                    "material":  e.get("material"),
                    "loss_pct":  round(loss_pct, 2),
                    "threshold": threshold,
                    "severity":  "critical" if loss_pct > threshold * 2 else "warning",
                })
    return {"anomalies": anomalies, "count": len(anomalies)}
```

---

### `src/api/v1/carbon/routes.py`
```python
from fastapi import APIRouter, Query
from src.domain.carbon.calculator import CarbonCalculator

router = APIRouter(prefix="/carbon", tags=["carbon"])


@router.get("/")
async def get_carbon_data(days: int = Query(default=30)):
    """All carbon data for /carbon page: KPIs + monthly + breakdown."""
    return await CarbonCalculator().get_all(days)
```

---

### `src/domain/carbon/calculator.py` — CO2 Calculations
```python
from src.infrastructure.db.mongo import entries_col
from datetime import datetime, timedelta

# CO2 saved per kg of recycled material vs landfill (kg CO2e / kg material)
CO2_FACTORS = {
    "PET":  2.1,
    "HDPE": 1.8,
    "PP":   1.9,
    "LDPE": 1.7,
    "PVC":  2.4,
    "mixed": 1.5,
}


class CarbonCalculator:
    async def get_all(self, days: int) -> dict:
        since = datetime.utcnow() - timedelta(days=days)
        col = entries_col()

        total_co2_saved = 0.0
        by_material = {}
        monthly: dict[str, float] = {}

        async for doc in col.find({"created_at": {"$gte": since.isoformat()}, "intent": "dispatch"}):
            mat = doc.get("material", "mixed")
            qty = doc.get("quantity_kg", 0)
            co2 = qty * CO2_FACTORS.get(mat, 1.5)
            total_co2_saved += co2
            by_material[mat] = by_material.get(mat, 0) + co2

            month = doc.get("created_at", "")[:7]  # "2024-11"
            monthly[month] = monthly.get(month, 0) + co2

        return {
            "total_co2_saved_kg":  round(total_co2_saved, 2),
            "total_co2_saved_tonnes": round(total_co2_saved / 1000, 3),
            "trees_equivalent":    round(total_co2_saved / 21.7, 0),  # avg tree absorbs 21.7kg/yr
            "by_material":         {k: round(v, 2) for k, v in by_material.items()},
            "monthly": [
                {"month": m, "co2_saved_kg": round(v, 2)}
                for m, v in sorted(monthly.items())
            ],
        }
```

---

### `src/api/app.py` — FastAPI Factory
```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config.settings import settings
from src.config.logging import configure_logging
from src.infrastructure.db.mongo import init_mongo, close_mongo
from src.infrastructure.cache.redis_client import init_redis, close_redis
from src.api.v1.router import v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    await init_mongo()
    await init_redis()
    yield
    await close_mongo()
    await close_redis()


def create_app() -> FastAPI:
    app = FastAPI(
        title="TraceFlow API",
        version="1.0.0",
        description="Intelligent recycled materials traceability system",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(v1_router, prefix="/v1")

    @app.get("/health")
    async def health():
        return {"status": "ok", "model": settings.primary_model, "groq": "enabled"}

    return app


app = create_app()
```

---

### `src/api/v1/router.py`
```python
from fastapi import APIRouter
from .chat.routes     import router as chat_router
from .stats.routes    import router as stats_router
from .batches.routes  import router as batches_router
from .vendors.routes  import router as vendors_router
from .carbon.routes   import router as carbon_router
from .insights.routes import router as insights_router
from .voice.routes    import router as voice_router

# Anomalies inline (small enough to not need its own module)
from .anomalies.routes import router as anomalies_router

v1_router = APIRouter()
for r in [chat_router, stats_router, batches_router, vendors_router,
          carbon_router, insights_router, voice_router, anomalies_router]:
    v1_router.include_router(r)
```

---

## 📦 `pyproject.toml` Dependencies

```toml
[tool.poetry.dependencies]
python          = "^3.11"
fastapi         = "^0.115"
uvicorn         = {extras = ["standard"], version = "^0.30"}
pydantic        = "^2.7"
pydantic-settings = "^2.3"
httpx           = "^0.27"
motor           = "^3.5"          # MongoDB async driver
redis           = {extras = ["asyncio"], version = "^5.0"}
langgraph       = "^0.2"
langchain-core  = "^0.2"
sentence-transformers = "^3.0"
numpy           = "^1.26"
firebase-admin  = "^6.5"          # JWT verification only
python-multipart = "^0.0.9"       # File upload for voice

[tool.poetry.dev-dependencies]
pytest          = "^8.0"
pytest-asyncio  = "^0.23"
```

---

## 🌍 `.env.example`

```env
# Featherless AI (Qwen2.5-3B)
FEATHERLESS_API_KEY=your_featherless_key
PRIMARY_MODEL=Qwen/Qwen2.5-3B-Instruct
FALLBACK_MODEL=Qwen/Qwen2.5-Coder-3B-Instruct

# Groq (Voice + Fast NLP)
GROQ_API_KEY=your_groq_key

# MongoDB
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=traceflow

# Redis
REDIS_URL=redis://localhost:6379
CHAT_SESSION_TTL=86400
CONTEXT_WINDOW_MESSAGES=20

# Firebase (JWT auth only)
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json

# App
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000"]
```

---

## 🐳 `docker-compose.yml`

```yaml
version: "3.9"
services:
  api:
    build: .
    ports: ["8000:8000"]
    env_file: .env
    depends_on: [redis, mongo]
    volumes:
      - ./firebase-credentials.json:/app/firebase-credentials.json:ro

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo_data:/data/db]

volumes:
  mongo_data:
```

---

## 📊 Frontend → Backend Mapping

| Frontend Component | Calls | Backend Endpoint |
|---|---|---|
| `StatCard` (4x KPIs) | `GET /v1/stats?days=30` | `stats/routes.py` |
| `MaterialFlowSankey` | `GET /v1/stats/sankey` | `stats/routes.py` |
| `WeeklyLineChart` | `GET /v1/stats/weekly` | `stats/routes.py` |
| `MaterialPieChart` | `GET /v1/stats/materials` | `stats/routes.py` |
| `BatchStageBarChart` | `GET /v1/stats/stages` | `stats/routes.py` |
| `CompletenessGauge` | `GET /v1/stats/completeness` | `stats/routes.py` |
| `AnomalyPanel` | `GET /v1/anomalies` | `anomalies/routes.py` |
| `AIInsightsPanel` | `POST /v1/insights` | `insights/routes.py` |
| `ChatPanel` | `POST /v1/chat/` | `chat/routes.py` |
| `SessionSidebar` | `GET /v1/chat/sessions/{id}/history` | `chat/routes.py` |
| `BatchCard` grid | `GET /v1/batches` | `batches/routes.py` |
| `BatchDetail` | `GET /v1/batches/{id}` | `batches/routes.py` |
| `LossAnalysisNarrative` | `POST /v1/insights/batch/{id}` | `insights/routes.py` |
| `VendorScorecard` | `GET /v1/vendors` | `vendors/routes.py` |
| `ImpactNarrative` + charts | `GET /v1/carbon` | `carbon/routes.py` |
| Voice mic button | `POST /v1/voice/transcribe` | `voice/routes.py` |

---

## 📏 Code Rules (Non-Negotiable)

1. **Groq for speed, Featherless for reasoning.** Groq handles voice + fast intent pre-classification. Featherless Qwen2.5-3B handles entity extraction + insight generation.
2. **MongoDB for persistence, Redis for ephemerals.** Entries/batches/vendors → MongoDB. Chat session context → Redis.
3. **LangGraph nodes are pure async functions.** `(state) -> partial dict`. No shared mutable state.
4. **One aggregator per domain.** `StatsAggregator` owns all dashboard MongoDB pipelines. No pipeline logic leaks into routes.
5. **Every endpoint maps to a named frontend component.** If no frontend component needs it, it doesn't exist.
6. **`json_parser.extract_json()` on every LLM response.** LLMs return inconsistent JSON — always parse safely.
7. **CORS configured at startup.** Never debug CORS issues in production.