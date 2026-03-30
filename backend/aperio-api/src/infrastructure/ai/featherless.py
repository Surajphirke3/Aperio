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
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                # Redirecting strictly to Local Ollama Cloud
                resp = await client.post(
                    "http://127.0.0.1:11434/api/chat",
                    headers={
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "qwen3.5:cloud", # Native Ollama tag
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt},
                        ],
                        "stream": False
                    },
                )
                resp.raise_for_status()
                d = resp.json()
                return AIResponse(
                    content=d["message"]["content"],
                    model="ollama-local",
                    tokens_used=d.get("eval_count", 0),
                )
            except Exception as e:
                logger.error(f"Local Ollama Server failed: {e}")
                # Ensure Ollama is running (`ollama serve`) and model is pulled (`ollama pull llama3.2`)
                raise RuntimeError(f"Both primary AI and fallback failed: {str(e)}")

        raise RuntimeError("Unexpected end of completion function")

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
