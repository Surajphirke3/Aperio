from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from src.config.settings import settings

_client: AsyncIOMotorClient | None = None


async def init_mongo() -> None:
    global _client
    _client = AsyncIOMotorClient(settings.mongodb_url)


async def close_mongo() -> None:
    if _client:
        _client.close()


def get_db() -> AsyncIOMotorDatabase:
    return _client[settings.mongodb_db_name]


def entries_col():
    return get_db()["material_entries"]


def batches_col():
    return get_db()["batches"]


def vendors_col():
    return get_db()["vendors"]


def sessions_col():
    return get_db()["chat_sessions"]
