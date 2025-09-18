from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorGridFSBucket, AsyncIOMotorCollection
from typing import Optional
from api.core.config import settings

class MongoDBSession:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    fs: Optional[AsyncIOMotorGridFSBucket] = None
    alerts_collection: Optional[AsyncIOMotorCollection] = None
    
    # Collection name references (strings)
    alerts_collection_name = settings.ALERTS_COLLECTION_NAME
    gridfs_bucket_name = settings.GRIDFS_BUCKET_NAME

# This object will be imported and used by other parts of the application
db = MongoDBSession()

async def get_db() -> MongoDBSession:
    """FastAPI dependency to get the database session."""
    return db
