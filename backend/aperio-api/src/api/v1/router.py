from fastapi import APIRouter
from .chat.routes import router as chat_router
from .batches.routes import router as batches_router
from .stats.routes import router as stats_router
from .vendors.routes import router as vendors_router
from .insights.routes import router as insights_router
from .carbon.routes import router as carbon_router

v1_router = APIRouter()

v1_router.include_router(chat_router)
v1_router.include_router(batches_router)
v1_router.include_router(stats_router)
v1_router.include_router(vendors_router)
v1_router.include_router(insights_router)
v1_router.include_router(carbon_router)
