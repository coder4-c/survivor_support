# Safe Circle Backend

A Node.js/Express/MongoDB backend for the Safe Circle survivor support application with secure evidence management.

## Features

- **Express.js API Server** - Fast, unopinionated web framework
- **MongoDB Integration** - Document-based database for flexible data storage
- **Secure File Upload** - Evidence storage with encryption and access controls
- **Support Request Management** - Handle survivor support requests and communications
- **Security Features** - CORS, Helmet, Rate limiting, Input validation
- **Admin Endpoints** - Protected routes for managing support requests and evidence
- **Logging & Monitoring** - Comprehensive logging and error handling

## Technology Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload handling
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation

## Project Structure

```
safe_circle_backend/
├── server.js              # Main server entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── README.md              # This file
├── models/                # MongoDB schemas/models
│   ├── SupportRequest.js  # Support request model
│   └── Evidence.js        # Evidence file model
├── routes/                # API route handlers
│   ├── support.js         # Support request endpoints
│   ├── evidence.js        # Evidence upload endpoints
│   └── auth.js            # Authentication endpoints
└── uploads/               # Uploaded evidence files (auto-created)
```

## Installation

1. **Install Dependencies**
   ```bash
   cd safe_circle_backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **MongoDB Setup**
   - Ensure MongoDB is running locally or configure a MongoDB Atlas connection
   - Update `MONGODB_URI` in `.env` file

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/safe_circle

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,txt

# Logging
LOG_LEVEL=info
```

### MongoDB Setup

**Option 1: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. The database will be created automatically

**Option 2: MongoDB Atlas**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## API Endpoints

### Health Check
- `GET /` - Server status and information

### Support Requests
- `POST /api/support/support-request` - Submit new support request
- `GET /api/support/` - Get all support requests (admin)
- `GET /api/support/:id` - Get specific request (admin)
- `PATCH /api/support/:id/status` - Update request status (admin)
- `POST /api/support/:id/notes` - Add note to request (admin)
- `GET /api/support/admin/stats` - Get support statistics (admin)

### Evidence Management
- `POST /api/evidence/upload-evidence` - Upload evidence files
- `GET /api/evidence/download/:uploadToken` - Download evidence file
- `GET /api/evidence/metadata/:uploadToken` - Get evidence metadata
- `GET /api/evidence/admin/stats` - Get evidence statistics (admin)
- `DELETE /api/evidence/:id` - Delete evidence (admin)
- `POST /api/evidence/admin/cleanup` - Clean up orphaned files (admin)

### Authentication
- `GET /api/auth/health` - Auth service health check
- `POST /api/auth/login` - User login (future implementation)
- `POST /api/auth/register` - User registration (future implementation)

## Running the Application

### Development Mode
```bash
npm run dev
```
Uses nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## Frontend Integration

The backend is designed to work seamlessly with the frontend:

- **Base URL**: `http://localhost:3000`
- **API Prefix**: `/api`
- **CORS**: Configured for localhost development
- **File Uploads**: Handles multipart/form-data requests
- **JSON Responses**: Consistent response format

### Frontend Configuration

Update the frontend's `apiBaseUrl` in `frontend/js/main.js`:
```javascript
this.apiBaseUrl = 'http://localhost:3000';
```

## Security Features

1. **Input Validation** - All inputs are validated using express-validator
2. **Rate Limiting** - Prevents API abuse with configurable limits
3. **CORS Protection** - Controlled cross-origin access
4. **Helmet Middleware** - Adds security headers
5. **File Type Validation** - Restricts uploads to allowed file types
6. **File Size Limits** - Prevents excessive file uploads
7. **SQL Injection Protection** - Mongoose ODM provides protection
8. **XSS Protection** - Input sanitization and output encoding

## File Upload Security

- **File Type Validation**: Only allows specific file extensions and MIME types
- **File Size Limits**: Configurable maximum file size (default: 10MB)
- **Unique Filenames**: Generates unique filenames to prevent conflicts
- **Access Control**: Files accessible only via secure tokens
- **Audit Logging**: All file operations are logged

## Database Models

### SupportRequest
- Stores support requests from survivors
- Tracks request status, priority, and notes
- Maintains privacy with optional anonymous submissions
- Includes IP tracking for security monitoring

### Evidence
- Secure storage of uploaded files
- Hash-based integrity checking
- Encryption key management
- Access token system for secure downloads
- Comprehensive audit logging

## Monitoring and Logging

- **Console Logging**: All server events logged to console
- **Error Handling**: Global error handler for uncaught exceptions
- **Access Logging**: All API requests are logged
- **File Operation Logs**: Track all file uploads and downloads
- **Database Logs**: MongoDB connection and query logging

## Testing

### Manual Testing
1. Start the server: `npm run dev`
2. Test health endpoint: `curl http://localhost:3000/`
3. Test support request: `curl -X POST http://localhost:3000/api/support/support-request`
4. Test file upload: Use frontend interface

### API Testing with cURL
```bash
# Health check
curl http://localhost:3000/

# Submit support request
curl -X POST http://localhost:3000/api/support/support-request \
  -H "Content-Type: application/json" \
  -d '{"type":"counseling","message":"Need immediate support"}'
```

## Deployment Considerations

### Environment Setup
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set secure JWT secrets
- Configure proper CORS origins
- Set up SSL/TLS certificates

### Security Hardening
- Use HTTPS in production
- Implement proper authentication
- Set up database access controls
- Configure firewall rules
- Set up monitoring and alerting

### Performance Optimization
- Enable gzip compression
- Set up database indexing
- Implement caching strategies
- Configure load balancing
- Set up CDN for static assets

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Check MongoDB service status
- Verify connection string in `.env`
- Check network connectivity

**File Upload Fails**
- Check upload directory permissions
- Verify file size limits
- Ensure allowed file types

**CORS Errors**
- Verify frontend URL in CORS configuration
- Check request headers
- Ensure proper HTTP methods

**Port Already in Use**
- Change `PORT` in `.env` file
- Kill existing process using the port

## Contributing

1. Follow existing code structure
2. Add input validation for new endpoints
3. Include error handling
4. Write descriptive comments
5. Test thoroughly before submitting

## License

This project is part of the Safe Circle application. All rights reserved.

## Support

For technical issues:
1. Check server logs for error messages
2. Verify environment configuration
3. Test API endpoints individually
4. Check database connectivity

---

**Remember**: This application handles sensitive information. Always prioritize user privacy and security.