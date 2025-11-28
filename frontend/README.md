# Safe Circle Frontend

A responsive, accessible web application for survivor support services with secure evidence management.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessible Interface**: Built with accessibility best practices for all users
- **Secure File Upload**: Drag & drop interface for secure evidence upload
- **Emergency Support**: Quick access to emergency contacts and resources
- **Support Request System**: Confidential form for requesting support services
- **Offline Support**: Service worker for basic offline functionality

## Project Structure

```
frontend/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Responsive CSS styling
├── js/
│   └── main.js         # Interactive JavaScript functionality
├── sw.js              # Service worker for offline support
└── README.md          # This file
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for testing API integration)

### Running the Frontend

1. **Option 1: Simple File Opening**
   ```bash
   # Open index.html directly in your browser
   # Note: Some features may not work without a web server
   ```

2. **Option 2: Python HTTP Server**
   ```bash
   cd frontend
   python -m http.server 8080
   # Open http://localhost:8080 in your browser
   ```

3. **Option 3: Node.js HTTP Server**
   ```bash
   cd frontend
   npx http-server -p 8080
   # Open http://localhost:8080 in your browser
   ```

4. **Option 4: Live Server (VS Code)**
   - Install "Live Server" extension in VS Code
   - Right-click on `index.html` and select "Open with Live Server"

### Backend Integration

The frontend expects the backend API to be running at `http://localhost:8000`. To configure a different backend URL, modify the `apiBaseUrl` variable in `js/main.js`:

```javascript
this.apiBaseUrl = 'http://your-backend-url:port';
```

## Key Features

### Navigation
- Responsive navigation with mobile hamburger menu
- Section-based routing (Home, Support, Evidence Upload, Emergency)
- Browser back/forward button support

### Support Request System
- Optional anonymous submissions
- Support type categorization
- Form validation and error handling
- API integration with backend

### Secure File Upload
- Drag & drop interface
- File type validation (PDF, DOC, DOCX, JPG, PNG, TXT)
- File size limits (10MB per file)
- Progress tracking and error handling

### Emergency Support
- Direct calling functionality
- Crisis hotline access
- Resource links and contact information
- Emergency services guidance

## API Endpoints

The frontend integrates with the following backend endpoints:

- `GET /` - Health check
- `POST /support-request` - Submit support requests
- `POST /upload-evidence` - Upload secure evidence files

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Features

- WCAG 2.1 compliant design
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion preferences
- Focus indicators
- Semantic HTML structure

## Security Considerations

- Client-side file validation
- HTTPS recommended for production
- No sensitive data stored in localStorage
- CORS configuration on backend required
- File upload restrictions and limits

## Customization

### Colors and Styling
Modify the CSS custom properties in `css/styles.css`:

```css
:root {
    --primary-color: #4A90E2;
    --secondary-color: #6C757D;
    --accent-color: #28A745;
    /* ... other variables */
}
```

### API Configuration
Update the base URL and endpoints in `js/main.js`:

```javascript
this.apiBaseUrl = 'your-backend-url';
```

### Content
Modify the HTML content in `index.html` to customize:
- Support resources
- Emergency contacts
- Help text and descriptions
- Form fields and validation

## Development

### Code Organization
- **HTML**: Semantic structure with accessibility in mind
- **CSS**: Modular design with custom properties
- **JavaScript**: Object-oriented approach with clear separation of concerns

### Testing
1. Test responsive design across different screen sizes
2. Verify accessibility with screen readers
3. Test API integration with backend
4. Validate form submissions and file uploads
5. Test emergency calling functionality

### Building for Production
1. Minify CSS and JavaScript files
2. Optimize images and assets
3. Configure proper CORS settings
4. Set up HTTPS
5. Configure proper service worker caching

## Troubleshooting

### Common Issues

1. **API calls failing**
   - Check backend is running at correct URL
   - Verify CORS configuration on backend
   - Check browser console for errors

2. **File upload not working**
   - Ensure backend supports multipart uploads
   - Check file size and type restrictions
   - Verify network connectivity

3. **Mobile menu not working**
   - Check JavaScript console for errors
   - Verify viewport meta tag is present

4. **Styles not loading**
   - Check CSS file paths
   - Verify web server is serving static files correctly

## Contributing

1. Follow accessibility guidelines
2. Test across different browsers and devices
3. Maintain semantic HTML structure
4. Use descriptive commit messages
5. Document any new features or changes

## License

This frontend application is part of the Safe Circle project. Please refer to the main project license for terms and conditions.

## Support

For technical support or questions about the frontend:
1. Check the browser console for error messages
2. Verify backend connectivity
3. Review the API documentation
4. Test with different browsers and devices

---

*Remember: This application handles sensitive information. Always prioritize user privacy and security.*