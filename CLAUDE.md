# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `bun dev` — Start dev server (Turbopack)
- `bun run build` — Production build
- `bun start` — Start production server
- `bun run lint` — Run ESLint

## Architecture

**Next.js 16** app with **App Router**, **Bun**, **Supabase** (auth + DB), **TypeScript** (strict), **Tailwind CSS v4**.

### Backend — Supabase
- **`src/lib/supabase/client.ts`** — Browser client (`createBrowserClient`) for client components
- **`src/lib/supabase/server.ts`** — Server client (`createServerClient`) for server components, actions, route handlers
- **`src/lib/supabase/types.ts`** — Manual TypeScript types for all DB tables
- **`src/proxy.ts`** — Next.js 16 proxy (replaces middleware.ts). Handles auth token refresh, route protection, admin gate, onboarding enforcement.
- **`.env.local`** — `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Auth Flow
- Google OAuth via Supabase Auth
- `src/app/(auth)/login/page.tsx` — Login with Google button
- `src/app/auth/callback/route.ts` — OAuth code exchange, redirects based on role/onboarding
- Always use `supabase.auth.getUser()` on server, never `getSession()`

### Route Structure
- **`src/app/(auth)/`** — Login page (public)
- **`src/app/(customer)/`** — Customer layout + pages: onboarding, packages, orders
- **`src/app/(admin)/admin/`** — Admin layout + pages: dashboard, users, matching
- **`src/app/actions/`** — Server actions: auth.ts, onboarding.ts, orders.ts, admin-orders.ts, matching.ts

### Database
- **`migrations/`** — SQL files (001-004) to run in Supabase SQL Editor in order
- Tables: `profiles`, `packages`, `orders`, `match_groups`, `match_group_members`
- RLS enabled on all tables. Customers see own data; admins see all.
- `profiles` auto-created via trigger on `auth.users` insert

### Key Patterns
- `@/*` path alias maps to `./src/*`
- Server actions in `src/app/actions/` handle all mutations
- `useTransition` + server actions for optimistic client-side mutation calls
- Route groups `(auth)`, `(customer)`, `(admin)` provide layout isolation without affecting URLs
- Admin routes nested as `(admin)/admin/` so URLs start with `/admin/`
