# Haras Nilton Lins SaaS Platform

A comprehensive SaaS platform for managing horse riding lessons, student subscriptions, scheduling, and payments.

## 🚀 Features

- **Student Management**: Complete CRUD operations with medical notes and emergency contacts
- **Subscription Plans**: Flexible credit-based subscription system
- **Lesson Scheduling**: Calendar-based booking with availability management
- **Payment Processing**: Integrated payment system with invoice tracking
- **Holiday Management**: System-wide and recurring holiday management
- **Role-Based Access**: Admin and instructor roles with appropriate permissions
- **Real-time Dashboard**: Analytics and overview metrics
- **Email Notifications**: Automated booking confirmations and reminders

## 🏗️ Architecture

This is a monorepo containing:

- **Backend** (`apps/backend`): NestJS + TypeScript + PostgreSQL
- **Frontend** (`apps/web`): Next.js + TypeScript + Tailwind CSS
- **Shared** (`packages/shared`): Common types and API client
- **Database** (`db/`): Schema and seed scripts
- **Documentation** (`docs/`): Architecture and timeline docs

## 🛠️ Technology Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with native SQL queries
- **Authentication**: JWT with bcrypt
- **Caching**: Redis
- **Email**: Nodemailer (SMTP)
- **Jobs**: BullMQ for background processing
- **API Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Calendar**: FullCalendar
- **HTTP Client**: Generated from OpenAPI spec

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Development**: Hot reload, live updates
- **Monitoring**: Health checks and logging

## 📋 Prerequisites

- Node.js 18+ and Yarn
- Docker and Docker Compose
- PostgreSQL 15+ (for production)
- Redis (for production)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd saasharasniltonlins
yarn install
```

### 2. Environment Setup

Copy environment files and configure:

```bash
# Root environment (optional)
cp .env.example .env

# Backend environment
cp apps/backend/.env.example apps/backend/.env

# Frontend environment  
cp apps/web/.env.example apps/web/.env
```

### 3. Start Development Environment

```bash
# Start all services with Docker
yarn docker:up

# Or start individually
yarn dev  # Starts backend and frontend
```

### 4. Database Setup

```bash
# Run migrations (create tables)
yarn migrate

# Seed initial data
yarn seed
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Mailhog (Email Testing)**: http://localhost:8025
- **Database**: localhost:5432 (haras_db/haras_user/haras_password)

## 🔐 Default Credentials

After seeding the database:

- **Admin**: admin@harasniltonlins.com / admin123
- **Instructor**: instructor@harasniltonlins.com / instructor123

## 📁 Project Structure

```
saasharasniltonlins/
├── apps/
│   ├── backend/           # NestJS API server
│   │   ├── src/
│   │   │   ├── auth/      # Authentication module
│   │   │   ├── students/  # Student management
│   │   │   ├── plans/     # Subscription plans
│   │   │   ├── bookings/  # Lesson scheduling
│   │   │   ├── holidays/  # Holiday management
│   │   │   ├── dashboard/ # Analytics
│   │   │   └── health/    # Health checks
│   │   └── scripts/       # Migration & seed scripts
│   └── web/               # Next.js frontend
│       ├── app/           # App Router pages
│       ├── components/    # Reusable components
│       ├── lib/           # Utilities and API client
│       └── types/         # TypeScript types
├── packages/
│   └── shared/            # Shared types and API client
├── db/
│   ├── schema.sql         # Database schema
│   └── seed/              # Seed data scripts
├── docs/                  # Documentation
├── docker/                # Docker configurations
└── .github/workflows/     # CI/CD pipelines
```

## 🎯 Available Scripts

### Root Level
```bash
yarn dev           # Start backend + frontend
yarn build         # Build all applications
yarn lint          # Lint all applications
yarn typecheck     # Type check all applications
yarn test          # Run all tests
yarn migrate       # Run database migrations
yarn seed          # Seed database with initial data
yarn docker:up     # Start Docker services
yarn docker:down   # Stop Docker services
```

### Backend (`apps/backend`)
```bash
yarn dev           # Start development server
yarn build         # Build for production
yarn start:prod    # Start production server
yarn test          # Run tests
yarn lint          # Lint code
yarn typecheck     # Type check
yarn migrate       # Run database migrations
yarn seed          # Seed database
```

