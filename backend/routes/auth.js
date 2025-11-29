const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Basic health check for auth routes
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, username, language = 'en', theme = 'light' } = req.body;

    // Validation
    if (!email || !password || !name || !username) {
      return res.status(400).json({
        error: 'All fields (email, password, name, username) are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          error: 'An account with this email already exists'
        });
      }
      if (existingUser.username === username) {
        return res.status(400).json({
          error: 'This username is already taken'
        });
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Parse name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      username,
      firstName,
      lastName,
      language,
      theme
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (password excluded) and token
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language,
        theme: user.theme,
        hasReportedCases: user.hasReportedCases,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: `An account with this ${field} already exists`
      });
    }

    res.status(500).json({
      error: 'Internal server error during registration',
      message: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (password excluded) and token
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language,
        theme: user.theme,
        hasReportedCases: user.hasReportedCases,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error during login',
      message: error.message
    });
  }
});

// Update user preferences (language/theme)
router.put('/preferences', async (req, res) => {
  try {
    const { language, theme } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Update preferences
    const updateData = {};
    if (language && ['en', 'sw'].includes(language)) {
      updateData.language = language;
    }
    if (theme && ['light', 'dark'].includes(theme)) {
      updateData.theme = theme;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      message: 'Preferences updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }

    res.status(500).json({
      error: 'Internal server error updating preferences',
      message: error.message
    });
  }
});

// Token validation middleware (for protected routes)
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      error: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Invalid token.'
    });
  }
};

// Protected route to get current user info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.json({
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Admin token validation (for protected routes)
const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      error: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Invalid token.'
    });
  }
};

// Protected admin route example
router.get('/admin-only', adminAuth, (req, res) => {
  res.json({
    message: 'This is a protected admin route',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
module.exports.auth = auth;
module.exports.adminAuth = adminAuth;