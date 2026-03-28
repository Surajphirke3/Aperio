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


class GroqAdapter:
    """Groq adapter — three jobs:
    1. Voice transcription: audio file → text (Whisper large-v3, ~300ms)
    2. Fast NLP assist: simple intent pre-classification to offload
    3. Main completion: Complex reasoning and entity extraction
    """
    BASE_URL = "https://api.groq.com/openai/v1"

    def __init__(self):
        self.api_key = settings.groq_api_key
        if not self.api_key or self.api_key == "your_key_here":
            logger.warning("GROQ_API_KEY not configured. Groq features will be unavailable.")
            self.api_key = None

    async def complete(
        self,
        prompt: str,
        system_prompt: str,
        max_tokens: int | None = None,
        temperature: float | None = None,
    ) -> AIResponse:
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                resp = await client.post(
                    f"{self.BASE_URL}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": settings.primary_model,
                        "max_tokens": max_tokens or settings.model_max_tokens,
                        "temperature": temperature or settings.model_temperature,
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
                    model=settings.primary_model,
                    tokens_used=d.get("usage", {}).get("total_tokens", 0),
                )
            except Exception as e:
                logger.error(f"Groq API primary model failed, falling back: {e}")
                
            try:
                resp = await client.post(
                    f"{self.BASE_URL}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": settings.fallback_model,
                        "max_tokens": max_tokens or settings.model_max_tokens,
                        "temperature": temperature or settings.model_temperature,
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
                    model=settings.fallback_model,
                    tokens_used=d.get("usage", {}).get("total_tokens", 0),
                )
            except Exception as e:
                logger.error(f"Groq API fallback model failed: {e}")
                raise RuntimeError(f"Both primary AI and fallback failed: {str(e)}")

    async def transcribe(self, audio_bytes: bytes, filename: str = "audio.webm") -> str:
        """Convert voice audio to text using Groq Whisper."""
        if not self.api_key:
            raise RuntimeError("Groq API key not configured")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{self.BASE_URL}/audio/transcriptions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                files={"file": (filename, audio_bytes, "audio/webm")},
                data={"model": settings.groq_whisper_model},
            )
            resp.raise_for_status()
            return resp.json()["text"]

    async def fast_classify(self, message: str) -> str:
        """Quick intent pre-classification using Groq Llama3-8b.
        Returns: 'purchase' | 'processing' | 'dispatch' | 'query' | 'report' | 'unknown'
        """
        if not self.api_key:
            logger.debug("Groq API key not configured, skipping fast classification")
            return "unknown"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                resp = await client.post(
                    f"{self.BASE_URL}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": settings.groq_nlp_model,
                        "max_tokens": 50,
                        "temperature": 0.0,
                        "messages": [
                            {
                                "role": "system",
                                "content": (
                                    "Classify the intent of this recycling operations message. "
                                    "Respond with ONLY one word: purchase, processing, dispatch, query, or report."
                                ),
                            },
                            {"role": "user", "content": message},
                        ],
                    },
                )
                resp.raise_for_status()
                raw = resp.json()["choices"][0]["message"]["content"].strip().lower()
                valid = {"purchase", "processing", "dispatch", "query", "report"}
                return raw if raw in valid else "unknown"
            except httpx.HTTPError as e:
                logger.warning(f"Groq classification failed: {e}")
                return "unknown"
            except Exception as e:
                logger.warning(f"Groq classification error: {e}")
                return "unknown"
