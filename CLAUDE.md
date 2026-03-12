# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server on localhost:3000
- `npm run build` — production build (Turbopack)
- `npm run lint` — run ESLint
- No test framework is configured

## Environment

Requires `.env.local` with the following variables (see `.env.example`):
- `N8N_WEBHOOK_URL` — server-side only, n8n webhook endpoint
- `NEXT_PUBLIC_SUPABASE_URL` — public, Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, Supabase anon key
- `STRIPE_SECRET_KEY` — server-side only, Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` — server-side only, Stripe webhook signature verification
- `SUPABASE_SERVICE_ROLE_KEY` — server-side only, bypasses RLS for webhook writes
- `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL` — public, Stripe Payment Link URL

## Architecture

Single-page **virtual try-on** app styled after the Rinascente luxury e-commerce site. Users upload two images (person + clothing), the app sends them to an n8n webhook via a server-side proxy, and displays the AI-generated merged result.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Inter font via `next/font/google`, Stripe (payments), Supabase (auth + subscriptions). Uses `src/` directory with `@/*` path alias.

### Key areas

- **`src/app/page.tsx`** — assembles all components into a single page (protected by middleware — requires auth + active subscription)
- **`src/app/api/try-on/route.ts`** — server-side API route that proxies requests to the n8n webhook; validates file types and sizes; keeps the webhook URL secret; returns proper HTTP error codes (400/502/504)
- **`src/app/api/stripe/webhook/route.ts`** — Stripe webhook handler; processes `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`; verifies Stripe signature; writes to `subscriptions` table via service role client
- **`src/app/login/page.tsx`** — login page; `"use client"`; calls `supabase.auth.signInWithPassword`
- **`src/app/signup/page.tsx`** — sign-up page; `"use client"`; calls `supabase.auth.signUp` with `full_name` in `user_metadata`
- **`src/app/payment/page.tsx`** — subscription page; shows $9.99/mo price; links to Stripe Payment Link with `client_reference_id` and `prefilled_email`; shows resubscribe messaging for expired users
- **`src/app/payment/success/page.tsx`** — post-payment page; polls Supabase every 2s for active subscription (handles webhook race condition); 30s timeout with fallback
- **`src/middleware.ts`** — refreshes Supabase auth session; bypasses `/api/stripe` (Stripe webhooks); redirects unauthenticated users to `/login`; checks `subscriptions` table for `status = 'active'`; redirects unsubscribed users to `/payment`
- **`src/lib/supabase/client.ts`** — browser Supabase client via `createBrowserClient`
- **`src/lib/supabase/server.ts`** — server Supabase client via `createServerClient` with cookie handling
- **`src/components/AuthStatus.tsx`** — header auth widget; shows user initials + "SIGN OUT" when logged in, user icon linking to `/login` when logged out; `"use client"`
- **`src/components/TryOnSection.tsx`** — core interactive component; owns all state (`personImage`, `clothingImage`, `resultImageUrl`, `isLoading`, `error`); marked `"use client"`
- **`src/components/ImageUploadZone.tsx`** — reusable drag-and-drop upload with preview; accepts JPEG/PNG/WebP (max 10 MB); handles `URL.createObjectURL`/`revokeObjectURL` lifecycle
- **`src/components/ResultDisplay.tsx`** — renders loading spinner, error state, or result image with download
- **`src/lib/api.ts`** — client-side helper; POSTs to `/api/try-on` (never directly to n8n); 120s timeout via `AbortController`; client-side file size validation
- **Static chrome components** (`TopBanner`, `Header`, `NavBar`, `LoginBanner`, `Breadcrumb`, `PageTitle`, `FilterBar`) — presentational only, no state

### Authentication & Subscription

- **Supabase Auth** with email/password; user metadata (`full_name`) stored in `auth.users.raw_user_meta_data`
- **Stripe subscription** ($9.99/mo) required for app access; managed via Stripe Payment Links
- **`public.subscriptions` table** — stores `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `status`, `current_period_end`; RLS enabled (users can read own row)
- **User flow:** Sign up → redirect to `/payment` → subscribe via Stripe → webhook records subscription → user can access app
- **Subscription lapse:** If subscription is canceled/unpaid, middleware redirects to `/payment` to resubscribe
- Middleware protects all routes except `/login`, `/signup`, and `/api/stripe`; `/payment` paths require auth but not active subscription
- Session managed via cookies; middleware refreshes tokens on every request

### Security model

- Webhook URL stored in env var, accessed only in server-side API route
- Stripe webhook verified via `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY` used only in webhook handler to bypass RLS
- File uploads validated both client-side (ImageUploadZone, api.ts) and server-side (route.ts): type allowlist + 10 MB size limit
- No secrets in client bundle; Supabase anon key and Stripe payment link URL are public/client-safe by design

### Design conventions

- Black/white luxury aesthetic matching Rinascente branding
- All nav/label text: uppercase with wide letter-spacing (`tracking-wider`)
- Content max-width: `max-w-[1440px]`; banners are full-bleed
- Only `"use client"` where needed (TryOnSection, ImageUploadZone, ResultDisplay, AuthStatus, login/signup/payment pages)

### Deployment

Target platform is Vercel. Set all env vars from `.env.example` in Vercel's environment variables settings. Configure Stripe webhook endpoint to `https://your-domain.com/api/stripe/webhook` with events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
