import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from src.config.settings import settings

async def test_db():
    print(f"Connecting to: {settings.mongodb_url}")
    client = AsyncIOMotorClient(
        settings.mongodb_url,
        tlsCAFile=certifi.where()
    )
    db = client.get_database("traceflow")
    try:
        count = await db.material_entries.count_documents({})
        print(f"Connection successful. Found {count} documents.")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_db())
