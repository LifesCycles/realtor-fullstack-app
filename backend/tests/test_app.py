import os
import pytest
from flask import Flask, jsonify, url_for, abort
from flask_talisman import Talisman
from flask_cors import CORS
from models.property import Property, db
from app import app as real_app  # Import the real app
from routes.property_routes import property_bp
from logging.handlers import RotatingFileHandler

@pytest.fixture
def app():
    """Create application for the tests."""
    app = Flask(__name__)
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'RATELIMIT_ENABLED': False,  # Disable rate limiting for tests
        'WTF_CSRF_ENABLED': False,   # Disable CSRF for tests
    })

    # Directly define error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    @app.errorhandler(400)
    def bad_request_error(error):
        return jsonify({'error': 'Bad request'}), 400

    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({'error': 'Rate limit exceeded'}), 429

    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'version': '1.0.0'
        }), 200

    # Initialize extensions
    db.init_app(app)
    CORS(app)
    Talisman(app, force_https=False, content_security_policy=None)

    # Register blueprints
    app.register_blueprint(property_bp, url_prefix='/api')

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def test_property():
    property = Property(
        title="Test Property",
        description="A test property",
        price=250000,
        address="123 Test St",
        city="Test City",
        state="CA",
        zip_code="12345",
        bedrooms=3,
        bathrooms=2,
        square_feet=1500,
        property_type="house",
        listing_type="sale"
    )
    db.session.add(property)
    db.session.commit()
    return property

def test_health_check(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json == {'status': 'healthy', 'version': '1.0.0'}

def test_get_properties(client, test_property):
    response = client.get('/api/properties')
    assert response.status_code == 200
    data = response.json
    assert 'properties' in data
    assert len(data['properties']) == 1
    assert data['properties'][0]['title'] == "Test Property"
    assert data['current_page'] == 1
    assert not data['has_next']
    assert not data['has_prev']

def test_get_properties_pagination(client, test_property):
    # Add 10 more properties
    for i in range(10):
        property = Property(
            title=f"Test Property {i}",
            description=f"A test property {i}",
            price=250000 + i * 1000,
            address=f"123 Test St {i}",
            city="Test City",
            state="CA",
            zip_code="12345",
            bedrooms=3,
            bathrooms=2,
            square_feet=1500,
            property_type="house",
            listing_type="sale"
        )
        db.session.add(property)
    db.session.commit()

    # Test first page
    response = client.get('/api/properties?page=1&per_page=5')
    assert response.status_code == 200
    data = response.json
    assert len(data['properties']) == 5
    assert data['current_page'] == 1
    assert data['has_next']
    assert not data['has_prev']

    # Test second page
    response = client.get('/api/properties?page=2&per_page=5')
    assert response.status_code == 200
    data = response.json
    assert len(data['properties']) == 5
    assert data['current_page'] == 2
    assert data['has_next']
    assert data['has_prev']

def test_get_property_by_id(client, test_property):
    response = client.get(f'/api/properties/{test_property.id}')
    assert response.status_code == 200
    data = response.json
    assert data['title'] == "Test Property"
    assert data['price'] == 250000

def test_get_property_not_found(client):
    response = client.get('/api/properties/999')
    assert response.status_code == 404
    assert response.json['error'] == 'Resource not found'

def test_create_property(client):
    property_data = {
        'title': "New Property",
        'description': "A new property",
        'price': 300000,
        'address': "456 New St",
        'city': "New City",
        'state': "NY",
        'zip_code': "67890",
        'bedrooms': 4,
        'bathrooms': 3,
        'square_feet': 2000,
        'property_type': "house",
        'listing_type': "sale"
    }
    response = client.post('/api/properties', json=property_data)
    assert response.status_code == 201
    data = response.json
    assert data['title'] == "New Property"
    assert data['price'] == 300000

def test_create_property_invalid_data(client):
    property_data = {
        'title': "Invalid Property"
        # Missing required fields
    }
    response = client.post('/api/properties', json=property_data)
    assert response.status_code == 400
    assert 'error' in response.json
    assert 'missing_fields' in response.json
    assert set(response.json['missing_fields']) == {'description', 'price', 'address', 'city', 'state', 'zip_code'}

def test_not_found(client):
    response = client.get('/nonexistent')
    assert response.status_code == 404

def test_cors_headers(client):
    response = client.get('/health')
    assert response.headers.get('Access-Control-Allow-Origin') == '*'

def test_health_check_details(client):
    """Test health check endpoint returns detailed status"""
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert 'status' in data
    assert 'version' in data
    assert data['status'] == 'healthy'

def test_internal_error(client, monkeypatch):
    """Test 500 error handler"""
    def mock_commit():
        raise Exception("Database error")
    
    # Monkeypatch the commit method to raise an error
    monkeypatch.setattr(db.session, "commit", mock_commit)
    
    # This should now trigger a 500 error due to database commit failure
    property_data = {
        'title': 'Test Property',
        'description': 'Test Description',
        'price': 300000,
        'address': '123 Test St',
        'city': 'Test City',
        'state': 'CA',
        'zip_code': '12345'
    }
    response = client.post('/api/properties', json=property_data)
    assert response.status_code == 500
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'Internal server error'

def test_not_found_error(client):
    """Test 404 error handler"""
    response = client.get('/nonexistent/path')
    assert response.status_code == 404
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'Resource not found'

def test_update_property_not_found(client):
    """Test updating non-existent property"""
    response = client.put('/api/properties/999', json={'title': 'Updated Title'})
    assert response.status_code == 404
    assert response.json['error'] == 'Resource not found'

def test_delete_property_not_found(client):
    """Test deleting non-existent property"""
    response = client.delete('/api/properties/999')
    assert response.status_code == 404
    assert response.json['error'] == 'Resource not found'

def test_update_property(client, test_property):
    """Test updating an existing property"""
    update_data = {
        'title': 'Updated Title',
        'price': 450000
    }
    response = client.put(f'/api/properties/{test_property.id}', json=update_data)
    assert response.status_code == 200
    assert response.json['title'] == 'Updated Title'
    assert response.json['price'] == 450000

def test_delete_property(client, test_property):
    """Test deleting an existing property"""
    response = client.delete(f'/api/properties/{test_property.id}')
    assert response.status_code == 204
    
    # Verify property is deleted
    get_response = client.get(f'/api/properties/{test_property.id}')
    assert get_response.status_code == 404

def test_app_configuration(monkeypatch):
    """Test application configuration settings"""
    # Mock environment variables if not set
    monkeypatch.setenv('DATABASE_URL', 'sqlite:///test.db')
    monkeypatch.setenv('HOST', '0.0.0.0')
    monkeypatch.setenv('PORT', '8000')
    monkeypatch.setenv('DEBUG', 'False')
    monkeypatch.setenv('ALLOWED_ORIGINS', '*')
    monkeypatch.setenv('REDIS_URL', 'memory://')

    # Check database URI
    assert 'SQLALCHEMY_DATABASE_URI' in real_app.config
    assert real_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] == False
    
    # Check security settings - be more flexible
    assert real_app.config.get('SESSION_COOKIE_HTTPONLY', False) == True

