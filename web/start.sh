#!/bin/bash

# Frontend Start Script for Render
echo "Starting DFIP Frontend on Render..."

# Navigate to the web directory
cd /opt/render/project/src/web

# Install dependencies if they're not present
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi

# Build the application
echo "Building the application..."
npm run build

# Start the Next.js application
echo "Starting the application..."
exec npm start