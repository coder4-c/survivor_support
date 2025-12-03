# Vercel Deployment Guide

Your project is already configured for Vercel deployment! Here's how to deploy it:

## Pre-Deployment Checklist ✅

- ✅ `vercel.json` configuration file exists
- ✅ Serverless API function at `api/index.js`
- ✅ Frontend React/Vite app in `frontend-main/`
- ✅ Backend routes integrated with API function
- ✅ Environment variables documented below

## Required Environment Variables

Before deploying, make sure to set these environment variables in your Vercel dashboard:

### Database
- `MONGODB_URI` - Your MongoDB connection string

### Security
- `JWT_SECRET` - Secret key for JWT token signing
- `NODE_ENV` - Set to `production` (automatically set)

### Frontend URLs (Optional)
- `FRONTEND_URL` - Your frontend URL (Vercel will auto-set this)

## Deployment Steps

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   ```

### Method 2: Using Git Integration

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect the configuration

3. **Configure Environment Variables**:
   - Add the required environment variables in the Vercel dashboard
   - Go to Settings → Environment Variables

## Project Structure

```
c:/Users/user/OneDrive/Desktop/Group_50/
├── api/
│   └── index.js          # Serverless API function
├── frontend-main/
│   ├── src/              # React app source
│   ├── package.json      # Frontend dependencies
│   └── dist/             # Built frontend (auto-generated)
├── backend/
│   ├── routes/           # API route handlers
│   ├── models/           # MongoDB models
│   └── package.json      # Backend dependencies
├── vercel.json           # Vercel configuration
├── package.json          # Root dependencies
└── README.md
```

## API Endpoints

Once deployed, your API will be available at:
- `https://your-app.vercel.app/api` - Health check
- `https://your-app.vercel.app/api/support` - Support routes
- `https://your-app.vercel.app/api/evidence` - Evidence routes
- `https://your-app.vercel.app/api/auth` - Authentication routes
- `https://your-app.vercel.app/api/ai` - AI routes

## Frontend

Your React app will be served at:
- `https://your-app.vercel.app/`

## Troubleshooting

### Common Issues:

1. **Build Fails**: 
   - Check that all dependencies are in package.json
   - Ensure Node.js version compatibility (>=18.0.0)

2. **API Routes Not Working**:
   - Verify environment variables are set
   - Check MongoDB URI is valid
   - Review Vercel function logs

3. **CORS Issues**:
   - Update CORS origins in `api/index.js` if needed
   - Add your Vercel domain to allowed origins

### Viewing Logs:
```bash
vercel logs
```

### Local Testing:
```bash
# Install dependencies
npm install
cd frontend-main && npm install
cd ../backend && npm install

# Run locally (separate terminals)
cd frontend-main && npm run dev
cd api && node index.js
```

## Cost Optimization

- Vercel Hobby plan (free) includes:
  - 100GB bandwidth
  - Serverless function executions
  - Edge network

Your project is optimized for serverless deployment with proper caching and connection pooling for MongoDB.