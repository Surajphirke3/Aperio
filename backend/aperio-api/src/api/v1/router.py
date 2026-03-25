from fastapi import APIRouter

from src.api.v1.chat.routes import router as chat_router
from src.api.v1.batches.routes import router as batches_router
from src.api.v1.stats.routes import router as stats_router
from src.api.v1.insights.routes import router as insights_router
from src.api.v1.vendors.routes import router as vendors_router

v1_router = APIRouter()

v1_router.include_router(chat_router)
v1_router.include_router(batches_router)
v1_router.include_router(stats_router)
v1_router.include_router(insights_router)
v1_router.include_router(vendors_router)