# MongoDB Setup for OnRender Backend

## 🚨 **The Real Problem: Missing MongoDB Database**

The error shows your backend is trying to connect to local MongoDB:
```
❌ MongoDB connection error: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
```

**This means the `MONGODB_URI` environment variable is not set or is incorrect in your OnRender deployment.**

## 🔧 **Solution: Set Up Cloud MongoDB**

### **Option 1: MongoDB Atlas (Recommended - Free Tier)**

1. **Go to MongoDB Atlas**: https://www.mongodb.com/atlas
2. **Create Free Account**
3. **Create New Cluster**: Choose the free tier (M0)
4. **Create Database User**:
   ```
   Username: your_username
   Password: your_secure_password
   ```
5. **Set Up Network Access**: Add IP address `0.0.0.0/0` (for OnRender access)
6. **Get Connection String**: 
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/safe_circle?retryWrites=true&w=majority
   ```

### **Option 2: MongoDB Atlas Quick Setup**

1. **Go to**: https://www.mongodb.com/atlas
2. **Click "Start Free"**
3. **Choose "Shared Cluster"** (Free)
4. **Select Region** (closest to you)
5. **Create Cluster** (takes ~2 minutes)
6. **Create Database User** (username/password)
7. **Click "Connect" on the cluster**
8. **Choose "Connect your application"**
9. **Copy connection string**

## 🛠️ **Update OnRender Environment Variables**

In your OnRender Dashboard → Environment Variables, add:
```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/safe_circle?retryWrites=true&w=majority
JWT_SECRET=your_very_secure_jwt_secret_key_here
NODE_ENV=production
PORT=10000
```

## 🧪 **Test MongoDB Connection**

### **Test Locally First** (Optional):
```bash
cd backend
echo "MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/safe_circle" > .env
npm start
```

### **Test in OnRender**:
After updating environment variables, the backend should start without MongoDB errors.

## 📝 **Your .env File** (for reference)
```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/safe_circle?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=production
PORT=10000
```

## 🎯 **Expected Result**
After setting up MongoDB Atlas and updating environment variables:
- ✅ No more MongoDB connection errors
- ✅ Backend starts successfully
- ✅ `/api/` endpoints respond with JSON
- ✅ Frontend can connect properly
- ✅ Login/registration works

## 💡 **Quick Tip**
Use a password generator for your JWT_SECRET, like: `this-is-a-secure-jwt-secret-key-2024`