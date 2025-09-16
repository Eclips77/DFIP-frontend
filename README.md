# Animated Frontend Dashboard for MongoDB

This repository contains a stand-alone, animated dashboard for visualizing MongoDB data, focusing on events/alerts and associated images from GridFS. It features a FastAPI backend for read-only data access and a Next.js frontend for a rich, interactive user experience.

This project was built by Jules, an AI software engineer.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Live Demo Preview](#live-demo-preview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Local Docker Setup (Recommended)](#1-local-docker-setup-recommended)
  - [2. Manual Local Setup](#2-manual-local-setup)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

---

## Project Overview

This dashboard provides a beautiful and performant interface for exploring event and image data stored in MongoDB. It is designed to be a stand-alone application that connects to an existing MongoDB database in a read-only capacity. The focus is on providing a polished UI with tasteful animations and a clear, intuitive presentation of data.

## Live Demo Preview

*(This section would ideally contain screenshots or GIFs of the running application.)*

**Overview Page:**
![Overview Page Light Mode](placeholder.png)
**Alerts Page with Details Drawer:**
![Alerts Page Dark Mode](placeholder.png)

---

## Features

### General
- **Dark/Light Mode**: Seamless theme switching.
- **Responsive Design**: Works on all screen sizes, from mobile to desktop.
- **Animated UI**: Smooth, tasteful animations powered by Framer Motion.
- **Containerized**: Fully containerized with Docker for easy setup and deployment.

### Overview Page
- **KPI Cards**: Key metrics (Total Alerts, 24h Alerts, etc.) with count-up animations.
- **Time-series Chart**: An interactive, animated chart from Recharts showing alert trends over time.
- **Loading Skeletons**: Polished loading states for a better user experience.

### Alerts Page
- **Infinite Scroll**: The alerts table uses a virtualized, infinite-scrolling mechanism to handle large datasets gracefully.
- **Details Drawer**: Click any alert to open an animated drawer with detailed information and a raw JSON view.
- **Image Preview**: For alerts with an associated image, a button opens a modal lightbox to display the full-resolution image, streamed directly from GridFS.

---

## Architecture

- **Backend**: A Python `FastAPI` server provides a read-only API over the MongoDB database. It uses `motor` for async database access, `Pydantic` for data validation, and `GridFS` for image streaming.
- **Frontend**: A `Next.js` (App Router) application built with `TypeScript`. It is styled with `Tailwind CSS` and `shadcn/ui`. Animations are powered by `Framer Motion` and data fetching is managed by `TanStack Query`.
- **DevOps**: The entire application is containerized using `Docker` and orchestrated with `Docker Compose` for easy, one-command local development.

---

## Getting Started

### Prerequisites

-   **Docker and Docker Compose**: For the recommended setup.
-   **Node.js & npm**: For manual frontend setup.
-   **Python & pip**: For manual backend setup.
-   **Access to a MongoDB instance**: The application needs a database to connect to.

### 1. Local Docker Setup (Recommended)

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Create your environment file:**
    Copy the example environment file to a new `.env` file.
    ```bash
    cp .env.example .env
    ```
3.  **Configure your environment:**
    Edit the `.env` file with your `MONGO_URI` and `MONGO_DB` details.

4.  **Build and run the containers:**
    ```bash
    docker-compose up --build
    ```
    This command will build the Docker images for the API and the web app and start the services.

5.  **Access the application:**
    -   **Frontend:** `http://localhost:3000`
    -   **API Docs:** `http://localhost:8000/api/docs`

### 2. Manual Local Setup

#### Backend (API)
```bash
cd api
pip install -r requirements.txt
cp ../.env.example ../.env
# Edit .env with your MongoDB details
uvicorn main:app --reload
```

#### Frontend (Web)
```bash
cd web
npm install
cp ../.env.example ../.env
# Edit .env with NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

---

## Project Structure

```
.
├── api/                # FastAPI backend source
│   ├── routers/        # API endpoint routers
│   ├── models/         # Pydantic data models
│   ├── core/           # Configuration
│   ├── db/             # Database utilities
│   ├── Dockerfile
│   └── openapi.json    # The generated OpenAPI schema
├── web/                # Next.js frontend source
│   ├── app/            # Next.js App Router pages
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom React Query hooks
│   ├── lib/            # Utility functions and API client
│   └── Dockerfile
├── .env.example        # Template for environment variables
├── docker-compose.yml  # Docker orchestration file
└── README.md           # This file
```

---

## API Endpoints

The full, interactive API documentation is available via Swagger UI when the application is running at `/api/docs`. A static copy of the OpenAPI schema is also located at `api/openapi.json`.

Key endpoints include:
- `GET /api/v1/stats`: Provides aggregated KPI data for the overview page.
- `GET /api/v1/stats/over-time`: Provides time-series data for the overview chart.
- `GET /api/v1/alerts`: Fetches a paginated list of alerts with filtering capabilities.
- `GET /api/v1/images/by-image-id/{image_id}`: Retrieves image metadata.
- `GET /api/v1/images/{file_id}/bytes`: Streams full-resolution image data from GridFS.
- `GET /api/v1/images/{file_id}/thumb`: Streams cached thumbnail data from GridFS.

---

## Environment Variables

All necessary environment variables are documented in the `.env.example` file.

| Variable               | Description                                                              | Service |
| ---------------------- | ------------------------------------------------------------------------ | ------- |
| `MONGO_URI`            | Your full MongoDB connection string.                                     | API     |
| `MONGO_DB`             | The name of the MongoDB database to use.                                 | API     |
| `API_PORT`             | The port the backend server will run on.                                 | API     |
| `ALLOWED_ORIGINS`      | Comma-separated list of origins allowed to access the API.               | API     |
| `NEXT_PUBLIC_API_URL`  | The public URL of the backend API, used by the frontend.                 | Web     |
| `ALERTS_COLLECTION_NAME`| (Optional) The name of the alerts collection. Defaults to `alerts`.      | API     |
| `GRIDFS_BUCKET_NAME`   | (Optional) The name of the GridFS bucket. Defaults to `fs`.              | API     |
