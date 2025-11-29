#!/usr/bin/env node

/**
 * 🔐 SECURE SECRET GENERATOR
 * ============================
 * This script generates cryptographically secure secrets for the Salama project.
 * 
 * Usage:
 *   node generate-secrets.js                    # Generate all secrets
 *   node generate-secrets.js jwt                # Generate only JWT secret
 *   node generate-secrets.js session            # Generate only session secret  
 *   node generate-secrets.js encryption         # Generate only encryption key
 *   node generate-secrets.js all [length]       # Generate all with custom length
 * 
 * Generated secrets are cryptographically secure using Node.js crypto module.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Generate a secure random hex string
 * @param {number} bytes - Number of bytes to generate
 * @returns {string} Hex-encoded random string
 */
function generateSecureSecret(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generate different types of secrets with appropriate lengths
 */
const secretTypes = {
  jwt: {
    name: 'JWT Secret',
    bytes: 64, // 512 bits for JWT signing
    description: 'Used for signing and verifying JWT tokens'
  },
  session: {
    name: 'Session Secret', 
    bytes: 32, // 256 bits for session encryption
    description: 'Used for encrypting session data'
  },
  encryption: {
    name: 'Encryption Key',
    bytes: 32, // 256 bits for file encryption
    description: 'Used for encrypting evidence files'
  },
  password: {
    name: 'Password Hash',
    bytes: 32, // 256 bits for password hashing
    description: 'Used for password hashing and validation'
  }
};

/**
 * Display banner
 */
function showBanner() {
  console.log(`${colors.cyan}${colors.bright}
╔══════════════════════════════════════════════════════════════╗
║                      🔐 SALAMA SECRET GENERATOR              ║
║                                                              ║
║  Generates cryptographically secure secrets for production  ║
║  ⚠️  Never commit actual secrets to version control!         ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
`);
}

/**
 * Generate a specific secret type
 * @param {string} type - Secret type to generate
 * @returns {object} Generated secret information
 */
function generateSecret(type) {
  const config = secretTypes[type];
  if (!config) {
    throw new Error(`Unknown secret type: ${type}`);
  }
  
  const secret = generateSecureSecret(config.bytes);
  
  return {
    type,
    name: config.name,
    secret,
    bytes: config.bytes,
    bits: config.bytes * 8,
    description: config.description
  };
}

/**
 * Format secret output for display
 * @param {object} secret - Secret object
 * @returns {string} Formatted output
 */
function formatSecretOutput(secret) {
  return `
${colors.green}${colors.bright}✓ ${secret.name}${colors.reset}
${colors.yellow}Type:${colors.reset} ${secret.type}
${colors.yellow}Secret:${colors.reset} ${colors.magenta}${secret.secret}${colors.reset}
${colors.yellow}Length:${colors.reset} ${secret.bits} bits (${secret.bytes} bytes)
${colors.yellow}Description:${colors.reset} ${secret.description}
${colors.cyan}Usage in .env:${colors.reset} ${getEnvVariableName(secret.type)}=${secret.secret}
`;
}

/**
 * Get environment variable name for secret type
 * @param {string} type - Secret type
 * @returns {string} Environment variable name
 */
function getEnvVariableName(type) {
  const envNames = {
    jwt: 'JWT_SECRET',
    session: 'SESSION_SECRET', 
    encryption: 'ENCRYPTION_KEY',
    password: 'PASSWORD_HASH_SECRET'
  };
  return envNames[type] || `${type.toUpperCase()}_SECRET`;
}

/**
 * Generate secrets based on command line arguments
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';
  const customLength = args[1] ? parseInt(args[1], 10) : null;

  showBanner();

  try {
    switch (command.toLowerCase()) {
      case 'jwt':
        displaySecret('jwt');
        break;
        
      case 'session':
        displaySecret('session');
        break;
        
      case 'encryption':
        displaySecret('encryption');
        break;
        
      case 'password':
        displaySecret('password');
        break;
        
      case 'all':
        displayAllSecrets(customLength);
        break;
        
      case 'help':
      case '-h':
      case '--help':
        showHelp();
        break;
        
      default:
        console.log(`${colors.red}Error: Unknown command '${command}'${colors.reset}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Display a single secret
 */
function displaySecret(type) {
  const secret = generateSecret(type);
  console.log(formatSecretOutput(secret));
}

/**
 * Display all secrets
 */
function displayAllSecrets(customLength) {
  console.log(`${colors.bright}${colors.cyan}Generating all secure secrets...${colors.reset}\n`);
  
  const secrets = Object.keys(secretTypes).map(type => {
    if (customLength && type !== 'jwt') {
      // For JWT, we always use 64 bytes for security
      const originalBytes = secretTypes[type].bytes;
      secretTypes[type].bytes = customLength;
      const secret = generateSecret(type);
      secretTypes[type].bytes = originalBytes; // Reset
      return secret;
    }
    return generateSecret(type);
  });

  secrets.forEach(secret => {
    console.log(formatSecretOutput(secret));
  });
  
  console.log(`${colors.green}${colors.bright}
✅ All secrets generated successfully!

${colors.yellow}Next Steps:${colors.reset}
1. Copy the generated secrets to your .env files
2. Never commit .env files to version control  
3. Use different secrets for each environment
4. Rotate secrets regularly (see SECRETS.md)

${colors.cyan}Security Tips:${colors.reset}
- Store secrets in environment variables or secrets manager
- Use the .gitignore file to prevent accidental commits
- Monitor for secret exposure in your codebase
- Implement proper secrets management in production${colors.reset}`);
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`${colors.cyan}Usage:${colors.reset}
  node generate-secrets.js [command] [length]

${colors.cyan}Commands:${colors.reset}
  all          Generate all secret types (default)
  jwt          Generate only JWT secret
  session      Generate only session secret
  encryption   Generate only encryption key
  password     Generate only password hash secret
  help         Show this help message

${colors.cyan}Examples:${colors.reset}
  node generate-secrets.js
  node generate-secrets.js jwt
  node generate-secrets.js session 16
  node generate-secrets.js all 32

${colors.cyan}Secret Types:${colors.reset}
  jwt         512 bits - JWT token signing (always 64 bytes)
  session     256 bits - Session encryption (default 32 bytes)  
  encryption  256 bits - File encryption (default 32 bytes)
  password    256 bits - Password hashing (default 32 bytes)

${colors.yellow}Note:${colors.reset} Custom length only applies to non-JWT secrets.
JWT always uses 64 bytes (512 bits) for maximum security.`);
}

// Export for use as module
if (require.main === module) {
  main();
}

module.exports = {
  generateSecureSecret,
  generateSecret,
  secretTypes
};