# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: NO NPC NETWORK — Next.js + Prisma application for a roleplay racing/betting system.

Commands

- Install dependencies
  - npm install

- Environment setup (local)
  - Copy env.example to .env.local and set values
    - DATABASE_URL=...
    - NEXTAUTH_URL=http://localhost:3000
    - NEXTAUTH_SECRET=... (use npm run generate-secret to create one)

- Prisma (schema and DB)
  - Generate Prisma client: npm run db:generate
  - Apply schema to DB (push): npm run db:push
  - Open Prisma Studio (DB UI): npm run db:studio

- Development server
  - Start dev server: npm run dev

- Build and run (production)
  - Build: npm run build
  - Start: npm run start

- Lint
  - Lint: npm run lint

- Project scripts (common tasks)
  - Create initial admin user: npm run create-admin
  - Seed initial data: npm run seed
  - Seed contacts: npm run seed-contacts
  - Change admin password: npm run change-admin-password
  - Generate secret (use for NEXTAUTH_SECRET): npm run generate-secret
  - Test DB connection: npm run test-connection
  - Deploy database utilities: npm run deploy-database
  - Production setup helper: npm run setup-production

- Tests
  - A test runner is not configured in package.json. Running a single test is not applicable at this time.

High-level architecture

- Framework: Next.js App Router (app/). React 18 with TypeScript. Styling via Tailwind CSS (v4) and shadcn/ui components (components/ui/*) with Radix primitives.

- Authentication/Authorization
  - next-auth with credentials provider (lib/auth.ts). Sessions are JWT-based with role embedded (ADMIN/USER).
  - middleware.ts enforces auth on all pages; redirects unauthenticated users to /auth/signin and restricts /admin/* to ADMIN role.

- API layer (server routes)
  - app/api/*/route.ts exposes REST-like endpoints for core resources: events, participants/bets, services, service-requests, contacts, users.
  - Handlers use Prisma client (lib/prisma.ts) to read/write the PostgreSQL database defined in prisma/schema.prisma.
  - Rate limiting and notifications/webhooks utilities available in lib/ (e.g., lib/rate-limit.ts, lib/discord-webhook.ts).

- Data layer
  - prisma/schema.prisma models:
    - User (role: ADMIN/USER)
    - Event (with Participants)
    - Bet (linked to User, Event, Participant; status enum)
    - Service and ServiceRequest (request lifecycle enum)
    - Contact directory
  - DATABASE_URL is expected to be a PostgreSQL connection string in production. Local development can point to any reachable Postgres instance.

- UI composition
  - app/layout.tsx sets up global fonts, styles, and Providers.
  - components/providers.tsx wraps the tree with SessionProvider and a NotificationProvider; NotificationContainer renders toasts/alerts.
  - Public pages (app/page.tsx) compose sections from components/* to present operations/services/contacts.
  - Admin UI (app/admin/page.tsx) composes components/admin/* for managing events, bets, users, services, and contacts.

- State and context
  - contexts/notification-context.tsx provides in-app notification system used by UI components.

- Configuration
  - next.config.mjs for Next.js settings.
  - postcss.config.mjs and Tailwind CSS v4 via @tailwindcss/postcss.
  - tsconfig.json at repo root.

Important repository docs to reference

- README.md: Installation, env vars, initial admin creation, and deployment overview.
- DEPLOY_GUIDE.md / VERCEL_*.md / DEPLOY_INSTRUCTIONS.md: Step-by-step deployment guidance, including Vercel specifics and troubleshooting.
- SECURITY_AUDIT_REPORT.md and SECURITY_IMPROVEMENTS_SUMMARY.md: Findings and recommended hardening steps.
- FIX_BUILD_ERROR.md / FIX_SERVER_ERROR.md / DIAGNOSTIC_CHECKLIST.md: Operational troubleshooting playbooks.
- LOGIN_UPDATE.md / CHANGE_ADMIN_PASSWORD.md: Auth-related maintenance procedures.

Conventions and notes for agents

- Prefer server-side data access via Prisma in API routes; avoid client-side direct DB access.
- Preserve role-based access control: only ADMIN can access /admin and admin-only mutations.
- When adding new models or fields: update prisma/schema.prisma, then run npm run db:generate and npm run db:push; consider adding admin UI and API endpoints under app/api.
- If introducing tests, add a test runner (e.g., vitest/jest) and define scripts in package.json so single-test execution can be documented.

External tool rules detected

- No CLAUDE.md, Cursor rules, or GitHub Copilot instruction files were found in this repo at the time of writing.

