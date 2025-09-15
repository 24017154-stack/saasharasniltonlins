# Architecture Documentation

## System Overview

Haras Nilton Lins is a SaaS platform for managing horse riding lessons, student subscriptions, and scheduling. The system is built as a monorepo with a clear separation between backend and frontend applications.

## Architecture Components

### 1. Backend (NestJS + PostgreSQL)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with native SQL queries (no ORM for performance)
- **Authentication**: JWT with bcrypt password hashing
- **Caching**: Redis for session storage and background jobs
- **Email**: Nodemailer with SMTP (Mailhog for development)
- **API Documentation**: Swagger/OpenAPI

#### Modules Structure:
- **Auth Module**: JWT authentication, role-based access control
- **Users Module**: Admin and instructor management
- **Students Module**: Student CRUD operations, subscription management
- **Plans Module**: Subscription plan management (read-only)
- **Bookings Module**: Lesson scheduling and attendance tracking
- **Holidays Module**: Holiday and blocked date management
- **Invoices Module**: Payment tracking and subscription billing
- **Dashboard Module**: Analytics and overview metrics
- **Health Module**: Service health checks

#### Key Services:
- **Database Service**: SQL query builder with connection pooling
- **Credit Ledger Manager**: Student credit tracking and consumption
- **Availability Calculator**: Slot availability with holiday/blocked time constraints
- **Payment Provider Interface**: Pluggable payment system (Mock + Stripe)
- **Notification Scheduler**: Background email notifications (BullMQ)

### 2. Frontend (Next.js + Tailwind)
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Hook Form + Zod validation
- **Calendar**: FullCalendar for lesson scheduling
- **Authentication**: JWT stored in httpOnly cookies via API routes

#### Page Structure:
- **Auth**: Login page with role-based redirects
- **Dashboard**: Overview metrics and quick actions
- **Students**: CRUD interface with search and filtering
- **Calendar**: Week/day views for lesson scheduling
- **Plans**: Read-only subscription plan listing
- **Holidays**: Admin-only holiday management
- **Invoices**: Payment status tracking (admin view)

### 3. Shared Package
- **Types**: TypeScript interfaces shared between frontend/backend
- **API Client**: Generated client with typed endpoints
- **Validation Schemas**: Zod schemas for form validation

### 4. Database Schema
- **Users**: Admin and instructor accounts
- **Students**: Student profiles and medical information
- **Plans**: Subscription plans with pricing and credits
- **Subscriptions**: Active student subscriptions
- **Credit Ledger**: Audit trail for credit transactions
- **Invoices**: Payment tracking and billing
- **Time Slots**: Available lesson time slots by day
- **Bookings**: Scheduled lessons with attendance tracking
- **Holidays**: System-wide blocked dates
- **Blocked Slots**: Instructor-specific unavailability
- **Notification Queue**: Scheduled email notifications

## Security Features

### Authentication & Authorization
- JWT tokens with configurable expiration
- Role-based access control (ADMIN, INSTRUCTOR)
- Password hashing with bcrypt (salt rounds: 10)
- Protected API routes with guard decorators

### Data Protection
- Input validation with class-validator
- SQL injection prevention with parameterized queries
- CORS configuration for frontend access
- Environment variable validation

### Business Logic Security
- Credit consumption validation before booking
- Cancellation window enforcement for refunds
- Instructor-only access to their bookings
- Admin-only access to financial data

## Payment Integration

### Payment Provider Interface
```typescript
interface PaymentProvider {
  createInvoice(amount: number, studentId: string): Promise<Invoice>
  processWebhook(payload: any): Promise<PaymentResult>
  refundPayment(invoiceId: string): Promise<RefundResult>
}
```

### Supported Providers
- **Mock Provider**: Default for development/testing
- **Stripe Provider**: Production payment processing (stub included)

## Notification System

### Email Templates
- Booking confirmations
- Cancellation notifications
- Payment reminders
- Class reminders (24h before)

### Delivery
- SMTP via Nodemailer
- Background processing with BullMQ
- Retry logic for failed deliveries
- Development testing via Mailhog

## Configuration Management

### Environment Variables
- Database connection strings
- JWT secrets and expiration
- Email SMTP configuration
- Payment provider credentials
- Business logic settings (cancellation window, timezone)

### Feature Flags
- Payment provider selection
- Email delivery toggle
- Debug logging levels

## Monitoring & Health Checks

### Health Endpoints
- `/health`: Basic service status
- Database connectivity checks
- Redis connection validation

### Logging
- Structured logging with context
- Error tracking and alerting
- Performance monitoring

## Development Workflow

### Local Development
1. Database migration via `yarn migrate`
2. Seed data via `yarn seed`
3. Start services via `docker-compose up`
4. Access Swagger docs at `/api/docs`

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Database transaction rollback for test isolation

### Deployment
- Docker containers for all services
- Environment-specific configurations
- Database migration automation
- Health check integration with orchestration

## Scalability Considerations

### Database
- Connection pooling for concurrent requests
- Indexed queries for performance
- Read replicas for analytics queries
- Backup and disaster recovery

### Caching
- Redis for session storage
- API response caching for read-heavy endpoints
- Background job queue management

### Monitoring
- Application performance monitoring
- Database query optimization
- Cache hit ratio tracking
- Error rate monitoring