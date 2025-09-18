# 🔧 בדיקת API עם Postman - נקודות קצה לבדיקה

## 📍 Base URLs לבדיקה

### לוקלי (Development)
```
http://localhost:8000
```

### פרודקשן (Render)
```
https://dfip-api.onrender.com
```

---

## 🧪 נקודות קצה לבדיקה בPostman

### 1. 💓 בדיקת חיות השירות
```http
GET /health
```
**מטרה**: וידוא שהשירות רץ
**תגובה צפויה**:
```json
{
  "status": "healthy",
  "service": "DFIP Dashboard API"
}
```

### 2. 🏠 נקודת קצה ראשית
```http
GET /api/v1
```
**מטרה**: בדיקה בסיסית של API
**תגובה צפויה**:
```json
{
  "status": "ok",
  "message": "Welcome to the DFIP Dashboard API!"
}
```

---

## 📊 בדיקת חיבור למסד נתונים

### 3. 📈 סטטיסטיקות כלליות
```http
GET /api/v1/stats
```
**מטרה**: בדיקת חיבור למונגו + נתונים כלליים
**תגובה צפויה**:
```json
{
  "total_alerts": 150,
  "alerts_24h": 12,
  "distinct_people": 45,
  "active_cameras": 8
}
```
**❗ אם יש שגיאה כאן = בעיה בחיבור למונגו**

### 4. 🚨 רשימת התראות
```http
GET /api/v1/alerts
```
**Parameters (Query String)**:
- `page=1`
- `page_size=10`

**דוגמה מלאה**:
```
GET /api/v1/alerts?page=1&page_size=10
```

**תגובה צפויה**:
```json
{
  "items": [
    {
      "id": "507f1f77bcf86cd799439011",
      "message": "Person detected",
      "level": "alert",
      "timestamp": "2025-09-18T10:30:00Z",
      "camera_id": "Camera_1",
      "person_id": "person_123",
      "image_id": "507f1f77bcf86cd799439012"
    }
  ],
  "total": 150,
  "page": 1,
  "page_size": 10,
  "total_pages": 15
}
```

### 5. 👥 רשימת אנשים
```http
GET /api/v1/people
```
**תגובה צפויה**:
```json
{
  "items": [
    {
      "person_id": "person_123",
      "first_seen": "2025-09-01T08:00:00Z",
      "last_seen": "2025-09-18T10:30:00Z",
      "total_appearances": 25,
      "cameras": ["Camera_1", "Camera_2"],
      "latest_image_id": "507f1f77bcf86cd799439012"
    }
  ],
  "total": 45
}
```

### 6. 📷 רשימת מצלמות
```http
GET /api/v1/cameras
```
**תגובה צפויה**:
```json
{
  "items": [
    {
      "camera_id": "Camera_1",
      "total_alerts": 89,
      "alerts_24h": 5,
      "distinct_people": 12,
      "last_alert": "2025-09-18T10:30:00Z",
      "status": "active"
    }
  ],
  "total": 8
}
```

### 7. 🖼️ בדיקת תמונה ספציפית
```http
GET /api/v1/images/{image_id}
```
**דוגמה**:
```
GET /api/v1/images/507f1f77bcf86cd799439012
```
**תגובה צפויה**: תמונה בפורמט binary או metadata

---

## 🔍 בדיקות מתקדמות עם פילטרים

### 8. 🚨 התראות לפי רמה
```http
GET /api/v1/alerts?level=alert&page=1&page_size=5
```

### 9. 🔍 חיפוש התראות לפי הודעה
```http
GET /api/v1/alerts?message_search=person&page=1&page_size=5
```

### 10. 👤 אנשים לפי מצלמה
```http
GET /api/v1/people/camera/{camera_id}
```
**דוגמה**:
```
GET /api/v1/people/camera/Camera_1
```

---

## 🛠️ הגדרת Postman Collection

### צעדים להגדרה:
1. **פתח Postman**
2. **צור Collection חדש**: "DFIP API Tests"
3. **הוסף Environment Variables**:
   - `base_url_local`: `http://localhost:8000`
   - `base_url_prod`: `https://dfip-api.onrender.com`

### 📝 Templates לPostman

#### Environment Variables
```json
{
  "id": "dfip-api-env",
  "name": "DFIP API Environment",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:8000",
      "enabled": true
    },
    {
      "key": "base_url_prod",
      "value": "https://dfip-api.onrender.com", 
      "enabled": true
    }
  ]
}
```

#### Basic Request Template
```
Method: GET
URL: {{base_url}}/api/v1/stats
Headers: 
- Content-Type: application/json
```

---

## 🚨 מה לחפש בתגובות

### ✅ תגובות תקינות:
- **Status Code**: 200 OK
- **Content-Type**: application/json
- **Data**: מכיל נתונים אמיתיים (לא ריק)

### ❌ תגובות שמעידות על בעיות:

#### בעיית חיבור למונגו:
```json
{
  "detail": "Could not connect to MongoDB"
}
```
**Status Code**: 500

#### אוסף ריק (אין נתונים):
```json
{
  "items": [],
  "total": 0
}
```
**Status Code**: 200 (אבל אין נתונים)

#### שגיאת אימות:
```json
{
  "detail": "Invalid ObjectId format"
}
```
**Status Code**: 422

#### שירות לא זמין:
```
Could not connect / Timeout
```

---

## 🎯 רצף בדיקה מומלץ

### שלב 1: בדיקות בסיסיות
1. ✅ `GET /health`
2. ✅ `GET /api/v1`

### שלב 2: בדיקת חיבור למונגו
3. ✅ `GET /api/v1/stats`

### שלב 3: בדיקת נתונים
4. ✅ `GET /api/v1/alerts?page=1&page_size=5`
5. ✅ `GET /api/v1/people`
6. ✅ `GET /api/v1/cameras`

### שלב 4: בדיקות מתקדמות
7. ✅ פילטרים ופרמטרים שונים

---

## 🔧 טיפים לבדיקה

### משתני סביבה בPostman:
- השתמש ב-`{{base_url}}` במקום כתובת קבועה
- החלף בין local ו-production בקלות

### Headers מומלצים:
```
Content-Type: application/json
Accept: application/json
```

### מה לבדוק בכל request:
1. **Response Time** - אמור להיות מתחת ל-2 שניות
2. **Status Code** - 200 לרוב הבקשות
3. **Response Size** - לא אמור להיות ריק
4. **JSON Structure** - תקין ומכיל את השדות הצפויים

---

## 🆘 פתרון בעיות נפוצות

### בעיה: "Connection Refused"
**פתרון**: 
- בדוק שהשירות רץ (`python -m uvicorn main:app --reload`)
- בדוק שהכתובת נכונה

### בעיה: "MongoDB Connection Failed"
**פתרון**:
- בדוק את `MONGO_URI` במשתני הסביבה
- בדוק חיבור אינטרנט

### בעיה: "Empty Response" / "No Data"
**פתרון**:
- בדוק שיש נתונים בקולקציות במונגו
- בדוק שהשמות של הקולקציות נכונים

**בהצלחה בבדיקות! 🚀**