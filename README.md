# Express + TypeScript + Prisma Backend & Next.js Frontend

A complete full-stack project built with an Express.js backend (TypeScript, Prisma ORM, Supabase PostgreSQL, Zod) and a Next.js frontend (App Router, TypeScript, Axios, Basic CSS).

---

## Project Structure

```
antigr/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Prisma schema with User and Post models
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.ts          # PrismaClient singleton
│   │   ├── controllers/
│   │   │   ├── user.controller.ts # User HTTP request/response handlers
│   │   │   └── post.controller.ts # Post HTTP request/response handlers
│   │   ├── errors/
│   │   │   └── ApiError.ts        # Custom ApiError class with status codes
│   │   ├── middlewares/
│   │   │   ├── errorHandler.ts    # Centralized error handler (ApiError, Prisma, Zod)
│   │   │   └── notFound.ts        # 404 handler for unmatched routes
│   │   ├── routes/
│   │   │   ├── index.ts           # Root API router (/api/health, /api/users, /api/posts)
│   │   │   ├── user.routes.ts     # User endpoints (GET, POST)
│   │   │   └── post.routes.ts     # Post endpoints (GET, POST)
│   │   ├── services/
│   │   │   ├── user.service.ts    # User business logic and Prisma queries
│   │   │   └── post.service.ts    # Post business logic and relational Prisma queries
│   │   ├── types/
│   │   │   └── express.d.ts       # Express declaration file
│   │   ├── app.ts                 # Express application configuration
│   │   └── server.ts              # HTTP server entry point with graceful shutdown
│   ├── .env                       # Local environment variables
│   ├── .env.example               # Example environment variables for Supabase
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css        # Minimal CSS styling
│   │   │   ├── layout.tsx         # Next.js root layout
│   │   │   └── page.tsx           # Dashboard with Users, Create Post, and Posts sections
│   │   ├── services/
│   │   │   ├── api.ts             # Axios client instance
│   │   │   ├── user.service.ts    # User API service functions
│   │   │   └── post.service.ts    # Post API service functions
│   │   └── types/
│   │       └── index.ts           # TypeScript models and API interfaces
│   ├── .env.local                 # Frontend environment variables (NEXT_PUBLIC_API_URL)
│   ├── .env.example
│   ├── .gitignore
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                   # Root orchestrator scripts
└── README.md
```

---

## 1. Backend Setup & Configuration

### Prerequisites
- Node.js (>= 18.18, tested on v24.12.0)
- npm

### Installation
```bash
cd backend
npm install
```

### Environment Variables
Edit `backend/.env` with your Supabase PostgreSQL credentials:
- **`DATABASE_URL`**: Supabase Transaction Connection Pooler URL (Port `6543`, with `?pgbouncer=true`).
- **`DIRECT_URL`**: Supabase Direct Connection URL (Port `5432`) used for running migrations.
- **`PORT`**: Default `5000`.
- **`NODE_ENV`**: `development` or `production`.

Example `.env`:
```env
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
PORT=5000
NODE_ENV=development
```

### Prisma Commands
```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations once Supabase credentials are configured
npm run prisma:migrate

# Open Prisma Studio to browse data
npm run prisma:studio
```

### Run Backend
```bash
# Development (with hot-reload using tsx)
npm run dev

# Build TypeScript
npm run build

# Start Production Server
npm start
```

### Available Endpoints
- `GET /api/health` - Server health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create a user (`{ "name": "...", "email": "..." }`)
- `GET /api/posts` - Get all posts with related user (`JOIN` via Prisma `include`)
- `POST /api/posts` - Create a post (`{ "title": "...", "content": "...", "userId": 1 }`)

---

## 2. Frontend Setup & Configuration

### Installation
```bash
cd frontend
npm install
```

### Environment Variables
Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Run Frontend
```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start
```

---

## 3. Root Workspace Commands

From the workspace root (`antigr/`):
- `npm run dev:backend` - Starts backend dev server on port 5000
- `npm run dev:frontend` - Starts Next.js dev server on port 3000
- `npm run build:backend` - Builds backend TypeScript to `backend/dist`
- `npm run build:frontend` - Creates optimized Next.js production build
- `npm run build` - Builds both backend and frontend
- `npm run prisma:generate` - Generates Prisma client in backend
- `npm run prisma:migrate` - Runs Prisma migrations on Supabase