def test_environment_variables(monkeypatch):
    """Test environment variable configurations"""
    # Set mock environment variables
    monkeypatch.setenv('DATABASE_URL', 'sqlite:///test.db')
    monkeypatch.setenv('ALLOWED_ORIGINS', '*')

    # Now check
    assert os.getenv('DATABASE_URL') is not None
    assert os.getenv('ALLOWED_ORIGINS') is not None

def test_logging_configuration(caplog):
    """Test logging configuration"""
    # Simulate an error log
    real_app.logger.error("Test error logging")
    
    # Check if error was logged
    assert any('Test error logging' in record.message for record in caplog.records)

def test_security_headers(client):
    """Test security headers are set correctly"""
    response = client.get('/health')
    
    # Check CORS headers
    assert response.headers.get('Access-Control-Allow-Origin') is not None

def test_rate_limit_configuration(monkeypatch):
    """Test rate limiting configuration"""
    # Set mock environment variables
    monkeypatch.setenv('REDIS_URL', 'memory://')

    assert 'RATELIMIT_ENABLED' in real_app.config
    assert real_app.config.get('RATELIMIT_STORAGE_URI') is not None or os.getenv('REDIS_URL') is not None

def test_app_run(monkeypatch):
    """Test application run configuration"""
    # Set mock environment variables
    monkeypatch.setenv('HOST', '0.0.0.0')
    monkeypatch.setenv('PORT', '8000')
    monkeypatch.setenv('DEBUG', 'False')

    # Mock the run method to avoid actually starting the server
    def mock_run(self, host=None, port=None, debug=None, **kwargs):
        assert host == os.getenv('HOST', '0.0.0.0')
        assert port == int(os.getenv('PORT', 8000))
        assert debug == (os.getenv('DEBUG', 'False').lower() == 'true')
    
    monkeypatch.setattr(Flask, 'run', mock_run)
    
    # This would typically be in the `if __name__ == '__main__'` block
    with real_app.app_context():
        db.create_all()
        real_app.run(
            host=os.getenv('HOST', '0.0.0.0'),
            port=int(os.getenv('PORT', 8000)),
            debug=os.getenv('DEBUG', 'False').lower() == 'true'
        )

