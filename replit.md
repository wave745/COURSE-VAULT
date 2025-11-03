# IUO Student Archive

## Overview

IUO Student Archive is a student-driven digital library for Igbinedion University Okada (IUO). The platform enables students to browse, upload, and download course materials organized by college, department, level, and course. It serves as a centralized repository for study materials including PDFs, images, documents, and other educational resources shared across the university community.

The application follows a traditional academic hierarchy: Colleges → Departments → Courses (by Level) → Files, allowing students to navigate through their specific program structure to find relevant materials.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React with TypeScript using Vite as the build tool
- Client-side routing via Wouter (lightweight React Router alternative)
- State management through TanStack Query (React Query) for server state synchronization
- Form handling with React Hook Form and Zod schema validation

**UI Component System**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui design system (New York variant) with Tailwind CSS
- Material Design principles adapted for academic context
- Custom theming with CSS variables supporting light/dark modes
- Typography: Inter font for UI, JetBrains Mono for monospaced elements (course codes, file names)

**Design Philosophy**
- Mobile-first responsive design
- Information-dense layouts with strong visual hierarchy
- Utility-focused interactions prioritizing upload/download workflows
- Academic trust through professional, credible appearance

**Key Frontend Features**
- Breadcrumb navigation for deep hierarchies
- Level-based course filtering (100L-600L)
- File type indicators (PDF, images, DOCX) with visual differentiation
- Search functionality across colleges, departments, and courses
- User reputation system and profile management
- Theme toggle (light/dark mode)

### Backend Architecture

**Server Framework**
- Express.js on Node.js
- TypeScript throughout (shared types between client/server)
- RESTful API design with `/api/*` routes

**Data Layer**
- Drizzle ORM for type-safe database interactions
- PostgreSQL database via Neon serverless (configured for WebSocket connections)
- Database schema includes: users, colleges, departments, courses, files, downloads
- Migration system through Drizzle Kit with SQL-based schema initialization

**Storage Strategy**
- Dual implementation pattern: in-memory storage (development) and database storage (production)
- Interface-based storage abstraction (`IStorage`) allowing swappable implementations
- Seed data for colleges and departments (IUO's actual academic structure)

**API Endpoints Structure**
- College browsing: `/api/colleges`, `/api/colleges/:slug`, `/api/colleges/:slug/departments`
- Department lookup: `/api/departments/:slug`
- Course management: by department, level, and code
- File operations: CRUD operations with download tracking
- User management and authentication (prepared but not fully implemented)

**Authentication & Sessions**
- Prepared infrastructure for session management (connect-pg-simple)
- User schema includes username, password, reputation system
- Cookie-based authentication pattern (credentials: "include" in fetch)

### Data Schema Design

**Academic Hierarchy**
- Colleges: Top-level academic divisions (8 colleges including Arts, Engineering, Health Sciences, Law, etc.)
- Departments: Belong to colleges with unique slugs for routing
- Courses: Linked to departments, organized by level (100-600) and semester
- Files: Attached to courses with verification status, download tracking, file metadata

**User & Reputation System**
- User profiles with display names and reputation scores
- Download tracking for analytics
- Verification system for file quality control (verified flag on files)

**Content Organization**
- Course identification via code + department + level (composite key pattern)
- Find-or-create pattern for courses during upload flow
- Slug-based routing for SEO-friendly URLs

## External Dependencies

### Database & ORM
- **Neon Serverless PostgreSQL**: Cloud-native PostgreSQL with WebSocket support
- **Drizzle ORM**: Type-safe SQL query builder and schema management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Comprehensive set of accessible, unstyled React primitives (accordion, dialog, dropdown, popover, tabs, toast, etc.)
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority (CVA)**: Component variant management
- **Framer Motion**: Animation library for page transitions and micro-interactions

### Forms & Validation
- **React Hook Form**: Performant form state management
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Bridge between React Hook Form and Zod

### Data Fetching & State
- **TanStack Query (React Query)**: Server state management with caching, background updates, and optimistic UI
- **date-fns**: Date formatting and manipulation

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across entire stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit-specific plugins**: Runtime error modal, cartographer, dev banner (development environment integration)

### Routing
- **Wouter**: Minimalist React router (lighter alternative to React Router)

### File Handling
- Upload form validation through Zod schemas
- File type detection and categorization (PDF, image, DOCX, other)
- File size tracking and display

### Google Fonts
- Inter: Primary UI font (300-800 weights)
- JetBrains Mono: Monospace font for technical content (400-600 weights)