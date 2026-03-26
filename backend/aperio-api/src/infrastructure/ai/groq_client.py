import httpx
import logging

from src.config.settings import settings

logger = logging.getLogger(__name__)


class GroqAdapter:
    """Groq adapter — two jobs:
    1. Voice transcription: audio file → text (Whisper large-v3, ~300ms)
    2. Fast NLP assist: simple intent pre-classification to offload Featherless
    """
    BASE_URL = "https://api.groq.com/openai/v1"

    def __init__(self):
        self.api_key = settings.groq_api_key
        if not self.api_key or self.api_key == "your_key_here":
            logger.warning("GROQ_API_KEY not configured. Groq features will be unavailable.")
            self.api_key = None

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
