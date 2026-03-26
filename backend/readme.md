# MASTER_PROMPT.md — Aperio Backend
## Intelligent Traceability Management System (Hackniche 4.0 — PS1)
### Production-Grade Python FastAPI Backend — Written Like a 20-Year Engineer

---

## 🎯 Mission Statement

Build a **minimal, production-grade Python FastAPI backend** for an intelligent recycled materials
traceability system. Every file must earn its place. No dead code. No scaffolding theater.
The backend powers a Next.js frontend that lets recycling operators log material movements,
query data, and receive AI-driven insights — all through natural language.

---

## 🧱 Final Tech Stack

| Layer | Technology |
|---|---|
| API Framework | FastAPI (async, Python 3.11+) |
| AI Model | Featherless AI — `Qwen/Qwen2.5-3B-Instruct` |
| AI Orchestration | LangGraph (stateful multi-step chat flows) |
| Semantic Search | Cosine similarity via `sentence-transformers` |
| Chat Memory | Redis (context window + session state) |
| Primary Database | Firebase Firestore (or PostgreSQL via SQLAlchemy) |
| Auth | Firebase Auth (JWT verification middleware) |
| Fine-Tuning | LoRA/QLoRA scaffold for Qwen2.5-3B |
| NLP Pipeline | LangGraph + custom intent/entity prompts |
| Validation | Pydantic v2 |
| Migrations | Alembic (if using PostgreSQL) |
| Testing | pytest + pytest-asyncio |
| Deployment | Docker + uvicorn |

---

## 📁 Final Folder Structure (Minimal — Every File Is Justified)

```
aperio-api/
│
├── src/
│   ├── api/
│   │   ├── app.py                    # FastAPI factory, middleware, lifespan
│   │   ├── dependencies.py           # DI: DB, Redis, AI adapter, services
│   │   └── v1/
│   │       ├── router.py             # Combines all v1 routers
│   │       ├── chat/
│   │       │   ├── routes.py         # POST /v1/chat, GET /v1/chat/sessions
│   │       │   └── schemas.py        # ChatRequest, ChatResponse, SessionResponse
│   │       ├── batches/
│   │       │   ├── routes.py         # GET /v1/batches, GET /v1/batches/{id}
│   │       │   └── schemas.py
│   │       ├── stats/
│   │       │   ├── routes.py         # GET /v1/stats (dashboard KPIs, Sankey)
│   │       │   └── schemas.py
│   │       ├── insights/
│   │       │   ├── routes.py         # POST /v1/insights/{batch_id}
│   │       │   └── schemas.py
│   │       └── vendors/
│   │           ├── routes.py
│   │           └── schemas.py
│   │
│   ├── domain/
│   │   ├── chat/
│   │   │   ├── graph.py              # LangGraph StateGraph definition
│   │   │   ├── nodes.py              # Graph nodes: classify → extract → store/query
│   │   │   ├── memory.py             # Redis context window manager
│   │   │   ├── similarity.py         # Cosine similarity retrieval
│   │   │   └── models.py             # ChatIntent, ParsedEntry, QueryFilter, Message
│   │   ├── batches/
│   │   │   ├── models.py             # Batch, BatchStage, AnomalyAlert
│   │   │   ├── services.py           # Batch CRUD + anomaly detection
│   │   │   └── exceptions.py
│   │   ├── insights/
│   │   │   ├── models.py
│   │   │   └── services.py           # AI-driven batch narrative generation
│   │   └── vendors/
│   │       ├── models.py
│   │       └── services.py
│   │
│   ├── infrastructure/
│   │   ├── ai/
│   │   │   ├── adapter.py            # FeatherlessAdapter (primary + fallback)
│   │   │   └── prompts/
│   │   │       ├── intent.py         # System prompt: intent classification
│   │   │       ├── entity.py         # System prompt: entity extraction → JSON
│   │   │       ├── query.py          # System prompt: NL → filter struct
│   │   │       └── insight.py        # System prompt: batch narrative
│   │   ├── db/
│   │   │   ├── firestore.py          # Firestore client + CRUD helpers
│   │   │   ├── models.py             # SQLAlchemy ORM (if PostgreSQL path)
│   │   │   └── repositories/
│   │   │       ├── batch_repo.py
│   │   │       ├── message_repo.py   # Chat message persistence
│   │   │       └── vendor_repo.py
│   │   └── cache/
│   │       └── redis_client.py       # Redis connection + session helpers
│   │
│   ├── shared/
│   │   ├── utils/
│   │   │   ├── json_parser.py        # Robust LLM JSON extraction
│   │   │   └── dates.py              # "yesterday", "last week" → ISO date
│   │   └── constants/
│   │       ├── materials.py          # MaterialType enum
│   │       └── stages.py             # ProcessStage enum
│   │
│   └── config/
│       ├── settings.py               # Pydantic BaseSettings — all env vars
│       └── logging.py                # Structured JSON logging
│
├── finetune/
│   ├── prepare_dataset.py            # Kaggle CSV → instruction-tuning JSONL
│   ├── train.py                      # LoRA fine-tune Qwen2.5-3B (HuggingFace)
│   └── README.md                     # How to run fine-tuning
│
├── tests/
│   ├── conftest.py                   # Fixtures: mock AI, DB, Redis
│   ├── test_chat_graph.py            # LangGraph flow tests
│   ├── test_similarity.py            # Cosine retrieval tests
│   └── test_repositories.py         # DB layer tests
│
├── scripts/
│   └── seed_db.py                    # Load Kaggle dataset into Firestore/DB
│
├── Dockerfile
├── docker-compose.yml                # FastAPI + Redis + PostgreSQL
├── pyproject.toml
├── .env.example
└── README.md
```

