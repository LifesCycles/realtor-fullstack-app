# API Documentation

## Overview

This document describes the RESTful API endpoints available in the Realtor App. All endpoints are prefixed with `/api`.

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 200 requests per day per IP
- 50 requests per hour per IP

## Endpoints

### Properties

#### GET /api/properties
Get a list of all properties.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort field (price, date_listed)
- `order` (optional): Sort order (asc, desc)
- `type` (optional): Property type (house, apartment, condo)
- `min_price` (optional): Minimum price
- `max_price` (optional): Maximum price

**Response:**
```json
{
  "properties": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "price": number,
      "bedrooms": number,
      "bathrooms": number,
      "square_feet": number,
      "property_type": "string",
      "status": "string",
      "location": {
        "latitude": number,
        "longitude": number,
        "address": "string",
        "city": "string",
        "state": "string",
        "zip_code": "string"
      },
      "features": ["string"],
      "images": ["string"],
      "date_listed": "string (ISO 8601)",
      "last_updated": "string (ISO 8601)"
    }
  ],
  "pagination": {
    "current_page": number,
    "total_pages": number,
    "total_items": number,
    "items_per_page": number
  }
}
```

#### GET /api/properties/{id}
Get details of a specific property.

**Parameters:**
- `id`: Property ID (path parameter)

**Response:**
```json
{
  "id": "string",
  "title": "string",
  // ... (same as properties list item)
}
```

#### POST /api/properties
Create a new property listing.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "price": number,
  "bedrooms": number,
  "bathrooms": number,
  "square_feet": number,
  "property_type": "string",
  "location": {
    "latitude": number,
    "longitude": number,
    "address": "string",
    "city": "string",
    "state": "string",
    "zip_code": "string"
  },
  "features": ["string"],
  "images": ["string"]
}
```

**Response:**
```json
{
  "id": "string",
  "message": "Property created successfully",
  // ... (created property details)
}
```

#### PUT /api/properties/{id}
Update an existing property.

**Parameters:**
- `id`: Property ID (path parameter)

**Request Body:**
```json
{
  // ... (same as POST, all fields optional)
}
```

**Response:**
```json
{
  "message": "Property updated successfully",
  // ... (updated property details)
}
```

#### DELETE /api/properties/{id}
Delete a property listing.

**Parameters:**
- `id`: Property ID (path parameter)

**Response:**
```json
{
  "message": "Property deleted successfully"
}
```

### Search

#### GET /api/properties/search
Search for properties using various criteria.

**Query Parameters:**
- `q` (optional): Search query string
- `location` (optional): Location search string
- `type` (optional): Property type
- `min_price` (optional): Minimum price
- `max_price` (optional): Maximum price
- `min_beds` (optional): Minimum bedrooms
- `min_baths` (optional): Minimum bathrooms
- `min_sqft` (optional): Minimum square footage
- `max_sqft` (optional): Maximum square footage
- `features` (optional): Comma-separated list of features
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "results": [
    // ... (property objects)
  ],
  "pagination": {
    // ... (pagination details)
  }
}
```

### Authentication

#### POST /api/auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": number
}
```

#### POST /api/auth/refresh
Refresh JWT token.

**Request Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": number
}
```

### Users

#### GET /api/users/me
Get current user profile.

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "created_at": "string (ISO 8601)",
  "last_login": "string (ISO 8601)"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": {
    "field": ["error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "retry_after": number
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Webhooks

The API supports webhooks for real-time updates. Configure webhook endpoints in your account settings.

### Events
- `property.created`
- `property.updated`
- `property.deleted`
- `user.registered`

### Webhook Payload
```json
{
  "event": "string",
  "timestamp": "string (ISO 8601)",
  "data": {
    // Event-specific data
  }
}
```
