[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Node.js Express TypeScript Boilerplate

A comprehensive, production-ready Node.js API boilerplate built with Express, TypeScript, and modern best practices.

## Features

- 🚀 **Express.js** - Fast, unopinionated web framework
- 🔷 **TypeScript** - Full type safety and excellent IDE support
- 🗄️ **Prisma** - Modern database toolkit with type-safe queries
- 🔐 **JWT Authentication** - Secure authentication with refresh tokens
- 📝 **Swagger Documentation** - Interactive API documentation
- 🛡️ **Security** - Helmet, CORS, rate limiting, and input validation
- 📊 **Logging** - Winston logger with structured logging
- 🧪 **Testing** - Vitest for unit and integration testing
- 🔧 **Code Quality** - ESLint, Prettier, and Husky pre-commit hooks
- 📦 **Validation** - Zod schema validation
- 🏥 **Health Checks** - Comprehensive health monitoring

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── database.ts      # Database configuration
│   ├── env.ts          # Environment validation
│   └── swagger.ts      # Swagger documentation setup
├── controllers/         # Request handlers
│   ├── authController.ts
│   ├── userController.ts
│   └── healthController.ts
├── middleware/          # Custom middleware
│   ├── auth.ts         # Authentication middleware
│   ├── errorHandler.ts # Error handling
│   └── requestLogger.ts
├── routes/             # API routes
│   ├── auth.ts
│   ├── users.ts
│   └── health.ts
├── services/           # Business logic
│   ├── authService.ts
│   └── userService.ts
├── utils/              # Utility functions
│   ├── errors.ts       # Custom error classes
│   ├── jwt.ts         # JWT utilities
│   ├── logger.ts      # Logging utilities
│   ├── password.ts    # Password utilities
│   ├── response.ts    # Response helpers
│   └── validation.ts  # Validation schemas
├── types/              # TypeScript type definitions
├── database/           # Database related files
│   ├── connection.ts
│   └── seed.ts
├── test/               # Test files
└── index.ts           # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shariq104/node-typescript-starter.git
cd node-typescript-starter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Configure your `.env` file:
```env
NODE_ENV=development
PORT=3001
HOST=localhost
DATABASE_URL="postgresql://username:password@localhost:5432/boilerplate_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:3000
```

5. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:3001/api-docs`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/logout-all` - Logout from all devices
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - Get all users (Admin/Moderator only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/profile/me` - Get current user profile
- `PUT /api/users/profile/me` - Update current user profile
- `POST /api/users/change-password` - Change password

### Health
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health check with database connectivity

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```

### Token Types

- **Access Token**: Short-lived token for API access (default: 7 days)
- **Refresh Token**: Long-lived token for refreshing access tokens (default: 30 days)

## Database

This boilerplate uses Prisma as the database toolkit with PostgreSQL. The database schema includes:

- **Users**: User accounts with roles and authentication
- **RefreshTokens**: JWT refresh token storage

### Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String
  role          UserRole  @default(USER)
  isActive      Boolean   @default(true)
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum UserRole {
  ADMIN
  USER
  MODERATOR
}
```

## Error Handling

The API uses a centralized error handling system with custom error classes:

- `ValidationError` (400) - Input validation errors
- `UnauthorizedError` (401) - Authentication required
- `ForbiddenError` (403) - Insufficient permissions
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Resource already exists
- `AppError` (500) - Generic application errors

## Validation

Input validation is handled using Zod schemas. All request data is validated before processing.

## Logging

The application uses Winston for structured logging with different log levels:

- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `debug` - Debug messages

## Testing

The project includes comprehensive tests using Vitest:

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Zod schema validation
- **Password Hashing**: bcryptjs for password security
- **JWT Security**: Secure token handling
- **SQL Injection Protection**: Prisma ORM protection

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3001` |
| `HOST` | Server host | `localhost` |
| `DATABASE_URL` | Database connection string | Required |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | Access token expiration | `7d` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `30d` |
| `CORS_ORIGIN` | CORS origin | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `LOG_LEVEL` | Logging level | `info` |

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup

Make sure to set the appropriate environment variables for your production environment.

### Docker (Optional)

You can containerize the application using Docker:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