**Files deliberately NOT created:**
- No `__init__.py` boilerplate unless truly needed for exports
- No separate `exceptions.py` per domain unless the domain has 3+ distinct exception types
- No `carbon/` domain (can be derived stats, not a domain)
- No Kaggle adapter (handled once in `seed_db.py`)
- No Ollama adapter (Featherless is the target — one adapter)

---

## 🧠 Core Architecture: The Chat Pipeline

This is the heart of the system. Everything else supports it.

```
User Message
     │
     ▼
[Redis] Load session history + cosine-similar past messages
     │
     ▼
[LangGraph Node 1] classify_intent
     │  Qwen2.5-3B via Featherless
     │  Output: IntentType (PURCHASE | PROCESSING | DISPATCH | QUERY | REPORT)
     │
     ├─── PURCHASE / PROCESSING / DISPATCH ──►
     │         [LangGraph Node 2a] extract_entities
     │              Qwen2.5-3B → structured JSON
     │         [LangGraph Node 3a] store_entry
     │              Firestore write → returns confirmation
     │
     └─── QUERY / REPORT ──►
               [LangGraph Node 2b] build_query_filter
                    Qwen2.5-3B → structured filter JSON
               [LangGraph Node 3b] run_stats_query
                    Firestore aggregation → formatted result
     │
     ▼
[Redis] Append message pair to session history
     │
     ▼
[Response] Structured JSON + natural language reply to frontend
```

---

## 🔑 Critical File Implementations

### `src/config/settings.py`
```python
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # Featherless AI
    featherless_api_key: str = Field(..., description="Featherless API key")
    primary_model: str = "Qwen/Qwen2.5-3B-Instruct"
    fallback_model: str = "Qwen/Qwen2.5-Coder-3B-Instruct"
    model_temperature: float = 0.1
    model_max_tokens: int = 512

    # Firebase
    firebase_credentials_path: str = Field(default="firebase-credentials.json")
    firebase_project_id: str = Field(...)

    # Redis
    redis_url: str = Field(default="redis://localhost:6379")
    chat_session_ttl: int = Field(default=86400)  # 24h in seconds
    context_window_messages: int = Field(default=20)  # last N messages in context

    # Cosine similarity
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    similarity_top_k: int = 3  # retrieve top-3 similar past messages

    # App
    environment: str = "development"
    cors_origins: list[str] = ["http://localhost:3000"]
    api_key_header: str = "X-API-Key"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
```

