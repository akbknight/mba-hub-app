# Architecture — MBA Hub

## System Overview

MBA Hub is a full-stack web application built on Next.js 15 (App Router) with Supabase as the auth and database layer. It is deployed to Vercel with automatic deploys on push to `main`.

```
Client (Next.js App Router)
    │
    ├── /app
    │   ├── (auth)/login          ← Supabase email auth, .edu gating
    │   ├── /dashboard            ← Main authenticated experience
    │   │   ├── /peers            ← Discovery + filtering
    │   │   ├── /groups           ← Study group management
    │   │   └── /events           ← Cohort event board
    │   └── /profile              ← Edit profile, skills, availability
    │
    └── middleware.ts             ← Session validation, route protection
              │
              ▼
        Supabase (PostgreSQL + Auth)
              │
              ├── profiles table
              ├── study_groups table
              └── events table
```

---

## Component Architecture

```
src/
├── app/                          ← Next.js App Router pages
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx            ← Authenticated shell + nav
│   │   ├── peers/page.tsx        ← Discovery view
│   │   ├── groups/page.tsx
│   │   └── events/page.tsx
│   └── api/
│       └── auth/callback/        ← Supabase OAuth callback handler
├── components/
│   ├── ui/                       ← Base components (Button, Card, Input)
│   ├── PeerCard.tsx
│   ├── GroupCard.tsx
│   └── EventCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             ← Browser client (singleton)
│   │   └── server.ts             ← Server component client
│   └── utils.ts
└── middleware.ts                 ← Route protection via Supabase session
```

---

## Authentication Flow

```
User enters .edu email
        │
        ▼
Supabase Auth: email validation + domain check
        │
        ▼
Confirmation email sent
        │
        ▼
User clicks link → /api/auth/callback
        │
        ▼
Session established (JWT in localStorage + cookie)
        │
        ▼
middleware.ts validates session on every navigation
        │
        ▼
Protected pages render with user context
```

---

## Data Access Pattern

Server Components use `supabase/server.ts` (reads cookies from Next.js headers). Client Components use `supabase/client.ts` (singleton browser client). This separation is required by Next.js App Router's server/client boundary — the server client is not available in client components and vice versa.

Row-level security (RLS) policies in Supabase ensure that even if a client made a raw query to the Supabase API, it could only read data for authenticated users.

---

## Deployment

- **Host**: Vercel (automatic deploys from `main` branch)
- **Environment variables**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Vercel project settings
- **Build**: `next build` — static generation where possible, server rendering for auth-protected pages
- **Live URL**: [mba-hub-app.vercel.app](https://mba-hub-app.vercel.app)
