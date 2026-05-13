# Decision Log — MBA Hub

## Decision 1: Next.js App Router over Pages Router

**Decision:** Use the Next.js 15 App Router rather than the Pages Router.

**Rationale:** App Router enables server components, which allow Supabase session validation to happen server-side before any page content renders — eliminating the flash of unauthenticated content that is common in client-side auth patterns. The server/client component boundary also makes it natural to keep sensitive database calls server-side while keeping interactive components client-side.

**Tradeoff:** App Router's server/client boundary requires maintaining two separate Supabase clients (server.ts and client.ts). This is a one-time complexity cost that pays off in security and performance.

---

## Decision 2: Supabase over NextAuth + custom database

**Decision:** Use Supabase for both authentication and database rather than a standalone auth provider.

**Rationale:** Supabase provides auth, PostgreSQL, row-level security, and realtime subscriptions in a single hosted service. For an MVP without a dedicated backend team, the operational overhead of running a separate auth service plus a database is not justified. Supabase's email domain restriction can be configured at the application layer without custom auth middleware.

**Tradeoff:** Vendor dependency on Supabase. Migrating to a custom stack would require replacing both auth and data layers simultaneously.

---

## Decision 3: Client-side filtering over server-side filtered queries

**Decision:** Load full cohort profiles on authenticated page load and apply filters in React state, rather than issuing a new Supabase query for each filter change.

**Rationale:** At cohort sizes of 50–500 students, the initial payload for all profiles is small (< 100KB). Client-side filter interactions feel instantaneous compared to 200–500ms round-trip times for server queries. The UX benefit outweighs the marginal payload cost.

**Tradeoff:** Does not scale to thousands of users. If the platform grew to a multi-school deployment, server-side filtering with debounced queries would be necessary.

---

## Decision 4: Framer Motion for dashboard animations

**Decision:** Use Framer Motion for page transitions and card animations rather than CSS transitions alone.

**Rationale:** Dashboard interactions (peer card hover, tab transitions, modal open/close) benefit from physics-based spring animations that CSS `transition` cannot produce cleanly. Framer Motion's `AnimatePresence` handles enter/exit animations for conditionally rendered components, which would require manual CSS class management otherwise.

**Tradeoff:** Adds ~50KB to the bundle. Justified for a dashboard where animation quality is part of the product experience.

---

## Decision 5: .edu domain restriction at application layer

**Decision:** Validate `.edu` domain client-side before submitting to Supabase, rather than relying on Supabase's built-in email restrictions.

**Rationale:** Supabase's email allow-list feature requires configuring allowed domains in the project settings, which is environment-specific. Implementing the check at the application layer (simple regex before the auth call) keeps the restriction visible in code and testable without accessing the Supabase dashboard.

**Tradeoff:** A determined user could bypass the client-side check by calling the Supabase API directly. For a production deployment serving real students, the domain check should be enforced server-side via a Supabase Edge Function.
