import httpx
from .base import AIAdapter, AIResponse
from src.config.settings import settings


from src.domain.chat.exceptions import ChatDomainError


class AIAdapterError(ChatDomainError):
    """Raised when AI adapter fails to complete a request."""
    pass


class FeatherlessAdapter(AIAdapter):
    def __init__(self, api_key: str, primary_model: str, fallback_model: str):
        self.api_key = api_key
        self.primary_model = primary_model
        self.fallback_model = fallback_model
        self.base_url = "https://api.featherless.ai/v1"

    async def complete(
        self,
        prompt: str,
        system_prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.1,
    ) -> AIResponse:
        async with httpx.AsyncClient() as client:
            try:
                response = await self._call(
                    client, prompt, system_prompt, self.primary_model, max_tokens, temperature
                )
            except AIAdapterError:
                # Automatic fallback to secondary model
                response = await self._call(
                    client, prompt, system_prompt, self.fallback_model, max_tokens, temperature
                )
            return response

    async def _call(self, client, prompt, system_prompt, model, max_tokens, temperature):
        try:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
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
                timeout=30.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return AIResponse(
                content=data["choices"][0]["message"]["content"],
                model=model,
                tokens_used=data.get("usage", {}).get("total_tokens", 0),
            )
        except httpx.HTTPError as e:
            raise AIAdapterError(f"Featherless API error: {e}") from e
        except (KeyError, IndexError) as e:
            raise AIAdapterError(f"Invalid response format from Featherless API: {e}") from e

    async def health_check(self) -> bool:
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(f"{self.base_url}/models", timeout=5.0)
                return resp.status_code == 200
            except httpx.HTTPError:
                return False
