# Manual Render Deployment Guide

If the Blueprint deployment fails, use this manual deployment guide:

## API Service (dfip-api)

### 1. Create New Web Service
- **Type**: Web Service
- **Name**: dfip-api
- **Runtime**: Python 3
- **Repository**: https://github.com/Eclips77/DFIP-frontend
- **Branch**: main

### 2. Build & Start Commands
```bash
# Build Command
pip install -r api/requirements.txt

# Start Command
cd api && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 3. Environment Variables
```
MONGO_URI=mongodb+srv://arieltanami122_db_user:OHod6QgGER7wp09F@facedb.k2ycus.mongodb.net/?retryWrites=true&w=majority&appName=facedb
MONGO_DB=face_identity
ALLOWED_ORIGINS=https://dfip-frontend.onrender.com
ALERTS_COLLECTION_NAME=Event
GRIDFS_BUCKET_NAME=Photo_storage
NODE_ENV=production
```

### 4. Advanced Settings
- **Health Check Path**: `/health`
- **Auto-Deploy**: Yes

---

## Frontend Service (dfip-frontend)

### 1. Create New Web Service
- **Type**: Web Service
- **Name**: dfip-frontend
- **Runtime**: Node
- **Repository**: https://github.com/Eclips77/DFIP-frontend
- **Branch**: main

### 2. Build & Start Commands
```bash
# Build Command
cd web && npm install && npm run build

# Start Command
cd web && npm start
```

### 3. Environment Variables
```
NEXT_PUBLIC_API_URL=https://dfip-api.onrender.com
NODE_ENV=production
```

### 4. Advanced Settings
- **Health Check Path**: `/api/health`
- **Auto-Deploy**: Yes

---

## Important Notes

1. **Deploy API First**: Create and deploy the API service before the frontend
2. **Update CORS**: After API is deployed, update the ALLOWED_ORIGINS with the actual frontend URL
3. **Update Frontend**: After frontend is deployed, update the NEXT_PUBLIC_API_URL if needed
4. **Monitor Logs**: Check deployment logs for any issues

## Troubleshooting

### Common Issues:
1. **Path not found**: Make sure build commands start from root directory
2. **Dependencies**: Ensure all dependencies are in requirements.txt/package.json
3. **Environment Variables**: Double-check all required env vars are set
4. **CORS**: Make sure frontend domain is in ALLOWED_ORIGINS

### Health Check URLs:
- API: `https://dfip-api.onrender.com/health`
- Frontend: `https://dfip-frontend.onrender.com/api/health`