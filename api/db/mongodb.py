from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorGridFSBucket
from api.core.config import settings

class MongoDBSession:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None
    fs: AsyncIOMotorGridFSBucket = None
    alerts_collection = None
    files_collection = None

# This object will be imported and used by other parts of the application
db = MongoDBSession()

async def get_db() -> MongoDBSession:
    """FastAPI dependency to get the database session."""
    return db
