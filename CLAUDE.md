# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server on localhost:3000
- `npm run build` — production build (Turbopack)
- `npm run lint` — run ESLint
- No test framework is configured

## Environment

Requires `.env.local` with `N8N_WEBHOOK_URL` (see `.env.example`). This variable is only used server-side in the API route — never expose it to client code.

## Architecture

Single-page **virtual try-on** app styled after the Rinascente luxury e-commerce site. Users upload two images (person + clothing), the app sends them to an n8n webhook via a server-side proxy, and displays the AI-generated merged result.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Inter font via `next/font/google`. Uses `src/` directory with `@/*` path alias.

### Key areas

- **`src/app/page.tsx`** — assembles all components into a single page
- **`src/app/api/try-on/route.ts`** — server-side API route that proxies requests to the n8n webhook; validates file types and sizes; keeps the webhook URL secret; returns proper HTTP error codes (400/502/504)
- **`src/components/TryOnSection.tsx`** — core interactive component; owns all state (`personImage`, `clothingImage`, `resultImageUrl`, `isLoading`, `error`); marked `"use client"`
- **`src/components/ImageUploadZone.tsx`** — reusable drag-and-drop upload with preview; accepts JPEG/PNG/WebP (max 10 MB); handles `URL.createObjectURL`/`revokeObjectURL` lifecycle
- **`src/components/ResultDisplay.tsx`** — renders loading spinner, error state, or result image with download
- **`src/lib/api.ts`** — client-side helper; POSTs to `/api/try-on` (never directly to n8n); 120s timeout via `AbortController`; client-side file size validation
- **Static chrome components** (`TopBanner`, `Header`, `NavBar`, `LoginBanner`, `Breadcrumb`, `PageTitle`, `FilterBar`) — presentational only, no state

### Security model

- Webhook URL stored in env var, accessed only in server-side API route
- File uploads validated both client-side (ImageUploadZone, api.ts) and server-side (route.ts): type allowlist + 10 MB size limit
- No secrets in client bundle

### Design conventions

- Black/white luxury aesthetic matching Rinascente branding
- All nav/label text: uppercase with wide letter-spacing (`tracking-wider`)
- Content max-width: `max-w-[1440px]`; banners are full-bleed
- Only `"use client"` where needed (TryOnSection, ImageUploadZone, ResultDisplay)

### Deployment

Target platform is Vercel. Set `N8N_WEBHOOK_URL` in Vercel's environment variables settings.
