# DFIP Dashboard - Deployment Guide

## 🚀 Deployment on Render

This guide will help you deploy the DFIP Dashboard to Render cloud platform.

### Prerequisites

1. GitHub repository with your code
2. Render account (free tier available)
3. MongoDB Atlas database (already configured)

### 📋 Deployment Steps

#### Option 1: Using render.yaml (Recommended)

1. **Fork or Clone the Repository**
   ```bash
   git clone https://github.com/Eclips77/DFIP-frontend.git
   cd DFIP-frontend
   ```

2. **Update Environment Variables**
   - Copy `.env.example` to `.env` for local development
   - Update the frontend domain in `.env.production`

3. **Deploy to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically read `render.yaml` and create both services

#### Option 2: Manual Service Creation

##### API Service (FastAPI)
1. Create new "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name**: `dfip-api`
   - **Runtime**: `Python 3`
   - **Build Command**: `cd api && pip install -r requirements.txt`
   - **Start Command**: `cd api && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path**: `/health`

##### Frontend Service (Next.js)
1. Create new "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name**: `dfip-frontend`
   - **Runtime**: `Node`
   - **Build Command**: `cd web && npm ci && npm run build`
   - **Start Command**: `cd web && npm start`
   - **Health Check Path**: `/api/health`

### 🔧 Environment Variables

#### API Service Environment Variables
```
MONGO_URI=mongodb+srv://arieltanami122_db_user:OHod6QgGER7wp09F@facedb.k2ycus.mongodb.net/?retryWrites=true&w=majority&appName=facedb
MONGO_DB=face_identity
ALLOWED_ORIGINS=https://dfip-frontend.onrender.com
ALERTS_COLLECTION_NAME=Event
GRIDFS_BUCKET_NAME=Photo_storage
NODE_ENV=production
```

#### Frontend Service Environment Variables
```
NEXT_PUBLIC_API_URL=https://dfip-api.onrender.com
NODE_ENV=production
```

### 📝 Important Notes

1. **Custom Domains**: Update the domains in `render.yaml` and environment variables to match your actual Render service URLs
2. **Database**: The app uses MongoDB Atlas - make sure your connection string is correct
3. **CORS**: The API is configured to allow requests from the frontend domain
4. **Health Checks**: Both services include health check endpoints for monitoring

### 🔍 Monitoring

- API Health: `https://your-api-domain.onrender.com/health`
- Frontend Health: `https://your-frontend-domain.onrender.com/api/health`
- API Documentation: `https://your-api-domain.onrender.com/api/docs` (disabled in production)

### 🛠 Local Development

1. **Prerequisites**
   ```bash
   # Install Node.js 18+
   # Install Python 3.11+
   ```

2. **Setup**
   ```bash
   # Clone repository
   git clone https://github.com/Eclips77/DFIP-frontend.git
   cd DFIP-frontend

   # Copy environment file
   cp .env.example .env

   # Start with Docker Compose
   docker-compose up --build

   # Or start manually
   # Terminal 1 - API
   cd api
   pip install -r requirements.txt
   uvicorn main:app --reload

   # Terminal 2 - Frontend
   cd web
   npm install
   npm run dev
   ```

3. **Access**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000
   - API Docs: http://localhost:8000/api/docs

### 📁 Project Structure

```
DFIP-frontend/
├── api/                    # FastAPI Backend
│   ├── core/              # Configuration
│   ├── db/                # Database utilities
│   ├── models/            # Pydantic models
│   ├── routers/           # API endpoints
│   ├── Dockerfile         # API container
│   └── requirements.txt   # Python dependencies
├── web/                   # Next.js Frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   ├── Dockerfile         # Frontend container
│   └── package.json       # Node dependencies
├── docker-compose.yml     # Local development
├── render.yaml           # Render deployment config
└── .env.example          # Environment template
```

### 🚨 Troubleshooting

#### Common Issues

1. **Build Failures**
   - Check that paths in build commands are correct
   - Verify all dependencies are listed in requirements.txt/package.json

2. **CORS Errors**
   - Ensure frontend domain is added to `ALLOWED_ORIGINS`
   - Check that API URL is correct in frontend environment

3. **Database Connection**
   - Verify MongoDB connection string
   - Check if IP whitelist includes Render's IPs (0.0.0.0/0 for all)

4. **Health Check Failures**
   - Ensure health endpoints return 200 status
   - Check if services are binding to correct ports

#### Logs and Debugging

- View logs in Render dashboard under each service
- Use health check endpoints to verify service status
- Check environment variables are set correctly

### 📈 Performance Optimization

1. **Caching**: The frontend includes React Query with localStorage persistence
2. **Images**: Optimized with Next.js Image component
3. **Security**: CORS, trusted hosts, and security headers configured
4. **Health Monitoring**: Both services include health check endpoints

### 📞 Support

For issues related to:
- **Render Platform**: [Render Documentation](https://render.com/docs)
- **MongoDB Atlas**: [MongoDB Documentation](https://docs.atlas.mongodb.com/)
- **Application Issues**: Check the GitHub repository issues

---

🎉 **Your DFIP Dashboard should now be live on Render!**