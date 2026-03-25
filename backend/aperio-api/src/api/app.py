from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config.settings import settings
from src.config.logging import setup_logging
from src.api.v1.router import v1_router


def create_app() -> FastAPI:
    """FastAPI application factory."""
    setup_logging("DEBUG" if settings.debug else "INFO")

    app = FastAPI(
        title="Aperio API",
        description="Supply chain traceability with natural language chat",
        version="0.1.0",
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
        return {"status": "ok", "environment": settings.environment}

    return app


app = create_app()
