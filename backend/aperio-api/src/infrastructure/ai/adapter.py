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