---

### `src/domain/chat/graph.py` — LangGraph Orchestration
```python
from typing import TypedDict, Optional, Annotated
from langgraph.graph import StateGraph, END
import operator

from .nodes import classify_intent, extract_entities, build_query_filter
from .nodes import store_entry, run_stats_query, generate_reply
from .models import IntentType


class ChatState(TypedDict):
    """Full state passed between LangGraph nodes."""
    session_id: str
    user_message: str
    history: list[dict]              # Last N messages from Redis
    similar_context: list[dict]      # Top-k cosine-similar past messages
    intent: Optional[IntentType]
    extracted_data: Optional[dict]   # Parsed entities or query filters
    db_result: Optional[dict]        # Result from Firestore
    reply: Optional[str]             # Final reply to user
    error: Optional[str]


def route_by_intent(state: ChatState) -> str:
    """Edge function: decides which node to call after classification."""
    intent = state.get("intent")
    if intent in (IntentType.QUERY, IntentType.REPORT):
        return "build_query_filter"
    elif intent in (IntentType.PURCHASE, IntentType.PROCESSING, IntentType.DISPATCH):
        return "extract_entities"
    return "generate_reply"  # fallback for unrecognized


def build_chat_graph() -> StateGraph:
    graph = StateGraph(ChatState)

    graph.add_node("classify_intent", classify_intent)
    graph.add_node("extract_entities", extract_entities)
    graph.add_node("build_query_filter", build_query_filter)
    graph.add_node("store_entry", store_entry)
    graph.add_node("run_stats_query", run_stats_query)
    graph.add_node("generate_reply", generate_reply)

    graph.set_entry_point("classify_intent")

    graph.add_conditional_edges(
        "classify_intent",
        route_by_intent,
        {
            "extract_entities": "extract_entities",
            "build_query_filter": "build_query_filter",
            "generate_reply": "generate_reply",
        }
    )

    graph.add_edge("extract_entities", "store_entry")
    graph.add_edge("build_query_filter", "run_stats_query")
    graph.add_edge("store_entry", "generate_reply")
    graph.add_edge("run_stats_query", "generate_reply")
    graph.add_edge("generate_reply", END)

    return graph.compile()


# Singleton — compiled once at startup
chat_graph = build_chat_graph()
```

---

### `src/domain/chat/memory.py` — Redis Context Manager
```python
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
```

---

### `src/domain/chat/similarity.py` — Cosine Similarity Retrieval
```python
import numpy as np
from sentence_transformers import SentenceTransformer
from src.config.settings import settings

# Loaded once at startup — ~80MB, fits in any server
_model: SentenceTransformer | None = None


def get_embedding_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.embedding_model)
    return _model


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-10))


async def get_similar_context(
    query: str,
    history: list[dict],
    top_k: int | None = None,
) -> list[dict]:
    """Returns top-k most semantically similar past messages to the query.
    
    Used to inject relevant long-term context without blowing the LLM context window.
    Only user messages are compared — assistant messages are included as pairs.
    """
    if not history:
        return []

    k = top_k or settings.similarity_top_k
    model = get_embedding_model()

    query_embedding = model.encode(query)
    user_messages = [m for m in history if m["role"] == "user"]

    if not user_messages:
        return []

    corpus = [m["content"] for m in user_messages]
    corpus_embeddings = model.encode(corpus)

    scores = [cosine_similarity(query_embedding, emb) for emb in corpus_embeddings]
    top_indices = np.argsort(scores)[::-1][:k]

    return [user_messages[i] for i in top_indices if scores[i] > 0.3]  # threshold
```

