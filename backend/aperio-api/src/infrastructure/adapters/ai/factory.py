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
            _adapter_instance = OllamaAdapter(
                base_url=settings.ollama_base_url,
                model=settings.ollama_model
            )
        else:
            _adapter_instance = FeatherlessAdapter(
                api_key=settings.featherless_api_key,
                primary_model=settings.primary_model,
                fallback_model=settings.fallback_model,
            )
    return _adapter_instance
