from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    # Groq (voice transcription + NLP assist + main completion)
    groq_api_key: str = Field(default="your_key_here")
    primary_model: str = "llama-3.3-70b-versatile"
    fallback_model: str = "llama3-8b-8192"
    model_temperature: float = 0.1
    model_max_tokens: int = 512

    groq_whisper_model: str = "whisper-large-v3"
    groq_nlp_model: str = "llama3-8b-8192"

    # MongoDB
    mongodb_url: str = Field(default="mongodb://localhost:27017")
    mongodb_db_name: str = "traceflow"

    # Redis
    redis_url: str = Field(default="redis://localhost:6379")
    chat_session_ttl: int = 86400
    context_window_messages: int = 20

    # Cosine similarity
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    similarity_top_k: int = 3

    # Firebase (JWT auth only)
    firebase_credentials_path: str = Field(default="firebase-credentials.json")

    # Clerk Authentication
    clerk_secret_key: str = Field(default="", description="Clerk secret key from env")

    # App
    environment: str = "development"
    cors_origins: list[str] = ["http://localhost:3000", "*"]

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        case_sensitive=False,
        protected_namespaces=("settings_",),
        extra="ignore",
    )


settings = Settings()