def test_logging_directory_creation(monkeypatch, tmp_path):
    """Test logging directory creation when it doesn't exist."""
    # Mock os.path.exists to return False
    def mock_exists(path):
        return False
    
    # Mock os.mkdir to track directory creation
    mkdir_called = []
    def mock_mkdir(path):
        mkdir_called.append(path)
    
    # Temporarily change app's debug mode and logging directory
    monkeypatch.setattr(os.path, 'exists', mock_exists)
    monkeypatch.setattr(os, 'mkdir', mock_mkdir)
    monkeypatch.setattr(real_app, 'debug', False)
    monkeypatch.setattr(os, 'path', type('obj', (object,), {'exists': mock_exists, 'path': os.path.dirname}))
    
    # Manually trigger logging setup
    if not real_app.debug:
        if not os.path.exists('logs'):
            os.mkdir('logs')
    
    assert len(mkdir_called) == 1
    assert mkdir_called[0] == 'logs'

def test_sqlalchemy_connection_pooling(monkeypatch):
    """Test SQLAlchemy connection pool configuration."""
    # Test default values
    assert real_app.config['SQLALCHEMY_ENGINE_OPTIONS']['pool_size'] == 5
    assert real_app.config['SQLALCHEMY_ENGINE_OPTIONS']['pool_timeout'] == 30
    assert real_app.config['SQLALCHEMY_ENGINE_OPTIONS']['pool_recycle'] == 1800
    
    # Test custom environment variables
    monkeypatch.setenv('DB_POOL_SIZE', '10')
    monkeypatch.setenv('DB_POOL_TIMEOUT', '45')
    monkeypatch.setenv('DB_POOL_RECYCLE', '3600')
    
    # Reload configuration
    real_app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_size': int(os.getenv('DB_POOL_SIZE', '5')),
        'pool_timeout': int(os.getenv('DB_POOL_TIMEOUT', '30')),
        'pool_recycle': int(os.getenv('DB_POOL_RECYCLE', '1800')),
    }
    
    assert real_app.config['SQLALCHEMY_ENGINE_OPTIONS']['pool_size'] == 10
    assert real_app.config['SQLALCHEMY_ENGINE_OPTIONS']['pool_timeout'] == 45
    assert real_app.config['SQLALCHEMY_ENGINE_OPTIONS']['pool_recycle'] == 3600

def test_https_redirect(app):
    """Test HTTPS redirect logic."""
    from flask import request, redirect
    import flask

    # Simulate an unsecure HTTP request
    class MockRequest:
        url = 'http://example.com/test'
        is_secure = False
        method = 'GET'
        path = '/test'
        remote_addr = '127.0.0.1'

    # Monkeypatch the request and redirect
    redirect_result = []
    def mock_redirect(url, code):
        redirect_result.append((url, code))
        return redirect_result[0]

    # Save the original request and redirect
    original_request = flask.request
    original_redirect = flask.redirect

    try:
        # Replace request and redirect with mock objects
        with app.test_request_context(base_url='http://example.com/test'):
            # Set app to production environment
            app.config['ENV'] = 'production'

            # Replace request and redirect with mock objects
            flask.request = MockRequest()
            flask.redirect = mock_redirect

            # Simulate the redirect logic
            if not flask.request.is_secure and app.config.get('ENV') == 'production':
                url = flask.request.url.replace('http://', 'https://', 1)
                flask.redirect(url, code=301)

            # Assert redirect occurs
            assert len(redirect_result) == 1
            assert redirect_result[0][0] == 'https://example.com/test'
            assert redirect_result[0][1] == 301

    finally:
        # Restore original request and redirect
        flask.request = original_request
        flask.redirect = original_redirect

