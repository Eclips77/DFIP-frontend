#!/bin/bash

# API Start Script for Render
echo "Starting DFIP API on Render..."

# Set the Python path
export PYTHONPATH=/opt/render/project/src/api

# Navigate to the API directory
cd /opt/render/project/src/api

# Start the FastAPI application
exec uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1