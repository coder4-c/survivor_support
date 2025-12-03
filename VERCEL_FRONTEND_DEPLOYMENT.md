# Frontend Deployment to Vercel

This guide explains how to deploy the Survivor Support frontend to Vercel while keeping the backend on OnRender.

## 🏗️ **Architecture**

- **Frontend**: Deployed on Vercel (React + Vite)
- **Backend**: Continues on OnRender at `https://survivor-support-1.onrender.com`
- **Database**: MongoDB (unchanged)

## 📋 **Prerequisites**

- GitHub repository with your code
- [Vercel account](https://vercel.com)
- Backend already deployed on OnRender

## 🚀 **Deployment Steps**

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for frontend deployment"
   git push origin main
   ```

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import from GitHub**:
   - Select your repository
   - Choose the `frontend-main` folder as the project root

3. **Configure Project Settings**:
   ```
   Project Name: survivor-support-frontend
   Framework Preset: Vite
   Root Directory: frontend-main
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables**:
   Vercel will automatically use the `.env.production` file, but you can also set:
   ```
   VITE_API_URL = https://survivor-support-1.onrender.com
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete

### Step 3: Update Backend CORS (Optional)

The backend CORS is already configured to allow your Vercel domain. If you get CORS errors:

1. **Find your Vercel URL** (e.g., `https://survivor-support-frontend.vercel.app`)
2. **Update backend CORS** in `backend/server.js`:
   ```javascript
   const corsOptions = {
     origin: [
       'http://localhost:8080',
       'http://localhost:3000',
       'http://localhost:5173',
       'http://localhost:5174',
       'https://survivor-support-1.onrender.com',
       'https://your-vercel-domain.vercel.app', // Add this
       process.env.FRONTEND_URL
     ].filter(Boolean),
     // ... rest of config
   };
   ```

## 🔗 **Final URLs**

After successful deployment:

- **Frontend**: `https://your-project-name.vercel.app`
- **Backend API**: `https://survivor-support-1.onrender.com`
- **API Endpoints**: `https://survivor-support-1.onrender.com/api/*`

## 🧪 **Testing**

1. **Test Frontend**:
   - Visit your Vercel URL
   - Check browser console for errors
   - Test authentication flow

2. **Test Backend Connection**:
   - Try logging in/registering
   - Test file upload in Evidence section
   - Verify API calls work

## 🔧 **Troubleshooting**

### Build Fails
- Check that all dependencies are in `frontend-main/package.json`
- Verify Node.js version compatibility (>=18.0.0)

### CORS Errors
- Verify VITE_API_URL points to correct backend URL
- Check backend CORS configuration includes your Vercel domain
- Ensure backend is running and accessible

### API Connection Issues
- Verify environment variables are set correctly
- Check network requests in browser dev tools
- Ensure backend health endpoint works: `https://survivor-support-1.onrender.com/`

## 💰 **Cost**

- **Vercel Hobby Plan**: Free
  - 100GB bandwidth
  - Unlimited personal projects
  - Automatic HTTPS

## 🔄 **Continuous Deployment**

Vercel automatically:
- Detects pushes to your GitHub repository
- Builds and deploys updates
- Provides preview deployments for pull requests

## ✅ **Done!**

Your Survivor Support application is now live with:
- ✅ Fast global CDN via Vercel
- ✅ Reliable backend on OnRender
- ✅ Automatic HTTPS
- ✅ Continuous deployment