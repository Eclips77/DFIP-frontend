import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from api.core.config import settings
from api.db.mongodb import get_db
from api.db.mongodb_utils import connect_to_mongo, close_mongo_connection
from api.routers import alerts, images, stats, people, cameras

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    The lifespan context manager for the application.
    It connects to the database on startup and closes the connection on shutdown.
    """
    logger.info("Starting up API server...")
    await connect_to_mongo()
    yield
    logger.info("Shutting down API server...")
    await close_mongo_connection()

# --- App Initialization ---
app = FastAPI(
    title="Animated Dashboard API",
    description="API for fetching alerts and images from MongoDB for the animated dashboard.",
    version="1.0.0",
    lifespan=lifespan,
    # Generate operation IDs that are function names, for cleaner client code generation
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# --- CORS Configuration ---
# Parse the comma-separated string from settings into a list of origins
allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET"], # Only allow GET requests for this read-only service
    allow_headers=["*"],
)

# --- API Routers ---
# Include the routers for different parts of the API
app.include_router(alerts.router, prefix="/api/v1", tags=["Alerts"])
app.include_router(images.router, prefix="/api/v1", tags=["Images"])
app.include_router(stats.router, prefix="/api/v1", tags=["Stats"])
app.include_router(people.router, prefix="/api/v1", tags=["People"])
app.include_router(cameras.router, prefix="/api/v1", tags=["Cameras"])

# --- Root Endpoint ---
@app.get("/")
def read_root():
    """A simple endpoint to confirm the API is running."""
    return {"status": "ok", "message": "Welcome to the Animated Dashboard API!"}

@app.get("/health")
async def health_check(db_session=Depends(get_db)):
    """
    Health check endpoint for monitoring and deployment verification.
    It checks the database connection and returns the status.
    """
    try:
        # The 'ping' command is cheap and does not require auth.
        await db_session.client.admin.command('ping')
        return {"status": "healthy", "service": "DFIP API", "db": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: database connection error: {e}")
        raise HTTPException(
            status_code=503,
            detail="database connection failed"
        )

@app.get("/api/v1")
def read_api_root():
    """A simple endpoint to confirm the API is running."""
    return {"status": "ok", "message": "Welcome to the Animated Dashboard API!"}
