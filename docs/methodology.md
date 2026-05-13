# Methodology — MBA Hub

## Problem Statement

MBA programs create dense cohorts of high-achieving people who want to study together, collaborate on projects, and build professional networks — but the infrastructure for doing this scales poorly. Email threads fragment into lost conversations; WhatsApp groups become noisy and unsearchable; LinkedIn is public when students want a private space.

MBA Hub is a private networking platform gated by verified `.edu` email addresses, solving three specific friction points: finding peers with complementary skills for project teams, coordinating study groups with shared availability, and discovering social events within the cohort.

---

## Authentication Architecture

### `.edu` Domain Restriction

Authentication is handled by Supabase Auth with email domain validation configured at the application layer. Only addresses matching verified `.edu` domains are allowed to complete registration. The restriction serves two purposes:

1. **Privacy**: keeps the network private to verified students without manual vetting
2. **Trust**: users know every profile is a real student, which lowers the barrier to sharing availability and location preferences

Supabase handles email confirmation, session management, and JWT issuance. The Next.js App Router middleware validates session tokens on protected routes before rendering.

### Session Management

Supabase sessions are persisted via `localStorage` with automatic refresh. The middleware pattern in Next.js App Router intercepts navigation events before server component execution, preventing flash-of-unauthenticated-content on protected pages.

---

## Matching and Discovery

### Client-Side Filtering

Peer matching and filtering run entirely client-side. The Supabase query returns the full cohort profile set on authenticated load; React state manages filter application without additional round-trips. This design choice prioritizes low perceived latency for filter interactions over minimizing initial payload.

At expected cohort sizes (50–500 students), client-side filtering is faster than server-side filtered queries because the filtering cost is dwarfed by network round-trip time.

### Matching Dimensions

Profile discovery supports three independent filter axes:
- **Skills**: free-text tags (finance, Python, marketing, consulting, etc.)
- **Courses**: current semester enrollment
- **Availability**: time-block grid (morning / afternoon / evening × weekday / weekend)

Filters are conjunctive by default — a search for "Python + Finance + Tuesday evenings" returns only profiles matching all three. An OR mode is available within each dimension (any of the selected skills).

---

## Data Model

Supabase (PostgreSQL) stores:
- `profiles` — user metadata, skills array, course array, availability bitmask
- `study_groups` — group name, course, scheduled time, member IDs
- `events` — cohort social events with RSVP list

Row-level security (RLS) policies restrict reads to authenticated users only. No profile data is publicly accessible, even if the Supabase URL were known.

---

## Limitations

1. Matching is filter-based, not algorithmic — there is no compatibility scoring or recommendation engine
2. Alumni search does not support real-time status (online/offline)
3. Event RSVP is non-binding — there is no reminder or calendar integration
