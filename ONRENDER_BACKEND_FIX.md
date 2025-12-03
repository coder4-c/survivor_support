# OnRender Backend Fix - API Connection Issue

## 🚨 **Current Problem**
Your OnRender URL `https://survivor-support-1.onrender.com` is serving the frontend React app instead of the backend API. This is why you're getting "Cannot connect to server" errors.

## 🔍 **Issue Diagnosis**
When you visit `https://survivor-support-1.onrender.com/`, it shows:
- React frontend HTML (not the expected backend health check)
- Vite-built assets (`/assets/index-CPEsM4ON.js`)
- **Expected**: JSON response with backend health check

## 🛠️ **Solution: Fix OnRender Deployment**

### Step 1: Check OnRender Dashboard Settings

1. **Go to OnRender Dashboard**: https://dashboard.render.com
2. **Select your backend service**: `survivor-support-1`
3. **Check these settings**:

   **Environment Tab:**
   - Runtime: `Node`
   - Root Directory: `backend` (not empty)
   - Build Command: `npm install`
   - Start Command: `npm start`

   **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

### Step 2: Update OnRender Configuration

If your service is configured incorrectly:

1. **Delete the current service** (if needed)
2. **Create a new Web Service**
3. **Choose "Build and deploy from a Git repository"**
4. **Select your repository**
5. **Configure:**
   ```
   Name: survivor-support-backend
   Root Directory: backend/
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

### Step 3: Test Backend API

After fixing the deployment, test these endpoints:

```bash
# Health check (should return JSON)
curl https://your-backend-url.onrender.com/

# API test (should return JSON or proper API response)
curl https://your-backend-url.onrender.com/api/auth/test
```

**Expected response at root:**
```json
{
  "message": "Salama backend is running!",
  "version": "1.0.0",
  "timestamp": "2025-12-03T20:00:00.000Z",
  "docs": "/docs",
  "endpoints": {
    "health": "/",
    "support": "/api/support",
    "evidence": "/api/evidence",
    "auth": "/api/auth",
    "ai": "/api/ai"
  }
}
```

### Step 4: Update Frontend Environment

Once you have the correct backend URL, update:
- Get the new backend URL from OnRender (e.g., `https://survivor-support-backend.onrender.com`)
- Update `frontend-main/.env.production`:
  ```
  VITE_API_URL=https://your-new-backend-url.onrender.com/api
  ```
- Redeploy to Vercel

## 🔄 **Quick Fix Steps**

1. **Fix OnRender backend deployment** (pointing to `backend/` directory)
2. **Get the correct backend URL**
3. **Update Vercel environment variable**: `VITE_API_URL`
4. **Redeploy Vercel frontend**

## 💡 **Alternative: Check if Backend is Running Locally**

If you need to test locally while fixing OnRender:
```bash
cd backend
npm install
npm start
# Backend should run on http://localhost:3000
```

Then update frontend `.env` to use:
```
VITE_API_URL=http://localhost:3000
```

## 🎯 **Expected Result**

After fixing:
- ✅ `https://your-backend.onrender.com/` → Backend JSON health check
- ✅ `https://your-frontend.vercel.app/` → React frontend (calling backend API)
- ✅ Login/registration works properly
- ✅ All API calls succeed