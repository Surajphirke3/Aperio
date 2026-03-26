# Aperio API

Intelligent recycled materials traceability system — FastAPI backend.

## Tech Stack

- **API**: FastAPI (async, Python 3.11+)
- **AI Model**: Featherless AI — Qwen/Qwen2.5-3B-Instruct
- **AI Orchestration**: LangGraph (stateful multi-step chat flows)
- **Semantic Search**: Cosine similarity via sentence-transformers
- **Chat Memory**: Redis (context window + session state)
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth (JWT verification)
- **Validation**: Pydantic v2
- **Testing**: pytest + pytest-asyncio
- **Deployment**: Docker + uvicorn

## Quick Start

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
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/v1/chat/` | Send chat message |
| GET | `/v1/chat/sessions/{id}/history` | Get session history |
| DELETE | `/v1/chat/sessions/{id}` | Clear session |
| GET | `/v1/batches/` | List batches |
| GET | `/v1/batches/{id}` | Get batch by ID |
| GET | `/v1/stats/` | Dashboard KPIs |
| POST | `/v1/insights/{batch_id}` | AI batch insight |
| GET | `/v1/vendors/` | List vendors |

## Architecture

```
User Message → Redis (load history) → LangGraph Pipeline → Response
                                         ├── classify_intent
                                         ├── extract_entities / build_query_filter
                                         ├── store_entry / run_stats_query
                                         └── generate_reply
```

## Fine-Tuning (Optional)

See `finetune/README.md` for LoRA fine-tuning instructions.