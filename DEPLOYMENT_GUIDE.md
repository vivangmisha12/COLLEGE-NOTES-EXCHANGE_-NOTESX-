# College Notes Exchange - Deployment Guide

Your project uses this architecture:
```
Frontend (Netlify)
    ↓
Backend (Render – Node + Express)
    ↓
MySQL (Cloud DB) ← metadata
    ↓
Cloudinary ← actual PDF files
```

---

## 🚀 Step 1: Deploy Backend to Render

### 1.1 Prepare Your Code
1. Push your code to GitHub (already done ✅)
2. Make sure `.env` is in `.gitignore` ✅
3. Backend is ready with MySQL integration

### 1.2 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**

### 1.3 Connect GitHub Repository
1. Select your repository: `COLLEGE-NOTES-EXCHANGE_-NOTESX-`
2. Select branch: `main`
3. Name: `college-notes-api`
4. Runtime: `Node`
5. Build Command: `npm install`
6. Start Command: `npm start` or `node src/server.js`

### 1.4 Add Environment Variables in Render
In Render Dashboard → Your Service → **Environment**:

```env
NODE_ENV=production
PORT=5000
DB_HOST=your_aiven_mysql_host
DB_USER=avnadmin
DB_PASSWORD=your_aiven_password
DB_NAME=defaultdb
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRY=1d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 1.5 Deploy
- Click **Deploy**
- Wait for build to complete
- Copy your backend URL: `https://college-notes-api.onrender.com`

---

## 🌐 Step 2: Configure Aiven MySQL Database

### 2.1 Get Connection Details from Aiven
1. Go to [aiven.io](https://aiven.io)
2. Select your MySQL service
3. Copy connection details:
   - **Host**: `mysql-xxxxx.k.aivencloud.com`
   - **User**: `avnadmin`
   - **Password**: Your password
   - **Database**: `defaultdb` or your DB name
   - **Port**: 3306

### 2.2 Import Database Schema
From your local machine:
```bash
mysql -h your_host -u avnadmin -p defaultdb < backend/college_notes.sql
```

Or use Aiven's built-in SQL editor to run [setup-db.sql](backend/setup-db.sql)

### 2.3 Update Render Environment Variables
Add the Aiven credentials to Render (Step 1.4)

---

## ☁️ Step 3: Setup Cloudinary for PDF Storage

### 3.1 Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free tier available)
3. Go to Dashboard → **Settings**
4. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3.2 Add to Render Environment Variables
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3.3 Update Backend Code (if needed)
Your `fileUpload.js` should use Cloudinary:
```javascript
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

---

## 🎨 Step 4: Deploy Frontend to Netlify

### 4.1 Prepare Frontend
1. Update `frontend/.env.example` with production URL
2. Create `frontend/.env.local`:
```env
VITE_API_BASE_URL=https://college-notes-api.onrender.com/api
VITE_FILE_BASE_URL=https://college-notes-api.onrender.com
```

### 4.2 Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select GitHub → Your repository
4. Build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### 4.3 Add Environment Variables in Netlify
Dashboard → **Site Settings** → **Build & Deploy** → **Environment**:
```env
VITE_API_BASE_URL=https://college-notes-api.onrender.com/api
VITE_FILE_BASE_URL=https://college-notes-api.onrender.com
```

### 4.4 Deploy
- Click **Deploy**
- Your frontend will be live at: `https://your-site-name.netlify.app`

---

## 🔐 Security Checklist

- ✅ `.env` is in `.gitignore`
- ✅ Secrets stored only in platform environments (Render, Netlify)
- ✅ `.env.example` has placeholder values (safe to commit)
- ✅ Database password in Aiven (encrypted)
- ✅ Cloudinary API keys secured
- ✅ JWT secret unique and strong
- ✅ CORS configured for your frontend URL

---

## 📊 Data Flow After Deployment

```
1. User uploads PDF on frontend (Netlify)
   ↓
2. Request sent to backend (Render)
   ↓
3. Backend uploads PDF to Cloudinary (storage)
   ↓
4. Backend saves metadata (URL, title) to MySQL (Aiven)
   ↓
5. Response returned with file URL
   ↓
6. Frontend displays note with Cloudinary link
```

---

## 🧪 Test Deployment

### Test Backend
```bash
curl https://college-notes-api.onrender.com/
# Should return: "College Notes Exchange API is running"
```

### Test Login
```bash
curl -X POST https://college-notes-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@college.edu",
    "password": "admin123"
  }'
```

### Test Frontend
Visit: `https://your-site-name.netlify.app`
- Register as new user
- Login
- Upload a note
- Verify it appears in dashboard

---

## 🐛 Troubleshooting

### Backend not starting
- Check logs in Render Dashboard
- Verify all ENV variables are set
- Check database connection: `npm run test` locally

### Frontend can't connect to backend
- Check VITE_API_BASE_URL in Netlify env vars
- Verify backend CORS settings include Netlify domain
- Check browser console for errors

### PDF upload fails
- Verify Cloudinary credentials
- Check file size limits
- Verify storage permissions

### Database connection fails
- Test Aiven connection locally
- Verify firewall rules allow Render IP
- Check credentials in Render ENV variables

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Aiven Docs**: https://aiven.io/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

**Deployment Status**: ✅ Ready to Deploy!
