import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from loguru import logger

from api.core.config import settings
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
    title="DFIP Dashboard API",
    description="API for fetching alerts and images from MongoDB for the DFIP dashboard.",
    version="1.0.0",
    lifespan=lifespan,
    # Generate operation IDs that are function names, for cleaner client code generation
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/docs" if os.getenv("NODE_ENV") != "production" else None,
    redoc_url="/api/redoc" if os.getenv("NODE_ENV") != "production" else None,
)

# --- Security Middleware ---
# Trust only specific hosts in production
if os.getenv("NODE_ENV") == "production":
    app.add_middleware(
        TrustedHostMiddleware, 
        allowed_hosts=["dfip-api.onrender.com", "*.onrender.com"]
    )

# --- CORS Configuration ---
# Parse the comma-separated string from settings into a list of origins
allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(',')]

# Add wildcard for development and specific domains for production
if os.getenv("NODE_ENV") != "production":
    allowed_origins.extend(["http://localhost:3000", "http://127.0.0.1:3000"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"], # Allow OPTIONS for preflight requests
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
@app.get("/api/v1")
def read_root():
    """A simple endpoint to confirm the API is running."""
    return {"status": "ok", "message": "Welcome to the DFIP Dashboard API!"}

# --- Health Endpoint ---
@app.get("/health")
def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "service": "DFIP Dashboard API"}
