# Full Stack Vercel Deployment Guide

## 🏗️ **Complete Vercel Architecture**

Deploy both frontend AND backend on Vercel for a unified deployment:

- **Frontend**: React app served from `frontend-main/` directory
- **Backend**: Serverless API functions in `api/` directory
- **Single URL**: Everything under one Vercel domain
- **Zero CORS Issues**: Same origin requests

## 📁 **Project Structure for Vercel**

```
c:/Users/user/OneDrive/Desktop/Group_50/
├── api/                    # Backend API (serverless functions)
│   └── index.js           # Main API handler
├── frontend-main/         # React frontend
│   ├── src/               # React components
│   └── dist/              # Built frontend
├── backend/               # Original backend (for reference)
├── package.json           # Root package.json for API
└── vercel.json            # Vercel configuration
```

## 🚀 **Deployment Steps**

### Step 1: Create Backend API Functions

Since we deleted the `api/` directory earlier, let me recreate it with the backend routes:

```bash
# Create api directory structure
mkdir -p api/routes
```

### Step 2: Recreate Serverless API

Let me create the serverless API structure that combines all backend routes:

1. **Main API handler** (`api/index.js`)
2. **Route handlers** for auth, evidence, support, ai
3. **Database connection** optimized for serverless

### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

### Step 4: Update Frontend Environment

Update `frontend-main/.env.production`:
```
# Backend API is served from same Vercel domain
VITE_API_URL=https://your-vercel-domain.vercel.app/api
```

### Step 5: Deploy to Vercel

1. **Push to GitHub** (already done)
2. **Go to Vercel Dashboard**
3. **Import your repository**
4. **Vercel will auto-detect**:
   - Frontend: `frontend-main/` directory
   - Backend: `api/` directory for serverless functions
5. **Deploy!**

## 🔗 **Final URLs**

After deployment:
- **Frontend**: `https://your-project.vercel.app/`
- **Backend API**: `https://your-project.vercel.app/api/`
- **Auth**: `https://your-project.vercel.app/api/auth/login`
- **Evidence**: `https://your-project.vercel.app/api/evidence/upload`
- **Support**: `https://your-project.vercel.app/api/support`

## ✅ **Benefits of Full Vercel Deployment**

1. **Single Platform**: Everything on Vercel
2. **Zero CORS**: Same origin, no cross-origin issues
3. **Automatic HTTPS**: SSL certificates handled automatically
4. **Global CDN**: Fast worldwide performance
5. **Automatic Scaling**: Serverless functions scale automatically
6. **Easy Management**: Single dashboard for frontend and backend
7. **Preview Deployments**: Preview changes before going live

## 🛠️ **Technical Implementation**

### API Routes Structure:
```
/api/                    # Root health check
/api/auth/              # Authentication endpoints
/api/evidence/          # File upload/management
/api/support/           # Support requests
/api/ai/               # AI chat functionality
```

### CORS Configuration:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', 
    'https://your-project.vercel.app'  // Same origin
  ].filter(Boolean),
  credentials: true
};
```

## 🔧 **Migration from OnRender to Vercel**

1. **Deploy backend to Vercel** as serverless functions
2. **Update frontend** API URL to use Vercel domain
3. **Remove OnRender** dependency (optional)
4. **Test all functionality** on new deployment

## 💰 **Cost Considerations**

- **Vercel Hobby Plan**: Free for both frontend and backend
- **Limits**: 
  - 100GB bandwidth per month
  - 1000 serverless function invocations per day
  - 100 builds per month
- **For production**: Consider Vercel Pro plan for higher limits

## 🎯 **Recommendation**

**Yes, deploy both frontend and backend on Vercel!** This is the modern approach for full-stack applications and eliminates deployment complexity and CORS issues.