# 🛠️ Production Debugging Guide

## Debug Steps for Data Loading Issues

### 1. Check Environment Variables
In your Render dashboard, verify these environment variables are set correctly:

**For API Service (dfip-api):**
- `ALLOWED_ORIGINS` = `https://dfip-app1.onrender.com,https://dfip-frontend.onrender.com`
- `MONGO_URI` = `mongodb+srv://arieltanami122_db_user:OHod6QgGER7wp09F@facedb.k2ycus.mongodb.net/?retryWrites=true&w=majority&appName=facedb`
- `NODE_ENV` = `production`

**For Frontend Service (dfip-app1):**
- `NEXT_PUBLIC_API_URL` = `https://dfip-api.onrender.com`
- `NODE_ENV` = `production`

### 2. Test API Endpoints Directly
Open these URLs in your browser to verify API is working:
- https://dfip-api.onrender.com/health
- https://dfip-api.onrender.com/api/v1/stats
- https://dfip-api.onrender.com/api/v1/alerts?page=1&page_size=10

### 3. Check Browser Console
1. Open https://dfip-app1.onrender.com
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for these debug messages:
   - "API Client Configuration" - shows the API URL being used
   - "Making API request" - shows each API call
   - "API response received" or "API response error" - shows results

### 4. Common Issues & Solutions

**Issue: API calls failing with CORS errors**
- Solution: Update ALLOWED_ORIGINS in Render dashboard to include your actual frontend URL

**Issue: API calls going to wrong URL**
- Solution: Check NEXT_PUBLIC_API_URL is set correctly in frontend service

**Issue: No data returned from API**
- Solution: Verify MongoDB connection string and database access

### 5. Emergency Fix Commands

If you need to redeploy with fixes:

```bash
# Commit your changes
git add .
git commit -m "Fix production API connectivity"
git push

# Or trigger manual deploy in Render dashboard
```

### 6. Log Monitoring

Check logs in Render dashboard:
- Go to your service dashboard
- Click "Logs" tab
- Look for error messages during startup or API calls

---

**Current Status:** Added debug logging to identify connectivity issues
**Next Step:** Check environment variables in Render dashboard