"""
Realtor App Backend Server

This module serves as the main entry point for the Realtor App backend.
It initializes the Flask application, configures middleware, and sets up routes.

The application uses Flask as the web framework and SQLAlchemy for database operations.
Security features include CORS, rate limiting, and secure headers via Flask-Talisman.

Environment Variables:
    DATABASE_URL: Database connection string
    JWT_SECRET: Secret key for JWT token generation
    ALLOWED_ORIGINS: Comma-separated list of allowed CORS origins
    REDIS_URL: Redis connection string for rate limiting
    See .env.example for all available configuration options

Usage:
    $ python app.py

For development:
    $ export FLASK_ENV=development
    $ export FLASK_DEBUG=1
    $ flask run
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from dotenv import load_dotenv
import os
from models.property import db
import logging
from logging.handlers import RotatingFileHandler
from flask import redirect

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///realtor.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Security headers with Talisman
Talisman(app,
    force_https=os.getenv('FORCE_HTTPS', 'True').lower() == 'true',
    strict_transport_security=True,
    session_cookie_secure=True,
    content_security_policy={
        'default-src': "'self'",
        'img-src': ['*', 'data:', 'blob:'],
        'connect-src': ["'self'", 'https://*'],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
    }
)

# Configure CORS
CORS(app, 
     resources={r"/api/*": {"origins": os.getenv('ALLOWED_ORIGINS', '*').split(','),
                           "methods": ["GET", "POST", "PUT", "DELETE"],
                           "allow_headers": ["Content-Type", "Authorization"]}},
     supports_credentials=True)

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri=os.getenv('REDIS_URL', 'memory://')
)

# Configure logging
if not app.debug:
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/realtor.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Realtor startup')

# Configure SQLAlchemy with connection pooling
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_size': int(os.getenv('DB_POOL_SIZE', '5')),
    'pool_timeout': int(os.getenv('DB_POOL_TIMEOUT', '30')),
    'pool_recycle': int(os.getenv('DB_POOL_RECYCLE', '1800')),
}

# Basic security middleware
@app.before_request
def before_request():
    """
    Middleware function executed before each request.
    
    Performs the following checks:
    1. Forces HTTPS in production environment
    2. Logs request details for monitoring
    
    Returns:
        Redirect response if HTTP is used in production, None otherwise
    """
    # Force HTTPS in production
    if not request.is_secure and app.config.get('ENV') == 'production':
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)
    
    # Log request details
    app.logger.info(f"Request: {request.method} {request.path} from {request.remote_addr}")

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    """Handle resource not found errors."""
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle internal server errors."""
    app.logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(400)
def bad_request_error(error):
    """Handle bad request errors."""
    return jsonify({'error': 'Bad request'}), 400

@app.errorhandler(429)
def ratelimit_handler(e):
    """Handle rate limit exceeded errors."""
    return jsonify({'error': 'Rate limit exceeded'}), 429

# Health check endpoint
@app.route('/health')
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({
        'status': 'healthy',
        'version': '1.0.0'  # Add version information
    }), 200

# Import and register blueprints
from routes.property_routes import property_bp
app.register_blueprint(property_bp, url_prefix='/api')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(
        host=os.getenv('HOST', '0.0.0.0'),
        port=int(os.getenv('PORT', 8000)),
        debug=os.getenv('DEBUG', 'False').lower() == 'true'
    )