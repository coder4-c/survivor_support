// Simple test script to check if the server starts correctly
const express = require('express');
require('dotenv').config();

console.log('🔍 Testing server configuration...');
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT || 3000);
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('- INFLECTION_API_KEY:', process.env.INFLECTION_API_KEY ? 'Set' : 'Not set');
console.log('- INFLECTION_API_URL:', process.env.INFLECTION_API_URL ? 'Set' : 'Not set');

// Test if routes can be loaded
try {
  const aiRoutes = require('./routes/ai');
  console.log('✅ AI routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading AI routes:', error.message);
}

try {
  const authRoutes = require('./routes/auth');
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
}

try {
  const supportRoutes = require('./routes/support');
  console.log('✅ Support routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading support routes:', error.message);
}

try {
  const evidenceRoutes = require('./routes/evidence');
  console.log('✅ Evidence routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading evidence routes:', error.message);
}

// Create a minimal test server
const app = express();
app.use(express.json());

// Test AI route
app.post('/api/ai/chat', (req, res) => {
  console.log('📨 Received chat request:', req.body);
  res.json({ 
    response: 'Test response from AI endpoint',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📋 Test endpoint: http://localhost:${PORT}/api/ai/chat`);
  console.log('✅ Server test completed successfully');
});