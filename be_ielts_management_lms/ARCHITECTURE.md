# Architecture Overview

## Project Structure

```
src/
├── app.js                  # Express app configuration
├── server.js              # Server initialization & startup
├── models/                # Mongoose schemas
├── controllers/           # HTTP request handlers
├── services/              # Business logic layer
├── routes/                # API route definitions
├── middleware/            # Express middleware (auth, cache, validation)
├── responses/             # Multi-language response messages
├── config/                # Configuration (Redis, Kafka)
├── cache/                 # Redis caching service
├── events/                # Kafka event producer/consumer
├── db/                    # Database initialization
├── docs/                  # Swagger documentation
├── utils/                 # Utility functions
└── constants/             # Application constants
```

## Architecture Layers

### 1. Routes Layer
- Define API endpoints
- Map URLs to controllers
- Apply middleware (authentication, caching, validation)

### 2. Controllers Layer
- Handle HTTP requests/responses
- Validate input data
- Call service layer
- Return formatted responses

### 3. Services Layer
- Business logic implementation
- Database operations
- Event publishing (Kafka)
- Multi-language error handling

### 4. Models Layer
- Mongoose schemas
- Data validation
- Virtual fields
- Instance methods

## Key Features

### Multi-Language Support
```javascript
const { getMessages } = require("../responses");
const messages = getMessages(lang); // 'en' or 'vi'
throw new AppError(messages.AUTH.USER_NOT_FOUND, 404);
```

### Redis Caching
- Optional feature (controlled by `REDIS_ENABLED` env variable)
- Graceful degradation if Redis is unavailable
- Cache middleware for GET requests
- Cache-aside pattern with `wrap()` method

### Kafka Events
- Optional feature (controlled by `KAFKA_ENABLED` env variable)
- Async event publishing for user actions
- Event consumers for background processing
- Topics: `user.events`, `notification.events`, `analytics.events`

### Authentication
- JWT tokens with access/refresh pattern
- HTTP-only cookies for token storage
- Role-based access control (RBAC)
- Password hashing with bcrypt

### API Documentation
- Swagger UI at `/api-docs`
- Auto-generated from `@swagger` JSDoc comments
- Hot-reload in development mode

## Design Patterns

### 1. Repository Pattern
Services interact with models, controllers interact with services.

### 2. Dependency Injection
Services and utilities are injected into controllers.

### 3. Event-Driven Architecture
Kafka events for async processing and system decoupling.

### 4. Cache-Aside Pattern
Check cache first, load from DB if miss, then cache the result.

### 5. Factory Pattern
Event producer/consumer creation and configuration.

## Environment Configuration

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - HTTP server port

### Optional
- `REDIS_ENABLED` - Enable/disable Redis (default: false)
- `REDIS_URL` - Redis connection URL
- `KAFKA_ENABLED` - Enable/disable Kafka (default: false)
- `KAFKA_BROKERS` - Kafka broker addresses
- `SWAGGER_UI_ENABLED` - Enable/disable Swagger UI (default: true)

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Session data in Redis (if enabled)
- Database connection pooling

### Performance Optimization
- Redis caching for frequently accessed data
- Database indexes on query fields
- Pagination for list endpoints
- Async processing with Kafka

### Monitoring & Logging
- Console logging for development
- Event publishing for analytics
- Health check endpoint at `/health`

## Security Best Practices

### Authentication & Authorization
- JWT tokens with expiration
- HTTP-only cookies (CSRF protection)
- Role-based access control
- Password strength validation

### Data Protection
- Password hashing with bcrypt (10 rounds)
- Sensitive fields excluded from responses
- Input validation middleware
- CORS configuration

### Error Handling
- Custom AppError class
- Global error middleware
- No sensitive data in error messages
- Multi-language error messages

## Development Workflow

### Local Development
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`
3. Configure environment variables
4. Start MongoDB locally or use cloud
5. Run development server: `npm run dev`
6. Access Swagger docs: `http://localhost:3001/api-docs`

### With Redis & Kafka (Optional)
1. Start Redis: `docker run -d -p 6379:6379 redis`
2. Start Kafka: Use Docker Compose or cloud service
3. Set `REDIS_ENABLED=true` and `KAFKA_ENABLED=true` in `.env`
4. Application will gracefully degrade if services are unavailable

### Testing
- Manual testing via Swagger UI
- API testing with Postman/Thunder Client
- Health check: `http://localhost:3001/health`

## Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Setup Redis cluster (if using caching)
- [ ] Setup Kafka cluster (if using events)
- [ ] Disable Swagger UI in production
- [ ] Enable CORS only for trusted origins
- [ ] Setup reverse proxy (nginx)
- [ ] Configure SSL/TLS certificates
- [ ] Setup monitoring and logging service
- [ ] Configure auto-scaling policies
- [ ] Setup database backups
- [ ] Document API for frontend team
