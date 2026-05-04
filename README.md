# MBA Hub

A private networking and collaboration platform for MBA students — peer matching, study group coordination, and social events in one authenticated space. Live at [mba-hub-app.vercel.app](https://mba-hub-app.vercel.app).

## What this project does

MBA Hub solves a real friction point in graduate school: finding the right people to study with, collaborate on projects, or grab coffee with across a large, distributed cohort. Students sign in with a verified `.edu` email address and get matched with peers by skills, courses, and availability. The platform handles study group formation, social event coordination, and alumni search in a single dashboard.

Authentication is handled through Supabase with `.edu` domain restriction, so the network stays private to university students. Matching and discovery logic runs client-side for low-latency filtering without exposing user data.

## Key features

- `.edu` email gating via Supabase Auth — no unverified accounts
- Peer discovery with skill and course-based filtering
- Study group formation with rendezvous scheduling
- Social events tab for cohort coordination
- Full-text search across alumni, skills, and courses
- Animated dashboard built with Framer Motion
- Deployed to production on Vercel

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Auth & Database | Supabase |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel |

## How to run

```bash
# Clone the repository
git clone https://github.com/akbknight/mba-hub-app.git
cd mba-hub-app

# Install dependencies
npm install

# Configure environment variables
# Create a .env.local file with your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=your_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Start development server
npm run dev
# Opens at http://localhost:3000
```

**Requirements:** Node.js 18+. A Supabase project with email auth enabled and `.edu` domain restriction configured.

## Skills demonstrated

- **Full-stack development:** Next.js App Router with TypeScript, Supabase integration for auth and real-time data
- **Authentication architecture:** email domain validation, session management, protected route patterns
- **Product design:** peer matching UX, multi-tab dashboard layout, real-world workflow design for graduate school use case
- **Deployment:** Vercel production environment with environment variable management

## Author

**Akshay Kumar**
[linkedin.com/in/akshaykumardl](https://www.linkedin.com/in/akshaykumardl/)
