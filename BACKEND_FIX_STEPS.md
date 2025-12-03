# Backend Fix - OnRender Deployment

## 🚨 **The Problem**
Your OnRender URL `https://survivor-support-1.onrender.com` is serving the React frontend instead of the backend API.

## 🔍 **What Should Happen vs What Is Happening:**

### **✅ Expected Backend Behavior:**
```bash
curl https://survivor-support-1.onrender.com/
# Should return: {"message":"Salama backend is running!","version":"1.0.0"...}
```

### **❌ Current Wrong Behavior:**
```bash
curl https://survivor-support-1.onrender.com/
# Returns: React frontend HTML (Vite built assets)
```

## 🛠️ **Step-by-Step Fix**

### **Step 1: Check Current OnRender Service**

1. Go to [OnRender Dashboard](https://dashboard.render.com)
2. Find your service: `survivor-support-1`
3. Click on it to view settings

### **Step 2: Fix OnRender Configuration**

**In the Settings Tab, ensure these are set correctly:**

**Environment Tab:**
```
Name: survivor-support-1 (or rename to survivor-backend)
Branch: main
Root Directory: backend/ (NOT empty!)
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_actual_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### **Step 3: Deploy Updated Settings**

1. Click "Create Web Service" (if service doesn't exist) OR
2. Update existing service settings and click "Deploy"

### **Step 4: Test the Fix**

After 3-5 minutes of deployment, test:

```bash
# Test root endpoint
curl https://survivor-support-1.onrender.com/

# Should return JSON like:
{
  "message": "Salama backend is running!",
  "version": "1.0.0",
  "timestamp": "2025-12-03T20:18:00.000Z",
  "endpoints": {
    "health": "/",
    "support": "/api/support",
    "evidence": "/api/evidence",
    "auth": "/api/auth",
    "ai": "/api/ai"
  }
}

# Test API endpoint
curl https://survivor-support-1.onrender.com/api/

# Should return JSON health check
```

## ✅ **Success Indicators**

1. **Root endpoint** returns JSON (not HTML)
2. **API endpoints** respond with JSON
3. **Frontend login** works properly
4. **No more connection errors**

## 🔄 **If Service Doesn't Exist**

Create a new service:

1. **Click "New +"** → **"Web Service"**
2. **Choose**: "Build and deploy from a Git repository"
3. **Connect**: Your GitHub repository
4. **Configure:**
   ```
   Name: survivor-backend
   Branch: main
   Root Directory: backend/
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```
5. **Add Environment Variables** (same as above)
6. **Click "Create Web Service"**

## 🎯 **Result**

After fixing:
- ✅ Backend API responds with JSON
- ✅ Frontend can connect properly
- ✅ Login/registration works
- ✅ All features functional

**Then update your frontend environment if needed and redeploy to Vercel!**