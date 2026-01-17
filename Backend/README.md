# Express TypeScript Backend API

A production-ready Express backend built with TypeScript, featuring JWT authentication, request validation, and Prisma ORM.

## Features

- ✅ **TypeScript** - Type-safe codebase
- ✅ **Express.js** - Fast and minimalist web framework
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Express Validation** - Request validation using express-validator
- ✅ **Prisma ORM** - Modern database toolkit
- ✅ **Error Handling** - Centralized error management
- ✅ **Security** - Helmet for security headers, CORS enabled
- ✅ **Logging** - Morgan for HTTP request logging
- ✅ **Clean Architecture** - Separation of concerns (routes, controllers, services)
- ✅ **Role-Based Access Control** - Admin and user roles

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/             # Database migrations
├── src/
│   ├── config/
│   │   └── database.ts        # Prisma client configuration
│   ├── controllers/
│   │   ├── auth.controller.ts # Authentication controllers
│   │   └── user.controller.ts # User management controllers
│   ├── middleware/
│   │   ├── auth.middleware.ts # Authentication & authorization
│   │   ├── errorHandler.ts    # Error handling
│   │   └── validation.middleware.ts # Request validation
│   ├── routes/
│   │   ├── auth.routes.ts     # Authentication routes
│   │   └── user.routes.ts     # User management routes
│   ├── services/
│   │   └── user.service.ts    # Business logic for users
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── utils/
│   │   └── jwt.ts             # JWT utilities
│   └── index.ts               # Application entry point
├── .env                       # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the backend directory
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### User Management Routes (Admin Only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer <token>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Updated Name",
  "lastName": "Updated Last Name",
  "role": "ADMIN"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

### Health Check
```http
GET /health
```

## Validation Rules

### Registration
- **Email**: Must be a valid email address
- **Username**: 3-30 characters, alphanumeric + underscores
- **Password**: Minimum 8 characters, must contain uppercase, lowercase, and number

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "stack": "Error stack trace (development only)"
}
```

## Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

## Database Schema

### User Model
- `id`: String (CUID)
- `email`: String (Unique)
- `username`: String (Unique)
- `password`: String (Hashed)
- `firstName`: String (Optional)
- `lastName`: String (Optional)
- `role`: String (Default: USER)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable Cross-Origin Resource Sharing
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: express-validator for all requests
- **Authorization**: Role-based access control

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - ORM for database operations
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logger
- **dotenv** - Environment variable management

## License

ISC

## Author

Built as a production-ready backend template for real-world applications.
