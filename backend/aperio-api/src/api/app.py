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