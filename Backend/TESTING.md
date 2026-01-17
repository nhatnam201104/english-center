# API Testing Guide

## Server Status
✅ Server is running on http://localhost:8081

## Test the API

You can test the API using tools like:
- **Postman** (Recommended)
- **cURL** (Command line)
- **Thunder Client** (VS Code extension)
- **Insomnia** (Desktop app)

## Test Cases

### 1. Health Check
```bash
curl http://localhost:8081/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Register a New User
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### 3. Login
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Get Profile (Protected Route)
```bash
curl -X GET http://localhost:8081/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with the token from login/register response.

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "USER"
  }
}
```

### 5. Get All Users (Admin Only - First Create Admin)

First, manually update a user to admin role in the database, then:

```bash
curl -X GET http://localhost:8081/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## Common Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Not Found - /api/unknown-route"
}
```

### Conflict Error (409)
```json
{
  "success": false,
  "message": "Email already registered"
}
```

## Testing with Postman

1. **Create a new collection** called "Express TypeScript Backend"
2. **Add requests** for each endpoint
3. **Set up environments**:
   - Create variables: `baseUrl`, `token`
   - Set `baseUrl` to `http://localhost:8081`
4. **Use the token** from login/register in protected routes

## Testing Authentication Flow

1. Register a new user → Get token
2. Use token to access protected routes → `/api/auth/profile`
3. Token expires in 7 days (configurable via `.env`)
4. Login again to get new token

## Database Management

### View Database
```bash
npm run prisma:studio
```

This opens Prisma Studio to view/edit data in the database.

### Reset Database
```bash
# Delete database file
rm dev.db

# Re-run migrations
npm run prisma:migrate
```

## Validation Rules Summary

| Field | Rules |
|--------|--------|
| email | Valid email format, unique |
| username | 3-30 chars, alphanumeric + underscores, unique |
| password | Min 8 chars, 1 uppercase, 1 lowercase, 1 number |
| firstName | Optional, max 50 chars |
| lastName | Optional, max 50 chars |

## Security Notes

- **Passwords are hashed** using bcryptjs with salt rounds
- **JWT tokens** are used for authentication
- **Never expose passwords** in API responses
- **CORS is enabled** for frontend integration
- **Helmet** provides security headers

## Troubleshooting

### Server won't start
- Check if port 8081 is already in use
- Verify `.env` file exists and is configured correctly

### Database errors
- Ensure `dev.db` file exists in project root
- Re-run `npm run prisma:generate`
- Re-run `npm run prisma:migrate`

### Validation errors
- Check password requirements
- Verify email format
- Ensure username is unique

### Token errors
- Ensure you're sending `Authorization: Bearer <token>` header
- Check if token has expired (7 days default)
- Verify token format (no extra spaces)

## Production Deployment Checklist

- [ ] Update `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Use environment-specific database (PostgreSQL/MySQL instead of SQLite)
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up logging (Winston, etc.)
- [ ] Add input sanitization
- [ ] Implement refresh token mechanism
- [ ] Add unit and integration tests
