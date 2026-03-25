from functools import lru_cache
from fastapi import Depends
from sqlalchemy.orm import Session

from src.infrastructure.database.connection import get_db_session
from src.infrastructure.adapters.ai.factory import get_ai_adapter
from src.infrastructure.repositories.batch_repository import BatchRepository
from src.infrastructure.repositories.vendor_repository import VendorRepository
from src.domain.chat.services import ChatService
from src.domain.insights.services import InsightService


def get_batch_repository(
    db: Session = Depends(get_db_session),
) -> BatchRepository:
    return BatchRepository(db)


def get_chat_service(
    batch_repo: BatchRepository = Depends(get_batch_repository),
) -> ChatService:
    ai_adapter = get_ai_adapter()
    return ChatService(ai_adapter=ai_adapter, batch_repo=batch_repo)


def get_insight_service(
    batch_repo: BatchRepository = Depends(get_batch_repository),
) -> InsightService:
    ai_adapter = get_ai_adapter()
    return InsightService(ai_adapter=ai_adapter, batch_repo=batch_repo)
