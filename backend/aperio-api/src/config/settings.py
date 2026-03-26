from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    # Featherless AI
    featherless_api_key: str = Field(
        default="your_key_here",
        description="Featherless API key",
    )
    primary_model: str = "Qwen/Qwen2.5-3B-Instruct"
    fallback_model: str = "Qwen/Qwen2.5-Coder-3B-Instruct"
    model_temperature: float = 0.1
    model_max_tokens: int = 512

    # Firebase
    firebase_credentials_path: str = Field(default="firebase-credentials.json")
    firebase_project_id: str = Field(default="local-dev-project")

    # Redis
    redis_url: str = Field(default="redis://localhost:6379")
    chat_session_ttl: int = Field(default=86400)  # 24h in seconds
    context_window_messages: int = Field(default=20)  # last N messages in context

    # Cosine similarity
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    similarity_top_k: int = 3  # retrieve top-3 similar past messages

    # Clerk Authentication
    clerk_secret_key: str = Field(default="", description="Clerk secret key from env")

    # App
    environment: str = "development"
    cors_origins: list[str] = ["http://localhost:3000"]
    api_key_header: str = "X-API-Key"

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        case_sensitive=False,
        protected_namespaces=("settings_",),
        extra="ignore",
    )

settings = Settings()
