from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class AIResponse:
    content: str
    model: str
    tokens_used: int


class AIAdapter(ABC):
    """Abstract base class for AI providers.
    Both Featherless and Ollama implement this interface.
    Domain services depend on this abstraction, not concrete implementations.
    """

    @abstractmethod
    async def complete(
        self,
        prompt: str,
        system_prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.1,
    ) -> AIResponse:
        """Generate a completion from the LLM."""
        ...

    @abstractmethod
    async def health_check(self) -> bool:
        """Returns True if the provider is reachable."""
        ...
