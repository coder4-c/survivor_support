# Current Vercel Deployment URLs

## 🌐 **Your Live Vercel Frontend URL:**
```
https://survivor-support2-jj59zeed6-marions-projects-7f4d8e25.vercel.app
```

## 🔗 **Quick Access Links:**
- **Main App**: https://survivor-support2-jj59zeed6-marions-projects-7f4d8e25.vercel.app
- **Emergency**: https://survivor-support2-jj59zeed6-marions-projects-7f4d8e25.vercel.app/#/emergency
- **Support**: https://survivor-support2-jj59zeed6-marions-projects-7f4d8e25.vercel.app/#/support
- **Evidence**: https://survivor-support2-jj59zeed6-marions-projects-7f4d8e25.vercel.app/#/evidence
- **Dashboard**: https://survivor-support2-jj59zeed6-marions-projects-7f4d8e25.vercel.app/#/dashboard

## ⚠️ **Current Issue:**
This frontend is trying to connect to:
```
https://survivor-support-1.onrender.com/api
```

But the OnRender deployment is serving frontend instead of backend, causing the "Cannot connect to server" error.

## 🛠️ **Two Solutions:**

### **Option 1: Fix OnRender Backend**
Follow the guide in `ONRENDER_BACKEND_FIX.md` to fix your existing OnRender backend deployment.

### **Option 2: Deploy Full-Stack to Vercel**
Use the new configuration in `VERCEL_FULL_STACK_DEPLOYMENT.md` to deploy both frontend and backend to Vercel for a single deployment.

## 🎯 **Recommended:**
Deploy the full-stack version to Vercel for the best experience (no CORS issues, single platform, better performance).