---

### `src/infrastructure/ai/adapter.py` — Featherless Adapter
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
    """Single adapter for Featherless AI cloud.
    
    Auto-falls back to secondary model on HTTP error.
    All timeouts and retries handled here — callers get clean AIResponse or exception.
    """
    BASE_URL = "https://api.featherless.ai/v1"

    def __init__(self):
        self.api_key = settings.featherless_api_key
        self.primary = settings.primary_model
        self.fallback = settings.fallback_model

    async def complete(
        self,
        prompt: str,
        system_prompt: str,
        max_tokens: int | None = None,
        temperature: float | None = None,
    ) -> AIResponse:
        async with httpx.AsyncClient(timeout=30.0) as client:
            result = await self._call(
                client, prompt, system_prompt,
                self.primary,
                max_tokens or settings.model_max_tokens,
                temperature or settings.model_temperature,
            )
            if result is None:
                result = await self._call(
                    client, prompt, system_prompt,
                    self.fallback,
                    max_tokens or settings.model_max_tokens,
                    temperature or settings.model_temperature,
                )
            if result is None:
                raise RuntimeError("Both primary and fallback models failed")
            return result

    async def _call(
        self, client: httpx.AsyncClient,
        prompt: str, system_prompt: str,
        model: str, max_tokens: int, temperature: float,
    ) -> AIResponse | None:
        try:
            resp = await client.post(
                f"{self.BASE_URL}/chat/completions",
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
```

---

### `src/domain/chat/nodes.py` — LangGraph Nodes
```python
"""Each node is a pure async function: (state) -> partial state dict.
Nodes never call each other directly — LangGraph wires the edges."""

from src.infrastructure.ai.adapter import FeatherlessAdapter
from src.infrastructure.ai.prompts.intent import INTENT_SYSTEM_PROMPT
from src.infrastructure.ai.prompts.entity import ENTITY_SYSTEM_PROMPT
from src.infrastructure.ai.prompts.query import QUERY_SYSTEM_PROMPT
from src.shared.utils.json_parser import extract_json
from .models import IntentType, ChatState


_adapter = FeatherlessAdapter()


async def classify_intent(state: ChatState) -> dict:
    """Node 1: classify user message intent via Qwen2.5-3B."""
    history_text = _format_history(state["history"])
    similar_text = _format_history(state["similar_context"])

    prompt = f"""Conversation so far:
{history_text}

Relevant past context:
{similar_text}

Current message: {state["user_message"]}"""

    response = await _adapter.complete(prompt, INTENT_SYSTEM_PROMPT)
    data = extract_json(response.content)
    intent_str = data.get("intent", "query").lower()

    try:
        intent = IntentType(intent_str)
    except ValueError:
        intent = IntentType.QUERY

    return {"intent": intent}


async def extract_entities(state: ChatState) -> dict:
    """Node 2a: extract structured entities from data-entry messages."""
    response = await _adapter.complete(state["user_message"], ENTITY_SYSTEM_PROMPT)
    data = extract_json(response.content)
    return {"extracted_data": data}


async def build_query_filter(state: ChatState) -> dict:
    """Node 2b: extract query filters from reporting questions."""
    response = await _adapter.complete(state["user_message"], QUERY_SYSTEM_PROMPT)
    data = extract_json(response.content)
    return {"extracted_data": data}


async def store_entry(state: ChatState) -> dict:
    """Node 3a: write extracted entity data to Firestore."""
    from src.infrastructure.db.firestore import FirestoreDB
    db = FirestoreDB()
    data = state["extracted_data"]
    data["session_id"] = state["session_id"]
    result = await db.create_entry(data)
    return {"db_result": {"action": "stored", "id": result["id"], "data": data}}


async def run_stats_query(state: ChatState) -> dict:
    """Node 3b: run aggregation query against Firestore."""
    from src.infrastructure.db.firestore import FirestoreDB
    db = FirestoreDB()
    filters = state["extracted_data"]
    result = await db.query_stats(filters)
    return {"db_result": {"action": "queried", "result": result}}


async def generate_reply(state: ChatState) -> dict:
    """Final node: compose human-readable reply from db_result."""
    db_result = state.get("db_result") or {}
    action = db_result.get("action")

    if action == "stored":
        d = db_result["data"]
        reply = f"✅ Logged: {d.get('quantity_kg')}kg {d.get('material')} — {d.get('intent')} recorded."
    elif action == "queried":
        result = db_result.get("result", {})
        reply = _format_query_result(result)
    else:
        reply = "I understood your message but could not process it. Please rephrase."

    return {"reply": reply}


def _format_history(messages: list[dict]) -> str:
    if not messages:
        return "(none)"
    return "\n".join(f"{m['role'].upper()}: {m['content']}" for m in messages)


def _format_query_result(result: dict) -> str:
    if not result:
        return "No data found for that query."
    lines = [f"- {k}: {v}" for k, v in result.items()]
    return "Here's what I found:\n" + "\n".join(lines)
```

---

### `src/api/v1/chat/routes.py` — Chat Endpoint
```python
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
import uuid

from .schemas import ChatRequest, ChatResponse, SessionListResponse
from src.domain.chat.graph import chat_graph
from src.domain.chat.memory import ChatMemory
from src.domain.chat.similarity import get_similar_context
from src.api.dependencies import verify_token

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    user_id: str = Depends(verify_token),
) -> ChatResponse:
    """
    Core chat endpoint.
    1. Load session history from Redis
    2. Retrieve cosine-similar context
    3. Run LangGraph pipeline
    4. Persist messages to Redis + Firestore
    5. Return structured response
    """
    session_id = request.session_id or str(uuid.uuid4())
    memory = ChatMemory(session_id=session_id)

    history = await memory.get_history()
    similar_context = await get_similar_context(request.message, history)

    initial_state = {
        "session_id": session_id,
        "user_message": request.message,
        "history": history,
        "similar_context": similar_context,
        "intent": None,
        "extracted_data": None,
        "db_result": None,
        "reply": None,
        "error": None,
    }

    try:
        final_state = await chat_graph.ainvoke(initial_state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat pipeline failed: {str(e)}")

    # Persist to Redis session memory
    await memory.append("user", request.message, intent=None)
    await memory.append(
        "assistant",
        final_state["reply"],
        intent=str(final_state.get("intent")),
    )

    return ChatResponse(
        session_id=session_id,
        reply=final_state["reply"],
        intent=str(final_state.get("intent", "unknown")),
        structured_data=final_state.get("db_result"),
        success=True,
    )


@router.get("/sessions/{session_id}/history")
async def get_session_history(
    session_id: str,
    user_id: str = Depends(verify_token),
):
    memory = ChatMemory(session_id=session_id)
    history = await memory.get_history()
    return {"session_id": session_id, "messages": history, "count": len(history)}


@router.delete("/sessions/{session_id}")
async def clear_session(
    session_id: str,
    user_id: str = Depends(verify_token),
):
    memory = ChatMemory(session_id=session_id)
    await memory.clear()
    return {"message": "Session cleared", "session_id": session_id}
```

---

### `src/infrastructure/ai/prompts/intent.py`
```python
INTENT_SYSTEM_PROMPT = """You are an intent classifier for a recycled materials tracking system.

Given the conversation history and current user message, classify the intent into exactly ONE of:
- purchase     → buying/receiving raw material from a vendor
- processing   → processing/sorting/recycling activity
- dispatch     → sending out/dispatching processed material
- query        → asking for data, counts, totals, or summaries
- report       → requesting a report or multi-metric summary

Respond ONLY with a JSON object:
{"intent": "<one of the 5 intents above>", "confidence": 0.0-1.0}

Do not add any explanation. Return only JSON."""


ENTITY_SYSTEM_PROMPT_TEMPLATE = """You are an entity extractor for a recycled materials tracking system.

Extract ALL relevant fields from the user message. Return ONLY a JSON object with these fields:
{
  "intent": "purchase|processing|dispatch",
  "material": "PET|HDPE|PP|LDPE|PVC|mixed",
  "quantity_kg": <number>,
  "date": "<ISO 8601 date, infer from relative terms like 'yesterday'>",
  "vendor": "<vendor name or null>",
  "stage": "collection|sorting|processing|output|dispatch or null",
  "loss_kg": <number or null>,
  "batch_id": "<batch ID or null>",
  "notes": "<any additional notes or null>"
}

Today's date for reference: {today}
Return ONLY JSON. No explanation."""
```

---

### `src/infrastructure/db/firestore.py` — Firestore Client
```python
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.async_client import AsyncClient
from src.config.settings import settings
from datetime import datetime


def _init_firebase() -> AsyncClient:
    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.firebase_credentials_path)
        firebase_admin.initialize_app(cred)
    return firestore.AsyncClient(project=settings.firebase_project_id)