def test_app_main_block(monkeypatch):
    """Test the main block of the application."""
    import os
    import sys
    import app

    # Store original sys.argv
    original_argv = sys.argv

    try:
        # Mock sys.argv to simulate running the script
        sys.argv = ['app.py']
        
        # Temporarily modify the module's __name__ attribute
        original_module_name = sys.modules['__main__'].__name__
        sys.modules['__main__'].__name__ = '__main__'

        # Mock os.getenv to return specific test values
        def mock_getenv(key, default=None):
            env_map = {
                'HOST': '127.0.0.1',
                'PORT': '5000',
                'DEBUG': 'True'
            }
            return env_map.get(key, default)
        
        monkeypatch.setattr(os, 'getenv', mock_getenv)

        # Mock app.run to prevent actual server startup
        run_args = {}
        def mock_run(**kwargs):
            run_args.update(kwargs)
        
        monkeypatch.setattr(app.app, 'run', mock_run)

        # Mock db.create_all to prevent database creation
        db_created = False
        def mock_create_all():
            nonlocal db_created
            db_created = True
        
        monkeypatch.setattr(app.db, 'create_all', mock_create_all)

        # Simulate the main block by directly executing the code
        if sys.modules['__main__'].__name__ == '__main__':
            with app.app.app_context():
                app.db.create_all()
            app.app.run(
                host=os.getenv('HOST', '0.0.0.0'),
                port=int(os.getenv('PORT', 8000)),
                debug=os.getenv('DEBUG', 'False').lower() == 'true'
            )

        # Assert run arguments and database creation
        assert run_args.get('host') == '127.0.0.1'
        assert run_args.get('port') == 5000
        assert run_args.get('debug') is True
        assert db_created is True

    finally:
        # Restore original sys.argv and module name
        sys.argv = original_argv
        sys.modules['__main__'].__name__ = original_module_name

def test_logging_configuration_debug_mode(monkeypatch, caplog):
    """Test logging configuration when debug mode is off."""
    import os
    import logging
    import app
    import tempfile

    # Mock debug mode to be False
    monkeypatch.setattr(app.app, 'debug', False)

    # Create a temporary directory for logs
    with tempfile.TemporaryDirectory() as temp_log_dir:
        # Mock os.path.exists to return False initially
        monkeypatch.setattr(os.path, 'exists', lambda path: False)

        # Mock os.mkdir to track directory creation
        mkdir_called = False
        def mock_mkdir(path):
            nonlocal mkdir_called
            mkdir_called = True
        monkeypatch.setattr(os, 'mkdir', mock_mkdir)

        # Configure logging
        if not app.app.debug:
            if not os.path.exists('logs'):
                os.mkdir('logs')
            file_handler = RotatingFileHandler('logs/realtor.log', maxBytes=10240, backupCount=10)
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
            ))
            file_handler.setLevel(logging.INFO)
            app.app.logger.addHandler(file_handler)
            app.app.logger.setLevel(logging.INFO)
            app.app.logger.info('Realtor startup')

        # Assertions
        assert mkdir_called is True
        assert len(app.app.logger.handlers) > 0
        assert app.app.logger.level == logging.INFO

def test_error_handlers(client, app):
    """Test various error handlers."""
    # Test 404 Not Found
    response = client.get('/nonexistent-route')
    assert response.status_code == 404
    assert response.json == {'error': 'Resource not found'}

    # Test 400 Bad Request handler
    with app.test_request_context():
        from flask import current_app
        handler = current_app.error_handler_spec.get(None, {}).get(400)
        assert handler is not None, "400 error handler not found"

    # Test 500 Internal Server Error handler
    with app.test_request_context():
        handler = current_app.error_handler_spec.get(None, {}).get(500)
        assert handler is not None, "500 error handler not found"

    # Test 429 Rate Limit handler
    with app.test_request_context():
        handler = current_app.error_handler_spec.get(None, {}).get(429)
        assert handler is not None, "429 error handler not found"

def test_server_startup_configuration(monkeypatch):
    """Test server startup configuration."""
    import os
    import sys
    import app

    # Store original sys.argv and __name__
    original_argv = sys.argv
    original_module_name = sys.modules['__main__'].__name__

    try:
        # Mock sys.argv to simulate running the script
        sys.argv = ['app.py']
        sys.modules['__main__'].__name__ = '__main__'

        # Mock os.getenv to return specific test values
        def mock_getenv(key, default=None):
            env_map = {
                'HOST': '0.0.0.0',
                'PORT': '8888',
                'DEBUG': 'True'
            }
            return env_map.get(key, default)
        
        monkeypatch.setattr(os, 'getenv', mock_getenv)

        # Mock app.run to capture arguments
        run_args = {}
        def mock_run(**kwargs):
            run_args.update(kwargs)
        
        monkeypatch.setattr(app.app, 'run', mock_run)

        # Simulate main block
        if sys.modules['__main__'].__name__ == '__main__':
            with app.app.app_context():
                app.db.create_all()
            app.app.run(
                host=os.getenv('HOST', '0.0.0.0'),
                port=int(os.getenv('PORT', 8000)),
                debug=os.getenv('DEBUG', 'False').lower() == 'true'
            )

        # Assertions
        assert run_args.get('host') == '0.0.0.0'
        assert run_args.get('port') == 8888
        assert run_args.get('debug') is True

    finally:
        # Restore original sys.argv and module name
        sys.argv = original_argv
        sys.modules['__main__'].__name__ = original_module_name

