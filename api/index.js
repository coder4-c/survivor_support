const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Compression
app.use(compression());

// CORS configuration for Vercel deployment
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection (cached for serverless)
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedDb = conn;
    console.log('✅ MongoDB connected successfully');
    return cachedDb;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

// Connect to DB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Salama backend is running on Vercel!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api',
      support: '/api/support',
      evidence: '/api/evidence',
      auth: '/api/auth',
      ai: '/api/ai'
    }
  });
});

// Health check on root for compatibility
app.get('/', (req, res) => {
  res.json({
    message: 'Salama backend is running on Vercel!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/',
      api: '/api',
      support: '/api/support',
      evidence: '/api/evidence',
      auth: '/api/auth',
      ai: '/api/ai'
    }
  });
});

// Route handlers (simplified for serverless)
const authHandler = async (req, res) => {
  const { method } = req;
  const { pathname } = new URL(req.url, `https://${req.headers.host}`);
  
  try {
    // Import route handlers dynamically
    const authRoutes = require('../backend/routes/auth');
    
    if (method === 'POST' && pathname === '/api/auth/login') {
      return await handleLogin(req, res);
    } else if (method === 'POST' && pathname === '/api/auth/register') {
      return await handleRegister(req, res);
    } else if (method === 'GET' && pathname === '/api/auth/me') {
      return await handleMe(req, res);
    } else {
      res.status(404).json({ error: 'Auth endpoint not found' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Simplified route handlers for serverless
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  
  // Mock login for now - replace with actual auth logic
  if (email && password) {
    res.json({
      token: 'mock-jwt-token',
      user: { id: '1', email, username: email.split('@')[0] }
    });
  } else {
    res.status(400).json({ error: 'Email and password required' });
  }
};

const handleRegister = async (req, res) => {
  const { email, password, name, username } = req.body;
  
  // Mock registration for now - replace with actual auth logic
  if (email && password && name && username) {
    res.json({
      token: 'mock-jwt-token',
      user: { id: '1', email, name, username }
    });
  } else {
    res.status(400).json({ error: 'All fields required' });
  }
};

const handleMe = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    res.json({
      user: { id: '1', email: 'user@example.com', username: 'user' }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Mount simplified route handlers
app.use('/api/auth', authHandler);
app.use('/api/support', (req, res) => res.json({ message: 'Support API - Coming Soon' }));
app.use('/api/evidence', (req, res) => res.json({ message: 'Evidence API - Coming Soon' }));
app.use('/api/ai', (req, res) => res.json({ message: 'AI API - Coming Soon' }));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Export the Express app for Vercel
module.exports = app;