_db: AsyncClient | None = None


def get_firestore() -> AsyncClient:
    global _db
    if _db is None:
        _db = _init_firebase()
    return _db


class FirestoreDB:
    def __init__(self):
        self.db = get_firestore()

    async def create_entry(self, data: dict) -> dict:
        data["created_at"] = datetime.utcnow().isoformat()
        ref = self.db.collection("material_entries").document()
        await ref.set(data)
        return {"id": ref.id, **data}

    async def query_stats(self, filters: dict) -> dict:
        """Flexible aggregation query based on extracted filter struct."""
        collection = self.db.collection("material_entries")
        query = collection

        if metric := filters.get("metric"):
            query = query.where("intent", "==", metric)
        if material := filters.get("material"):
            query = query.where("material", "==", material)
        if vendor := filters.get("vendor"):
            query = query.where("vendor", "==", vendor)

        docs = await query.get()
        entries = [doc.to_dict() for doc in docs]

        total_kg = sum(e.get("quantity_kg", 0) for e in entries)
        total_loss = sum(e.get("loss_kg", 0) or 0 for e in entries)

        return {
            "count": len(entries),
            "total_kg": round(total_kg, 2),
            "total_loss_kg": round(total_loss, 2),
            "loss_pct": round((total_loss / total_kg * 100) if total_kg else 0, 2),
        }

    async def get_batches(self, limit: int = 50) -> list[dict]:
        docs = await self.db.collection("material_entries") \
            .order_by("created_at", direction="DESCENDING") \
            .limit(limit).get()
        return [{"id": d.id, **d.to_dict()} for d in docs]

    async def get_dashboard_stats(self) -> dict:
        """Aggregated KPIs for the dashboard."""
        docs = await self.db.collection("material_entries").get()
        entries = [d.to_dict() for d in docs]

        by_material: dict[str, float] = {}
        by_stage: dict[str, float] = {}
        total_dispatched = 0.0

        for e in entries:
            mat = e.get("material", "unknown")
            qty = e.get("quantity_kg", 0)
            by_material[mat] = by_material.get(mat, 0) + qty

            stage = e.get("stage", "unknown")
            by_stage[stage] = by_stage.get(stage, 0) + qty

            if e.get("intent") == "dispatch":
                total_dispatched += qty

        return {
            "total_entries": len(entries),
            "by_material": by_material,
            "by_stage": by_stage,
            "total_dispatched_kg": round(total_dispatched, 2),
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
from src.infrastructure.cache.redis_client import init_redis, close_redis
from src.api.v1.router import v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup + shutdown lifecycle."""
    configure_logging()
    await init_redis()
    yield
    await close_redis()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Aperio API",
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
        return {"status": "ok", "model": settings.primary_model}

    return app


app = create_app()
```

---

## 🔧 Fine-Tuning Pipeline (`finetune/`)

### `finetune/prepare_dataset.py`
```python
"""
Converts Kaggle recycling dataset CSV into instruction-tuning JSONL
format for LoRA fine-tuning of Qwen2.5-3B.

Dataset: https://www.kaggle.com/datasets/synapsehackniche/hackniche-4-0-ps-3-dataset
"""
import json
import pandas as pd
from pathlib import Path


INSTRUCTION_TEMPLATE = """You are an assistant for a recycled materials tracking system.
Extract structured data from the user's natural language input."""

def row_to_instruction(row: pd.Series) -> dict:
    user_msg = f"Log: {row['quantity_kg']}kg of {row['material']} {row['intent']} from {row.get('vendor', 'unknown')}"
    assistant_msg = json.dumps({
        "intent": row["intent"],
        "material": row["material"],
        "quantity_kg": float(row["quantity_kg"]),
        "date": str(row.get("date", "")),
        "vendor": row.get("vendor"),
    })
    return {
        "instruction": INSTRUCTION_TEMPLATE,
        "input": user_msg,
        "output": assistant_msg,
    }


def prepare(csv_path: str, output_path: str = "finetune/dataset.jsonl") -> None:
    df = pd.read_csv(csv_path)
    Path(output_path).parent.mkdir(exist_ok=True)

    with open(output_path, "w") as f:
        for _, row in df.iterrows():
            example = row_to_instruction(row)
            f.write(json.dumps(example) + "\n")

    print(f"Written {len(df)} examples to {output_path}")


if __name__ == "__main__":
    import sys
    prepare(sys.argv[1])
```

### `finetune/train.py`
```python
"""
LoRA fine-tuning for Qwen2.5-3B-Instruct on recycling domain data.
Runs on a single GPU (RTX 3060 12GB or better) with 4-bit quantization.
"""
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, TaskType
from trl import SFTTrainer
from datasets import load_dataset


MODEL_NAME = "Qwen/Qwen2.5-3B-Instruct"
OUTPUT_DIR = "finetune/output"


def train(dataset_path: str = "finetune/dataset.jsonl") -> None:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        load_in_4bit=True,      # QLoRA — fits on 12GB VRAM
        device_map="auto",
        trust_remote_code=True,
    )

    lora_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=16,                   # LoRA rank
        lora_alpha=32,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
        lora_dropout=0.05,
    )
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    dataset = load_dataset("json", data_files=dataset_path, split="train")

    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        num_train_epochs=3,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        fp16=True,
        save_strategy="epoch",
        logging_steps=10,
        report_to="none",
    )

    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        tokenizer=tokenizer,
        args=training_args,
        dataset_text_field="output",
        max_seq_length=512,
    )

    trainer.train()
    trainer.save_model(OUTPUT_DIR)
    print(f"Fine-tuned model saved to {OUTPUT_DIR}")


