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
    ollama_model: str = Field(default="llama3.2")
    primary_model: str = Field(default="meta-llama/Llama-3.2-3B-Instruct")
    fallback_model: str = Field(default="Qwen/Qwen2.5-3B-Instruct")

    # Database
    database_url: str = Field(default="sqlite:///./traceflow.db")

    # App
    environment: str = Field(default="development")
    debug: bool = Field(default=False)
    cors_origins: list[str] = Field(default=["http://localhost:3000"])

    @validator("featherless_api_key")
    def validate_featherless_key(cls, v, values):
        if values.get("ai_provider") == AIProvider.FEATHERLESS and not v:
            raise ValueError("FEATHERLESS_API_KEY is required when AI_PROVIDER=featherless")
        return v

    class Config:
        env_file = ".env"
        case_sensitive = False


# Singleton — import this everywhere
settings = Settings()
