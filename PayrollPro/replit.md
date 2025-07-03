# OCCUR-CALL - AI-Powered Payroll Management System

## Overview

OCCUR-CALL is a comprehensive, production-ready payroll management system specifically designed for Moroccan businesses. The application features AI-powered insights, automated calculations, and full compliance with local labor laws including CNSS, IGR, and AMO regulations. Built as a full-stack web application, it provides a modern, glassmorphism-styled interface with multi-language support (French, Arabic, Darija, English, Spanish).

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Radix UI components with custom glassmorphism styling
- **Styling**: Tailwind CSS with CSS variables for theming
- **Component Library**: Shadcn/ui components following the "new-york" style

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript throughout
- **API Pattern**: RESTful APIs with structured route handlers
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

### Database Architecture
- **Primary Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Connection**: Neon serverless connection with WebSocket support
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`

## Key Components

### Core Business Logic
1. **Employee Management**: Complete lifecycle management with profiles and document handling
2. **Payroll Calculator**: Automated calculations with Morocco-specific tax rules (2025 rates)
3. **Attendance Tracking**: Time and attendance management with rate calculations
4. **Compliance Engine**: Real-time compliance checks against Moroccan labor laws
5. **Document Generation**: Automated generation of payslips, CNSS reports, and official documents

### AI Integration
- **AI Agent Service**: OpenAI GPT-4o integration for Moroccan labor law expertise
- **Smart Document Processing**: OCR capabilities for payroll document extraction
- **Compliance Assistant**: Automated anomaly detection and compliance recommendations
- **Multi-language AI**: Supports queries in French, Arabic, Darija, English, and Spanish

### Authentication & Authorization
- **Replit Auth**: Integrated OIDC authentication system
- **Role-based Access**: Support for admin, HR, manager, employee, accounting, and social roles
- **Session Management**: Secure session handling with PostgreSQL storage
- **Company Association**: Users are associated with specific companies for data isolation

### UI/UX Features
- **Glassmorphism Design**: Modern glass-effect styling with backdrop blur
- **Responsive Design**: Mobile-first approach with bottom navigation for mobile
- **Dark/Light Theme**: System preference detection with manual toggle
- **Multi-language Support**: Complete internationalization system
- **Progressive Enhancement**: Graceful degradation for various device capabilities

## Data Flow

### Request Processing
1. Client requests are handled by Express middleware stack
2. Authentication middleware validates user sessions
3. Route handlers process business logic and database operations
4. Responses are formatted and returned with appropriate status codes

### Database Operations
1. Drizzle ORM provides type-safe database operations
2. Schema definitions are shared between client and server
3. Connection pooling via Neon serverless for optimal performance
4. Automatic migration handling through Drizzle Kit

### AI Processing
1. User questions are processed by the AI Agent service
2. Context is provided from current user and company data
3. OpenAI API processes requests with specialized prompts for Moroccan labor law
4. Responses are categorized and confidence-scored before returning

## External Dependencies

### Core Runtime Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **openai**: AI integration for intelligent assistance
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React routing

### UI Dependencies
- **@radix-ui/***: Comprehensive component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management
- **react-hook-form**: Form state management

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database schema management
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: Neon PostgreSQL with environment-based configuration
- **Environment Variables**: DATABASE_URL, OPENAI_API_KEY, SESSION_SECRET required

### Production Deployment
- **Build Process**: Vite builds client, esbuild bundles server
- **Server**: Node.js production server serving static files and API
- **Database**: Production PostgreSQL via Neon with connection pooling
- **Static Assets**: Served via Express with appropriate caching headers

### Configuration Management
- **Environment Variables**: Centralized configuration via .env files
- **Database Migrations**: Automated via Drizzle Kit push commands
- **API Keys**: Secure handling of OpenAI and database credentials

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```