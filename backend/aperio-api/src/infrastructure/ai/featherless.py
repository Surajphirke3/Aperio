import httpx
import logging
from dataclasses import dataclass

from src.config.settings import settings

logger = logging.getLogger(__name__)


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

    def __init__(self):
        self.api_key = settings.featherless_api_key
        if not self.api_key or self.api_key == "your_key_here":
            logger.error("FEATHERLESS_API_KEY not configured. Featherless AI features will be unavailable.")
            self.api_key = None

    async def complete(
        self,
        prompt: str,
        system_prompt: str,
        max_tokens: int | None = None,
        temperature: float | None = None,
    ) -> AIResponse:
        if not self.api_key:
            raise RuntimeError("FEATHERLESS_API_KEY not configured. Please set a valid API key in your .env file.")
        
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
            d = resp.json()
            return AIResponse(
                content=d["choices"][0]["message"]["content"],
                model=model,
                tokens_used=d.get("usage", {}).get("total_tokens", 0),
            )
        except httpx.HTTPError as e:
            logger.warning(f"Featherless model {model} failed: {e}")
            return None
        except Exception as e:
            logger.warning(f"Featherless model {model} error: {e}")
            return None
