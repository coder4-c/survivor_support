// Debug script to test route loading
require('dotenv').config();

console.log('🔍 Debugging route loading...\n');

// Test each route file individually
const routes = [
  { name: 'AI Routes', path: './routes/ai' },
  { name: 'Auth Routes', path: './routes/auth' },
  { name: 'Support Routes', path: './routes/support' },
  { name: 'Evidence Routes', path: './routes/evidence' }
];

routes.forEach(route => {
  try {
    console.log(`Testing ${route.name}...`);
    const routeModule = require(route.path);
    console.log(`✅ ${route.name} loaded successfully`);
    console.log(`   Type: ${typeof routeModule}`);
    console.log(`   Constructor: ${routeModule.constructor.name}`);
    console.log('');
  } catch (error) {
    console.error(`❌ Error loading ${route.name}:`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    console.log('');
  }
});

// Test environment variables
console.log('Environment Variables:');
console.log(`- INFLECTION_API_URL: ${process.env.INFLECTION_API_URL || 'NOT SET'}`);
console.log(`- INFLECTION_API_KEY: ${process.env.INFLECTION_API_KEY ? 'SET' : 'NOT SET'}`);
console.log(`- MONGODB_URI: ${process.env.MONGODB_URI || 'NOT SET'}`);
console.log(`- PORT: ${process.env.PORT || '3000 (default)'}`);

console.log('\n🔍 Debug completed.');