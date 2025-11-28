# Safe Circle Frontend Development Guide

## Quick Start

### Running the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (optional for basic serving)
npm install

# Serve with Python (built-in, no installation needed)
npm run dev

# Or serve with Node.js alternatives:
npm run serve    # Using 'serve' package
npm run start    # Using 'live-server' package
```

### Development Options

1. **Python HTTP Server** (Recommended - No installation needed)
   ```bash
   npm run dev
   ```
   Opens at: `http://localhost:8080`

2. **Node.js Live Server** (Requires npm install)
   ```bash
   npm install -g live-server
   npm run start
   ```
   Opens at: `http://localhost:8080`

3. **Manual Python Server**
   ```bash
   python -m http.server 8080
   ```

## Project Structure

```
frontend/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Modernized CSS with components
├── js/
│   └── main.js             # Enhanced JavaScript functionality
├── sw.js                   # Service Worker for offline support
├── package.json            # NPM configuration and scripts
├── .gitignore              # Git ignore rules
├── MODERNIZATION.md        # Modernization documentation
└── DEVELOPMENT.md          # This development guide
```

## Development Features

### ✨ New Components
- **Dashboard**: User statistics and profile management
- **Notifications**: Real-time notification center
- **Modals**: Confirmation and preview dialogs
- **FAB**: Floating action button with quick actions
- **Enhanced Forms**: Modern form components
- **File Upload**: Drag & drop with preview

### 🎨 Modern UI
- Dark mode support with system preference detection
- Spring-based animations and micro-interactions
- Responsive design for all devices
- Enhanced accessibility features

### 🔧 Development Tools
- Live reload with auto-refresh
- Service Worker for offline development
- Comprehensive error handling
- Modern JavaScript ES6+ features

## Backend Integration

The frontend expects the backend to be running on:
- **URL**: `http://localhost:3000`
- **API Endpoints**: 
  - `POST /api/support/support-request`
  - `POST /api/evidence/upload-evidence`

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: Progressive enhancement for older browsers

## Troubleshooting

### Port Already in Use
```bash
# Try a different port
python -m http.server 8081
# or
npm run serve -- --listen 3001
```

### Service Worker Issues
- Clear browser cache and reload
- Check browser console for service worker errors
- Service worker requires HTTPS or localhost

### Backend Connection
- Ensure backend is running on `http://localhost:3000`
- Check CORS configuration in backend
- Verify API endpoints are accessible

## Next Steps

The frontend is now fully modernized and ready for development. Future enhancements could include:

- React.js conversion for component-based architecture
- TypeScript integration for type safety
- Build process with bundling and optimization
- Unit and integration testing setup
- CI/CD pipeline configuration