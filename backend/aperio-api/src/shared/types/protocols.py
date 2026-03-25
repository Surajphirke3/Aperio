from typing import Protocol, runtime_checkable
from dataclasses import dataclass


@dataclass
class AIResponse:
    content: str
    model: str
    tokens_used: int


@runtime_checkable
class AIAdapterProtocol(Protocol):
    async def complete(
        self,
        prompt: str,
        system_prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.1,
    ) -> AIResponse: ...

    async def health_check(self) -> bool: ...


@runtime_checkable
class BatchRepositoryProtocol(Protocol):
    async def create_entry(self, entry: object) -> object: ...
    async def get_batch(self, batch_id: str) -> object: ...
    async def list_batches(self, **filters) -> list: ...
    async def query_stats(self, filters: object) -> dict: ...


@runtime_checkable
class VendorRepositoryProtocol(Protocol):
    async def get_vendor(self, vendor_id: str) -> object: ...
    async def list_vendors(self) -> list: ...
    async def get_scorecard(self, vendor_id: str) -> object: ...
