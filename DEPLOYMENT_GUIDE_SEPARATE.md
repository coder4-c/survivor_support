# Separate Deployment Guide

## Strategy: Backend on Render + Frontend on Vercel

This is the **recommended approach** for your project structure and will provide better performance and reliability.

## 📋 Prerequisites

- GitHub repository: `github.com/coder4-c/survivor_support`
- Accounts on both [Render.com](https://render.com) and [Vercel.com](https://vercel.com)

---

## 🚀 Part 1: Backend Deployment on Render

### Step 1: Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Choose **"Build and deploy from a Git repository"**
4. Connect your GitHub repository: `coder4-c/survivor_support`
5. Select the **main** branch

### Step 2: Configure Backend Settings

**Service Name:** `salama-backend`
**Region:** Choose closest to your users
**Branch:** `main`
**Root Directory:** Leave empty (or specify `backend/` if separate)

### Step 3: Environment Configuration

**Runtime:** `Node`
**Build Command:** `npm install`
**Start Command:** `npm start`

### Step 4: Environment Variables

Add these in Render Dashboard → Environment tab:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://your-frontend.vercel.app
```

### Step 5: Deploy

Click **"Create Web Service"** and wait for deployment (3-5 minutes)

**Your Backend URL:** `https://salama-backend.onrender.com`

---

## 🌐 Part 2: Frontend Deployment on Vercel

### Step 1: Update Frontend Configuration

First, update your frontend to point to the Render backend:

**In `frontend-main/src/contexts/AuthContext.jsx` or similar API config:**

```javascript
// Replace localhost URLs with your Render backend URL
const API_BASE_URL = 'https://salama-backend.onrender.com/api';
```

### Step 2: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import from GitHub: Select your repository
4. Configure Project:

**Project Name:** `salama-frontend`
**Framework Preset:** `Vite`
**Root Directory:** `frontend-main`
**Build Command:** `npm run build`
**Output Directory:** `dist`

### Step 3: Environment Variables (if needed)

Add in Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://salama-backend.onrender.com/api
```

### Step 4: Deploy

Click **"Deploy"** (1-2 minutes)

**Your Frontend URL:** `https://salama-frontend.vercel.app`

---

## 🔗 Integration Testing

### Test Backend API
```bash
curl https://salama-backend.onrender.com/api
# Should return: {"message":"Salama backend is running on Render!","version":"1.0.0"...}
```

### Test Frontend
- Visit: `https://salama-frontend.vercel.app`
- Check browser console for any API errors
- Verify CORS settings work between services

---

## 📊 URLs Summary

After successful deployment:

| Service | Platform | URL |
|---------|----------|-----|
| **Backend API** | Render | `https://salama-backend.onrender.com/api` |
| **Frontend** | Vercel | `https://salama-frontend.vercel.app` |
| **Admin Panel** | Render | `https://salama-backend.onrender.com/admin` |

---

## 🔧 Troubleshooting

### Backend Issues (Render):
- Check logs in Render dashboard
- Ensure MongoDB URI is valid
- Verify environment variables are set
- Check CORS settings in `backend/server.js`

### Frontend Issues (Vercel):
- Check build logs in Vercel dashboard
- Verify API URL is correct
- Ensure no hardcoded localhost URLs
- Check network requests in browser console

### CORS Issues:
Update CORS configuration in `backend/server.js`:
```javascript
const corsOptions = {
  origin: [
    'https://salama-frontend.vercel.app',
    'http://localhost:3000', // for local testing
    'http://localhost:5173'
  ],
  credentials: true
};
```

---

## ✅ Final Checklist

- [ ] Backend deployed on Render with correct environment variables
- [ ] Frontend API URLs updated to point to Render backend
- [ ] Frontend deployed on Vercel with proper configuration
- [ ] CORS configured to allow frontend domain
- [ ] Both services are accessible and communicating
- [ ] Health check endpoints working

**Result:** Your full-stack application is now live with optimal performance and reliability! 🎉