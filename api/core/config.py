import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    """
    Application settings, loaded from environment variables.
    """
    # --- MongoDB Configuration ---
    MONGO_URI: str = "mongodb+srv://arieltanami122_db_user:OHod6QgGER7wp09F@facedb.k2ycus.mongodb.net/?retryWrites=true&w=majority&appName=facedb"
    MONGO_DB: str = "face_identity"

    # --- API Server Configuration ---
    API_PORT: int = 8000
    # A comma-separated string of allowed origins, e.g., "http://localhost:3000,https://my-app.com"
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    # --- Collection & Bucket Names ---
    # Allows overriding collection names if they differ from the defaults.
    ALERTS_COLLECTION_NAME: str = "Event"
    GRIDFS_BUCKET_NAME: str = "Photo_starage"

    # Pydantic settings configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8',
        extra='ignore' # Ignore extra fields from .env
    )

# Instantiate the settings object that will be used across the application
settings = Settings()
