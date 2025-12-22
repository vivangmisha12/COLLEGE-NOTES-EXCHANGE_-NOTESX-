# CORS Fix - Deployment Instructions 🚀

## Problem
Your production frontend (Netlify) is getting CORS errors when trying to upload files to your backend (Render).

## Solution
I've fixed the CORS configuration in the backend. Now you need to **redeploy the backend** to Render for changes to take effect.

---

## Step 1: Deploy Backend to Render ⚙️

Since you've committed the changes, Render should auto-deploy. But if it doesn't:

### Option A: Auto-Deploy (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service: `college-notes-exchange-notesx-2`
3. Check if it's already deploying (you should see a deployment in progress)
4. Wait for deployment to complete ✅

### Option B: Manual Deploy
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait 2-3 minutes for deployment to complete

---

## Step 2: Configure Frontend Environment Variables 🔐

Check your Netlify environment variables. You need:

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: `collegenotesexchange`
3. Click **Site Settings** → **Build & Deploy** → **Environment**
4. Add these environment variables (if not already there):

```
VITE_API_BASE_URL=https://college-notes-exchange-notesx-2.onrender.com/api
VITE_FILE_BASE_URL=https://college-notes-exchange-notesx-2.onrender.com
```

5. **Redeploy your frontend**:
   - Click **Deploys** → **Trigger Deploy** → **Deploy site**
   - Wait for deployment to complete

---

## Step 3: Test the Upload 🧪

1. Go to `https://collegenotesexchange.netlify.app`
2. Login with your credentials
3. Go to **Upload Notes** page
4. Try uploading a PDF file
5. You should NOT see CORS errors anymore ✅

---

## What Was Fixed ✨

### Backend Changes:
- ✅ Added your Netlify domain to allowed origins
- ✅ Added explicit OPTIONS method for preflight requests
- ✅ Added `app.options('*', cors())` for all routes
- ✅ Added `maxAge: 3600` to cache preflight responses

### Frontend Changes:
- ✅ Updated `.env.example` with correct production URLs

---

## CORS Configuration Details 📋

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://collegenotesexchange.netlify.app",  // ✅ Your Netlify frontend
      "https://college-notes-exchange-notesx-2.onrender.com"
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600
};
```

---

## If You Still Get Errors 🔧

### Check Browser Console:
1. Open DevTools (F12)
2. Go to **Console** tab
3. Try uploading again
4. Look for error messages

### Common Issues:

**Error: "No 'Access-Control-Allow-Origin' header"**
- Backend deployment not complete yet
- Wait 2-3 minutes and try again

**Error: "404 Not Found"**
- Check API URL is correct
- Make sure Render backend is running

**Error: "net::ERR_FAILED"**
- Backend might be down
- Check Render dashboard status

---

## Verification Checklist ✅

- [ ] Backend deployed to Render
- [ ] Frontend environment variables set
- [ ] Frontend redeployed to Netlify
- [ ] Can successfully upload a PDF file
- [ ] No CORS errors in console

---

## Questions?
Check the backend logs on Render for any errors!
