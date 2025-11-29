# Survivor Support (Salama)

A comprehensive, secure web platform designed to support survivors of domestic violence and abuse. Salama ("peace" in Swahili) provides a safe digital space where users can securely store evidence, request support, access emergency resources, and connect with AI-powered assistance.

## Development Team:
Melvin Khakabo - Backend Development,  
Jepchumba Kipruto - Frontend Development,  
Lauryn Mwendwa- Data Science, 
Vincent Mutwiri - Full Stack Developer, 
WILBRODAH MAKHANU - Software Engineer


## Features

### 🔐 Secure Authentication
- Gmail-only registration for enhanced security
- Strong password requirements (8+ characters, uppercase, numbers)
- JWT-based authentication with bcrypt encryption
- Multi-language support (English/Swahili)
- Theme customization (light/dark modes)

### 📋 Support Request System
- Submit detailed support requests with categorization
- Track request status and updates
- Secure communication with support providers
- Anonymous submission options

### 🗂️ Evidence Vault
- Secure file upload and storage for evidence collection
- Support for various file types (documents, images, audio)
- Encrypted storage with access controls
- Timestamped evidence logging

### 🚨 Emergency Assistance
- Quick access to emergency contacts and resources
- Location-based emergency services
- Crisis hotline integration
- Safety planning tools

### 🤖 AI-Powered Chatbot
- 24/7 intelligent support and guidance
- Crisis intervention assistance
- Resource recommendations
- Multilingual conversational support

### 📊 Dashboard
- Personalized user dashboard
- Overview of support requests and evidence
- Quick access to key features
- Progress tracking and notifications

## Technology Stack

### Backend
- **Node.js** with Express framework
- **MongoDB** for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- Security middleware: Helmet, CORS, Rate Limiting, Compression

### Frontend
- **React 19** with modern hooks
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **React Router** for navigation
- **Framer Motion** for animations
- **React Three Fiber** for 3D effects
- **Shadcn/ui** component library

### Security Features
- Rate limiting (100 requests per 15 minutes)
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Secure file upload handling
- Environment-based configuration
- Graceful error handling

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB database
- Gmail account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd survivor_support
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend-main
   npm install
   ```

4. **Environment Setup**
   - Copy `.env.example` to `.env` in backend directory
   - Configure MongoDB URI, JWT secret, and other environment variables

5. **Start the application**
   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend-main directory)
   npm run dev
   ```

## API Endpoints

- `GET /` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/support` - Get support requests
- `POST /api/support` - Create support request
- `GET /api/evidence` - Get evidence files
- `POST /api/evidence` - Upload evidence
- `POST /api/ai/chat` - AI chatbot interaction

## Project Structure

```
survivor_support/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route handlers
│   ├── server.js        # Main server file
│   └── package.json
├── frontend-main/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## Contributing

This project is designed to make a real difference in supporting survivors. Contributions are welcome, especially in:
- Improving accessibility
- Adding new language support
- Enhancing security features
- Expanding emergency resources
- UI/UX improvements

## License

MIT License - see LICENSE file for details.

## Support

For technical support or questions about the platform, please contact the development team.



**Salama** - Where safety and support come first. 💜
