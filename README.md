# Animated Frontend Dashboard

This repository contains a stand-alone, animated dashboard for visualizing MongoDB data, focusing on events/alerts and associated images from GridFS. It features a FastAPI backend for read-only data access and a Next.js frontend for a rich, interactive user experience.

This project was built by Jules, an AI software engineer.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Local Docker Setup (Recommended)](#1-local-docker-setup-recommended)
  - [2. Manual Local Setup](#2-manual-local-setup)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

---

## Project Overview

*(This section will be filled in with more detail, including screenshots and GIFs of the final product.)*

## Architecture

- **Backend**: Python `FastAPI` server providing a read-only API over the MongoDB database. It uses `motor` for async database access and `Pydantic` for data validation.
- **Frontend**: `Next.js` (App Router) with `TypeScript`, styled with `Tailwind CSS` and `shadcn/ui`. Animations are powered by `Framer Motion` and data fetching is managed by `TanStack Query`.
- **DevOps**: The entire application is containerized using `Docker` and orchestrated with `Docker Compose` for easy local development.

## Features

*(A detailed list of UI/UX features, filtering capabilities, and other functionalities will be added here.)*

## Getting Started

*(This section will be fully detailed once the project is complete.)*

### Prerequisites

- Docker and Docker Compose
- Node.js and npm/yarn/pnpm (for manual setup)
- Python (for manual setup)
- Access to a MongoDB instance

### 1. Local Docker Setup (Recommended)

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Create your environment file:**
    ```bash
    cp .env.example .env
    ```
3.  **Edit `.env`** with your `MONGO_URI` and `MONGO_DB` details.
4.  **Build and run the containers:**
    ```bash
    docker-compose up --build
    ```
5.  Access the frontend at `http://localhost:3000` and the API at `http://localhost:8000`.

### 2. Manual Local Setup

*(Instructions for running the API and web apps directly on the host machine will be provided.)*

## Project Structure

```
.
├── api/                # FastAPI backend source
├── web/                # Next.js frontend source
├── .env.example        # Template for environment variables
├── docker-compose.yml  # Docker orchestration file
└── README.md           # This file
```

## API Endpoints

The OpenAPI schema is available at `/openapi.json` on the running API server. A static copy will also be committed to the `api/` directory.

*(Key endpoints will be listed here.)*

## Environment Variables

All necessary environment variables are documented in the `.env.example` file.