### Frontend (`apps/web`)
```bash
yarn dev           # Start development server
yarn build         # Build for production
yarn start         # Start production server
yarn lint          # Lint code
yarn typecheck     # Type check
```

## 🔧 Configuration

### Environment Variables

#### Backend (`apps/backend/.env`)
```bash
# Database
DATABASE_URL=postgresql://haras_user:haras_password@localhost:5432/haras_db
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Email (SMTP)
SMTP_HOST=localhost
SMTP_PORT=1025
EMAIL_FROM=noreply@harasniltonlins.com

# Business Configuration
CANCELLATION_REFUND_WINDOW_HOURS=12
TIMEZONE=America/Sao_Paulo
LANGUAGE=pt-BR

# Payment (Stripe - optional)
STRIPE_SECRET_KEY=sk_test_...
PAYMENT_PROVIDER=mock  # or 'stripe'
```

#### Frontend (`apps/web/.env`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Business Rules Configuration

- **Cancellation Window**: 12 hours before class start (configurable)
- **Class Reminders**: 24 hours before class (configurable)
- **Timezone**: America/Sao_Paulo (configurable)
- **Language**: pt-BR (configurable)

## 🧪 Testing

### Backend Tests
```bash
cd apps/backend
yarn test          # Unit tests
yarn test:e2e      # End-to-end tests
yarn test:cov      # Coverage report
```

### Frontend Tests
```bash
cd apps/web
yarn test          # Component tests
```

## 🚀 Deployment

### Development
```bash
yarn docker:up    # Full development stack
```

### Production
```bash
yarn build         # Build all applications
docker-compose -f docker-compose.prod.yml up
```

## 📖 API Documentation

The API is fully documented with OpenAPI/Swagger:

- **Local**: http://localhost:3001/api/docs
- **Live Documentation**: Interactive API explorer
- **Type Generation**: Automatic TypeScript client generation

### Key API Endpoints

- `POST /auth/login` - User authentication
- `GET /students` - List students with filters
- `POST /students` - Create new student
- `GET /plans` - List subscription plans
- `POST /students/:id/renew` - Renew student subscription
- `GET /calendar/availability` - Get available time slots
- `POST /bookings` - Create lesson booking
- `GET /holidays` - List holidays
- `GET /dashboard/overview` - Dashboard metrics

## 🔒 Security

- **Authentication**: JWT with configurable expiration
- **Authorization**: Role-based access control (ADMIN, INSTRUCTOR)
- **Input Validation**: Comprehensive validation with class-validator
- **SQL Injection Prevention**: Parameterized queries only
- **Password Security**: bcrypt with salt rounds
- **CORS**: Configured for frontend access only

## 📊 Monitoring

### Health Checks
- `GET /health` - Basic service health
- Database connectivity validation
- Redis connection monitoring

### Development Tools
- **Mailhog**: Email testing at http://localhost:8025
- **Swagger UI**: API documentation at http://localhost:3001/api/docs
- **Hot Reload**: Automatic backend/frontend reloading

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes and test thoroughly**
4. **Commit with clear messages**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

### Development Guidelines

- Follow TypeScript strict mode
- Use conventional commit messages
- Write tests for new features
- Update documentation
- Ensure CI/CD passes

## 📞 Support

- **Documentation**: See `docs/` directory
- **API Reference**: http://localhost:3001/api/docs
- **Issues**: Use GitHub Issues for bug reports
- **Architecture**: See `docs/architecture.md`
- **Timeline**: See `docs/timeline.md`

## 📄 License

This project is proprietary software for Haras Nilton Lins.

---

## 🎯 Getting Started Checklist

- [ ] Clone repository and install dependencies
- [ ] Copy and configure environment files
- [ ] Start Docker services (`yarn docker:up`)
- [ ] Run database migrations (`yarn migrate`)
- [ ] Seed initial data (`yarn seed`)
- [ ] Access frontend at http://localhost:3000
- [ ] Login with admin@harasniltonlins.com / admin123
- [ ] Explore API docs at http://localhost:3001/api/docs
- [ ] Test email functionality at http://localhost:8025

**Happy coding! 🐎✨**