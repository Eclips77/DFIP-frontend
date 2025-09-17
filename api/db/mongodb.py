from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorGridFSBucket
from typing import Optional
from api.core.config import settings
class MongoDBSession:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    fs: Optional[AsyncIOMotorGridFSBucket] = None
    alerts_collection = settings.ALERTS_COLLECTION_NAME
    files_collection = settings.GRIDFS_BUCKET_NAME
    files_collection = settings.GRIDFS_BUCKET_NAME + ".files"

# This object will be imported and used by other parts of the application
db = MongoDBSession()

async def get_db() -> MongoDBSession:
    """FastAPI dependency to get the database session."""
    return db