if __name__ == "__main__":
    train()
```

---

## 📦 Dependencies (`pyproject.toml`)

```toml
[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.115"
uvicorn = {extras = ["standard"], version = "^0.30"}
pydantic = "^2.7"
pydantic-settings = "^2.3"
httpx = "^0.27"
langgraph = "^0.2"
langchain-core = "^0.2"
redis = {extras = ["asyncio"], version = "^5.0"}
firebase-admin = "^6.5"
sentence-transformers = "^3.0"
numpy = "^1.26"

# Fine-tuning (install separately on GPU machine)
# transformers = "^4.44"
# peft = "^0.12"
# trl = "^0.10"
# datasets = "^2.21"
# bitsandbytes = "^0.43"

[tool.poetry.dev-dependencies]
pytest = "^8.0"
pytest-asyncio = "^0.23"
httpx = "^0.27"
```

---

## 🌍 Environment Variables (`.env.example`)

```env
# Featherless AI
FEATHERLESS_API_KEY=your_key_here
PRIMARY_MODEL=Qwen/Qwen2.5-3B-Instruct
FALLBACK_MODEL=Qwen/Qwen2.5-Coder-3B-Instruct

# Firebase
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
FIREBASE_PROJECT_ID=your-project-id

# Redis
REDIS_URL=redis://localhost:6379
CHAT_SESSION_TTL=86400
CONTEXT_WINDOW_MESSAGES=20

# Cosine Similarity
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
SIMILARITY_TOP_K=3

# App
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000"]
```

---

## 🐳 Docker (`docker-compose.yml`)

```yaml
version: "3.9"
services:
  api:
    build: .
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      - redis
    volumes:
      - ./firebase-credentials.json:/app/firebase-credentials.json:ro

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
```

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install --no-dev

COPY src/ src/

CMD ["uvicorn", "src.api.app:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## ✅ PS1 Requirements Coverage Matrix

| PS1 Requirement | Implementation |
|---|---|
| Conversational data entry (NL → JSON) | `nodes.py::extract_entities` + entity prompt |
| Intent classification (Purchase/Processing/Dispatch) | `nodes.py::classify_intent` + LangGraph routing |
| Structured output (JSON) | `extract_json()` + Pydantic response schemas |
| Backend storage integration | `FirestoreDB.create_entry()` |
| Conversational querying ("how much dispatched?") | `nodes.py::build_query_filter` + `run_stats_query` |
| Filter extraction (date, stage, material) | `QUERY_SYSTEM_PROMPT` + entity extraction |
| Dashboard stats / Sankey data | `GET /v1/stats` + `get_dashboard_stats()` |
| AI-driven batch insights + anomaly detection | `POST /v1/insights/{batch_id}` + insight prompt |
| Context memory across turns | `ChatMemory` in Redis (LPUSH/LTRIM) |
| ≤3B parameter model | Qwen2.5-3B-Instruct via Featherless |
| Low-resource deployment | Docker + Redis + Firestore (no GPU needed for inference) |
| Fine-tuning (optional, PS says bonus) | `finetune/` LoRA pipeline with Kaggle dataset |
| Cosine similarity retrieval | `similarity.py` with `all-MiniLM-L6-v2` |
| LangGraph orchestration | `graph.py` — full StateGraph with conditional routing |

---

## 🚀 Startup Commands

```bash
# 1. Install
pip install poetry && poetry install

# 2. Configure
cp .env.example .env
# Fill in FEATHERLESS_API_KEY, FIREBASE credentials

# 3. Start services
docker-compose up redis -d

# 4. Run API
uvicorn src.api.app:app --reload --port 8000

# 5. Test chat
curl -X POST http://localhost:8000/v1/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Purchased 300kg of PET bottles from Vendor A yesterday."}'

# 6. Run tests
pytest tests/ -v

# 7. Fine-tune (on GPU machine — optional)
python finetune/prepare_dataset.py data/kaggle.csv
python finetune/train.py
```

---

## 📏 Code Discipline Rules

1. **Every file does one thing.** `graph.py` builds the graph. `nodes.py` defines nodes. Never mix.
2. **Nodes are pure functions.** `(state) -> dict`. No side effects except DB/Redis calls in store nodes.
3. **No business logic in routes.** Routes validate → inject → call service → return schema.
4. **Redis for ephemerals, Firestore for permanents.** Chat session context = Redis. Material entries = Firestore.
5. **Cosine similarity is retrieval, not replacement.** It augments context, doesn't replace history.
6. **Fail fast.** Settings validation at startup. Missing env var = exception before first request served.
7. **One AI adapter.** Featherless with fallback. No abstraction overhead for a single provider.