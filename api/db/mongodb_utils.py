from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from loguru import logger
from api.db.mongodb import db
from api.core.config import settings

async def connect_to_mongo():
    """
    Establishes a connection to the MongoDB database and initializes the GridFS bucket.
    This function is called on application startup.
    """
    logger.info("Connecting to MongoDB...")
    try:
        db.client = AsyncIOMotorClient(
            settings.MONGO_URI,
            # Improve connection stability and performance
            maxPoolSize=20,
            minPoolSize=10,
            # Set a timeout for server selection to avoid long waits
            serverSelectionTimeoutMS=5000
        )
        # Ping the server to confirm a successful connection
        await db.client.admin.command('ping')

        db.db = db.client[settings.MONGO_DB]
        db.fs = AsyncIOMotorGridFSBucket(db.db, bucket_name=settings.GRIDFS_BUCKET_NAME)

        # Assign collection objects to the db session object
        # TODO: Add auto-detection logic here if required by the spec.
        # For now, we use the names from the settings.
        db.alerts_collection = db.db[settings.ALERTS_COLLECTION_NAME]

        logger.info("Successfully connected to MongoDB.")

        # Ensure database indexes are created
        await create_indexes()

    except Exception as e:
        logger.error(f"Failed to connect to MongoDB. Error: {e}")
        # The application should not start if the database connection fails.
        raise

async def close_mongo_connection():
    """
    Closes the MongoDB connection. This is called on application shutdown.
    """
    logger.info("Closing MongoDB connection...")
    if db.client:
        db.client.close()
    logger.info("MongoDB connection closed.")

async def create_indexes():
    """
    Create necessary indexes on collections if they don't exist.
    This is an idempotent operation.
    """
    logger.info("Ensuring database indexes are created...")
    try:
        # Indexes for the 'alerts' collection for efficient querying
        await db.alerts_collection.create_index([("time", -1)])
        await db.alerts_collection.create_index([("level", 1)])
        await db.alerts_collection.create_index([("camera_id", 1)])
        await db.alerts_collection.create_index([("person_id", 1)])
        
        # Check if image_id index already exists before creating
        existing_indexes = await db.alerts_collection.list_indexes().to_list(length=None)
        index_names = [idx.get('name') for idx in existing_indexes]
        
        if "image_id_1" not in index_names:
            # Index for image_id, without enforcing uniqueness as there might be duplicate references
            await db.alerts_collection.create_index([("image_id", 1)], sparse=True)
        
        # Text index for message search
        await db.alerts_collection.create_index([("message", "text")])

        # Index for the GridFS files collection to quickly find images by their custom ID
        fs_files_collection = db.db[f"{settings.GRIDFS_BUCKET_NAME}.files"]
        
        # Check if GridFS index exists
        gridfs_indexes = await fs_files_collection.list_indexes().to_list(length=None)
        gridfs_index_names = [idx.get('name') for idx in gridfs_indexes]
        
        if "metadata.image_id_1" not in gridfs_index_names:
            await fs_files_collection.create_index([("metadata.image_id", 1)], unique=True, sparse=True)

        logger.info("Database indexes are in place.")
    except Exception as e:
        logger.error(f"An error occurred while creating indexes: {e}")
        # Continue without raising to allow the server to start
        logger.warning("Continuing without creating indexes...")
