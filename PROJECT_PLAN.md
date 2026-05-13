# Project Plan — MBA Hub

## Objective

Build a private networking and collaboration platform for MBA students. Solve three friction points: finding peers with complementary skills, coordinating study groups with shared availability, and discovering cohort social events. Gate the network with verified `.edu` email addresses.

## Scope

### In Scope
- `.edu` email-gated authentication via Supabase Auth
- Peer discovery with skill, course, and availability filtering
- Study group formation and scheduling
- Social event board with RSVP
- Full-text search across alumni, skills, and courses
- Vercel production deployment

### Out of Scope
- Mobile app
- Real-time messaging (chat)
- Calendar integration / external invites
- Video conferencing

## Architecture Decision

Next.js 15 App Router + Supabase is the right stack for this project. App Router server components handle session validation before page render (no flash of unauthenticated content). Supabase provides auth + PostgreSQL + row-level security without requiring a custom backend service.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Auth & Database | Supabase |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Deployment | Vercel |

## Execution Phases

### Phase 1 — Core Application (Complete)
- [x] Supabase auth with .edu domain validation
- [x] Peer discovery with multi-axis filtering
- [x] Study group formation
- [x] Social events tab
- [x] Animated dashboard (Framer Motion)
- [x] Vercel production deployment

### Phase 2 — Documentation Upgrade (Complete)
- [x] docs/methodology.md — problem statement, auth architecture, matching design, data model
- [x] docs/architecture.md — component structure, auth flow, data access pattern, deployment
- [x] docs/decision_log.md — 5 key decisions with rationale
- [x] PROJECT_PLAN.md, FINAL_REVIEW.md

## Success Criteria

- [x] .edu email gating working in production
- [x] Client-side filtering instantaneous at cohort size
- [x] Row-level security enforced in Supabase
- [x] Live Vercel deployment
- [x] No AI-generated residue in repository
