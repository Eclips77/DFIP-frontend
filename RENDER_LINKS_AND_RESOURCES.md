# 📋 רשימת לינקים ומשאבים לפריסה

## 🔗 לינקים חשובים

### Render Platform
- **Render Dashboard**: https://dashboard.render.com
- **Render Documentation**: https://render.com/docs
- **Render Pricing**: https://render.com/pricing

### GitHub Repository
- **Repository**: https://github.com/Eclips77/DFIP-frontend
- **Current Branch**: fix-stats-gather-bug

## 🎯 URLs שיהיו לך אחרי הפריסה

### API Service
- **Health Check**: https://dfip-api.onrender.com/health
- **API Root**: https://dfip-api.onrender.com/api/v1
- **Stats**: https://dfip-api.onrender.com/api/v1/stats
- **Alerts**: https://dfip-api.onrender.com/api/v1/alerts
- **People**: https://dfip-api.onrender.com/api/v1/people
- **Cameras**: https://dfip-api.onrender.com/api/v1/cameras

### Frontend Service
- **Main Site**: https://dfip-frontend.onrender.com (או dfip-app1.onrender.com)
- **Health Check**: https://dfip-frontend.onrender.com/api/health

## 📊 משתני סביבה - העתק והדבק

### API Service Environment Variables
```
MONGO_URI=mongodb+srv://arieltanami122_db_user:OHod6QgGER7wp09F@facedb.k2ycus.mongodb.net/?retryWrites=true&w=majority&appName=facedb
MONGO_DB=face_identity
ALLOWED_ORIGINS=https://dfip-frontend.onrender.com,https://dfip-app1.onrender.com
ALERTS_COLLECTION_NAME=Event
GRIDFS_BUCKET_NAME=Photo_storage
NODE_ENV=production
```

### Frontend Service Environment Variables
```
NEXT_PUBLIC_API_URL=https://dfip-api.onrender.com
NODE_ENV=production
```

## 🛠️ פקודות Build & Start

### API Service
- **Build Command**: `pip install -r api/requirements.txt`
- **Start Command**: `cd api && python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend Service
- **Build Command**: `cd web && npm install && npm run build`
- **Start Command**: `cd web && npm start`

## 🚨 בדיקות חשובות לפני פריסה

### ✅ Checklist לפני פריסה:
- [ ] הקוד עובד לוקלית (API + Frontend)
- [ ] יש קובץ requirements.txt ב-api/
- [ ] יש package.json ב-web/
- [ ] יש health endpoints בשני השירותים
- [ ] המשתנים ב-.env.production נכונים
- [ ] הכל עלה ל-Git

### 🔍 אחרי פריסה - מה לבדוק:
1. **API Health**: https://dfip-api.onrender.com/health
2. **Frontend Health**: https://dfip-frontend.onrender.com/api/health
3. **Data Loading**: הפרונטאנד טוען נתונים מה-API
4. **Console Logs**: אין שגיאות CORS
5. **MongoDB**: ה-API מתחבר למונגו

## 📱 איך לבדוק שהכל עובד

### Browser Tests
```
1. פתח: https://dfip-frontend.onrender.com
2. לחץ F12 → Console
3. בדוק שאין שגיאות CORS
4. בדוק ש-API calls עובדים
5. בדוק שהדאטה נטענת
```

### Manual API Tests
```
1. GET https://dfip-api.onrender.com/health
   → Should return: {"status": "healthy"}

2. GET https://dfip-api.onrender.com/api/v1/stats
   → Should return: {"totalAlerts": X, "alerts24h": Y, ...}

3. GET https://dfip-api.onrender.com/api/v1/alerts?page=1&page_size=5
   → Should return: {"items": [...], "total": X}
```

## 🆘 אם משהו לא עובד

### Debug Steps:
1. **Check Logs**: Render Dashboard → Service → Logs tab
2. **Check Environment**: Render Dashboard → Service → Environment tab
3. **Check Browser Console**: F12 → Console (בפרונטאנד)
4. **Test API Directly**: פתח בדפדפן את ה-API endpoints
5. **Check Git**: וודא שהקוד האחרון עלה ל-Git

### Common Issues:
- **CORS Error**: עדכן ALLOWED_ORIGINS ב-API
- **404 API Error**: בדוק NEXT_PUBLIC_API_URL בפרונטאנד
- **MongoDB Error**: בדוק MONGO_URI ב-API
- **Build Failed**: בדוק Logs ב-Render Dashboard

**זה הכל! בהצלחה! 🚀**