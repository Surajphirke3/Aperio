# Aperio API

Python backend for supply chain traceability with natural language chat interface.

## Quick Start

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