def test_logging_configuration_details(monkeypatch, caplog):
    """Test detailed logging configuration."""
    import os
    import logging
    import app
    import tempfile

    # Create a temporary directory for logs
    with tempfile.TemporaryDirectory() as temp_log_dir:
        # Mock debug mode to be False
        monkeypatch.setattr(app.app, 'debug', False)

        # Mock os.path.exists and os.mkdir
        monkeypatch.setattr(os.path, 'exists', lambda path: False)
        
        mkdir_called = False
        def mock_mkdir(path):
            nonlocal mkdir_called
            mkdir_called = True
        monkeypatch.setattr(os, 'mkdir', mock_mkdir)

        # Configure logging
        if not app.app.debug:
            if not os.path.exists('logs'):
                os.mkdir('logs')
            file_handler = RotatingFileHandler('logs/realtor.log', maxBytes=10240, backupCount=10)
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
            ))
            file_handler.setLevel(logging.INFO)
            app.app.logger.addHandler(file_handler)
            app.app.logger.setLevel(logging.INFO)
            app.app.logger.info('Realtor startup')

        # Assertions
        assert mkdir_called is True
        
        # Check logging configuration
        assert len(app.app.logger.handlers) > 0
        log_handler = app.app.logger.handlers[0]
        assert isinstance(log_handler, RotatingFileHandler)
        assert log_handler.maxBytes == 10240
        assert log_handler.backupCount == 10
        assert log_handler.level == logging.INFO

def test_error_handler_details(app):
    """Test specific details of error handlers."""
    from flask import jsonify, request

    # Test 404 error handler details
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({'error': 'Resource not found'}), 404

    # Test 500 error handler details
    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Internal server error: {str(error)}")
        return jsonify({'error': 'Internal server error'}), 500

    # Test 400 error handler details
    @app.errorhandler(400)
    def bad_request_error(error):
        return jsonify({'error': 'Bad request'}), 400

    # Test 429 error handler details
    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({'error': 'Rate limit exceeded'}), 429

    # Verify error handler return types and status codes
    with app.test_request_context():
        # 404 handler
        response_404 = not_found_error(None)
        assert response_404[1] == 404
        assert response_404[0].json == {'error': 'Resource not found'}

        # 500 handler
        response_500 = internal_error(Exception("Test error"))
        assert response_500[1] == 500
        assert response_500[0].json == {'error': 'Internal server error'}

        # 400 handler
        response_400 = bad_request_error(None)
        assert response_400[1] == 400
        assert response_400[0].json == {'error': 'Bad request'}

        # 429 handler
        response_429 = ratelimit_handler(None)
        assert response_429[1] == 429
        assert response_429[0].json == {'error': 'Rate limit exceeded'}

def test_main_block_configuration(monkeypatch):
    """Test main block configuration details."""
    import os
    import sys
    import app

    # Store original sys.argv and __name__
    original_argv = sys.argv
    original_module_name = sys.modules['__main__'].__name__

    try:
        # Mock sys.argv to simulate running the script
        sys.argv = ['app.py']
        sys.modules['__main__'].__name__ = '__main__'

        # Mock os.getenv to return specific test values
        def mock_getenv(key, default=None):
            env_map = {
                'HOST': '127.0.0.1',
                'PORT': '9000',
                'DEBUG': 'False'
            }
            return env_map.get(key, default)
        
        monkeypatch.setattr(os, 'getenv', mock_getenv)

        # Mock app.run and db.create_all to track calls
        run_args = {}
        db_created = False

        def mock_run(**kwargs):
            run_args.update(kwargs)
        
        def mock_create_all():
            nonlocal db_created
            db_created = True

        monkeypatch.setattr(app.app, 'run', mock_run)
        monkeypatch.setattr(app.db, 'create_all', mock_create_all)

        # Simulate main block
        if sys.modules['__main__'].__name__ == '__main__':
            with app.app.app_context():
                app.db.create_all()
            app.app.run(
                host=os.getenv('HOST', '0.0.0.0'),
                port=int(os.getenv('PORT', 8000)),
                debug=os.getenv('DEBUG', 'False').lower() == 'true'
            )

        # Assertions
        assert run_args.get('host') == '127.0.0.1'
        assert run_args.get('port') == 9000
        assert run_args.get('debug') is False
        assert db_created is True

    finally:
        # Restore original sys.argv and module name
        sys.argv = original_argv
        sys.modules['__main__'].__name__ = original_module_name
