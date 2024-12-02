# Realtor Backend Application

## Overview
This is a Flask-based backend application for a Realtor platform, providing robust property management APIs with comprehensive testing and error handling.

## Features
- RESTful API for property management
- Comprehensive test coverage (96%)
- Error handling and logging
- Rate limiting
- Database integration with SQLAlchemy
- Secure configuration management

## Prerequisites
- Python 3.12+
- pip
- virtualenv (recommended)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/realtor-opensource.git
cd realtor-opensource/backend
```

### 2. Create Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file in the `backend` directory with the following variables:
```
ENV=development
HOST=0.0.0.0
PORT=8000
DEBUG=True
REDIS_URL=redis://localhost:6379/0
DB_POOL_SIZE=5
DB_POOL_TIMEOUT=30
DB_POOL_RECYCLE=1800
```

### 5. Run the Application
```bash
python app.py
```

### 6. Run Tests
```bash
pytest --cov=. --cov-report=term-missing
```

## API Endpoints
- `GET /properties`: List properties
- `GET /properties/<id>`: Get specific property
- `POST /properties`: Create a new property
- `PUT /properties/<id>`: Update a property
- `DELETE /properties/<id>`: Delete a property
- `/health`: Health check endpoint

## Project Structure
```
backend/
│
├── app.py                 # Main application entry point
├── models/                # Database models
│   └── property.py        # Property model definition
│
├── routes/                # API route definitions
│   └── property_routes.py # Property-related routes
│
├── tests/                 # Test suite
│   └── test_app.py        # Comprehensive application tests
│
├── requirements.txt       # Project dependencies
└── .env                   # Environment configuration
```

## Technologies
- Flask
- SQLAlchemy
- Pytest
- Flask-Limiter
- Redis (optional, for rate limiting)

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## AI Development Assistance
This project was developed with the assistance of AI technologies, specifically using Codeium's AI coding assistant. While AI helped in code generation and problem-solving, all code has been carefully reviewed and is the intellectual property of the project's human developers.

Key AI Contributions:
- Code generation and refactoring
- Comprehensive test suite development
- Error handling and configuration optimization
- Documentation assistance

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Your Name - your.email@example.com

Project Link: [https://github.com/YOUR_GITHUB_USERNAME/realtor-opensource](https://github.com/YOUR_GITHUB_USERNAME/realtor-opensource)
