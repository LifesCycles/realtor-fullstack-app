# Configuration Guide

This document provides detailed information about configuring the Realtor App for different environments.

## Environment Variables

### Backend Configuration

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/realtor_db
# Format: dialect+driver://username:password@host:port/database
# Supported dialects: postgresql, mysql, sqlite, oracle
# Example SQLite URL: sqlite:///realtor.db

# Security
JWT_SECRET=your_jwt_secret_here
# Must be at least 32 characters long, use a secure random generator
# Example: python -c "import secrets; print(secrets.token_urlsafe(32))"

JWT_ALGORITHM=HS256
# Supported algorithms: HS256, HS384, HS512
# HS256 is recommended for most use cases

ACCESS_TOKEN_EXPIRE_MINUTES=30
# Token expiration time in minutes
# Recommended: 15-30 minutes for security

# External Services
MAPS_API_KEY=your_maps_api_key_here
# Get your API key from the maps service provider

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=False  # Set to True only in development

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
# Required for email notifications and password reset functionality
```

### Frontend Configuration

```env
# API Configuration
VITE_API_URL=http://localhost:8000
# Backend API URL, must include protocol and port

# External Services
VITE_MAPS_API_KEY=your_maps_api_key_here
# Same key as backend MAPS_API_KEY

# Map Configuration
VITE_DEFAULT_LAT=25.7747
VITE_DEFAULT_LNG=-80.1342
# Default map center coordinates
# Example: Miami Beach coordinates provided

VITE_DEFAULT_ZOOM=14
# Default map zoom level (1-20)
# Recommended: 13-15 for city level

# Development Server
PORT=5173
HMR_HOST=localhost
# Hot Module Replacement configuration
# Use localhost for development

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=true
# Toggle features on/off

# Theme Configuration
VITE_DEFAULT_THEME=light
# Supported values: light, dark
```

## Security Best Practices

1. Environment Variables
   - Never commit `.env` files to version control
   - Use different values for development and production
   - Regularly rotate sensitive credentials
   - Use strong, unique values for secrets

2. API Keys
   - Restrict API keys by IP address when possible
   - Use separate keys for development and production
   - Enable only required API features
   - Monitor API usage for unusual patterns

3. Database
   - Use strong passwords in production
   - Enable SSL/TLS for database connections
   - Regularly backup database
   - Keep database software updated

4. JWT Security
   - Use strong, random secrets
   - Keep token expiration time short
   - Implement refresh token rotation
   - Store tokens securely (httpOnly cookies)

## Development Setup

1. Copy example environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Generate secure JWT secret:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

3. Update environment variables with your values

4. Start development servers:
   ```bash
   # Backend
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py

   # Frontend
   cd frontend
   npm install
   npm run dev
   ```

## Production Deployment

1. Security Checklist
   - [ ] Use HTTPS only
   - [ ] Set secure HTTP headers
   - [ ] Enable CORS with specific origins
   - [ ] Configure rate limiting
   - [ ] Enable request logging
   - [ ] Set up monitoring
   - [ ] Configure automated backups
   - [ ] Enable error tracking

2. Environment Variables
   - Use production-grade secrets management
   - Rotate credentials regularly
   - Monitor for exposed secrets

3. Database
   - Use managed database service when possible
   - Enable automatic backups
   - Use connection pooling
   - Enable query logging

4. API Security
   - Implement rate limiting
   - Use API key rotation
   - Monitor for abuse
   - Log API access

## Troubleshooting

Common issues and solutions:

1. Database Connection
   ```
   Error: connection refused
   Solution: Check DATABASE_URL format and credentials
   ```

2. JWT Errors
   ```
   Error: invalid token
   Solution: Verify JWT_SECRET matches between auth and verification
   ```

3. API Connection
   ```
   Error: network error
   Solution: Verify VITE_API_URL matches backend URL
   ```

4. Maps Not Loading
   ```
   Error: invalid API key
   Solution: Check VITE_MAPS_API_KEY is valid and has required permissions
   ```

## Support

For additional help:
1. Check the [FAQ](./docs/FAQ.md)
2. Open an issue on GitHub
3. Join our Discord community
