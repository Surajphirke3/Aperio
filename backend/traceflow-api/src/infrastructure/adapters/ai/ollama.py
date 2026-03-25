import httpx
from .base import AIAdapter, AIResponse


class OllamaAdapter(AIAdapter):
    """Local Ollama adapter for development/offline use."""

    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url

    async def complete(
        self,
        prompt: str,
        system_prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.1,
    ) -> AIResponse:
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.post(
                    f"{self.base_url}/api/chat",
                    json={
                        "model": "llama3.2",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt},
                        ],
                        "stream": False,
                        "options": {
                            "temperature": temperature,
                            "num_predict": max_tokens,
                        },
                    },
                    timeout=60.0,
                )
                resp.raise_for_status()
                data = resp.json()
                return AIResponse(
                    content=data["message"]["content"],
                    model=data.get("model", "ollama"),
                    tokens_used=data.get("eval_count", 0),
                )
            except httpx.HTTPError as e:
                raise ConnectionError(f"Ollama not reachable: {e}")

    async def health_check(self) -> bool:
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(f"{self.base_url}/api/tags", timeout=5.0)
                return resp.status_code == 200
            except httpx.HTTPError:
                return False
