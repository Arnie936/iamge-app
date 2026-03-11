# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server on localhost:3000
- `npm run build` — production build (Turbopack)
- `npm run lint` — run ESLint
- No test framework is configured

## Architecture

This is a **virtual try-on** single-page app styled after the Rinascente luxury e-commerce site. Users upload two images (person + clothing), the app sends them to an n8n webhook, and displays the AI-generated merged result.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Inter font via `next/font/google`. Uses `src/` directory with `@/*` path alias.

### Key areas

- **`src/app/page.tsx`** — assembles all components into a single page
- **`src/components/TryOnSection.tsx`** — the core interactive component; owns all state (`personImage`, `clothingImage`, `resultImageUrl`, `isLoading`, `error`). This is the only stateful component and is marked `"use client"`.
- **`src/components/ImageUploadZone.tsx`** — reusable drag-and-drop upload with preview; accepts only JPEG/WebP; handles `URL.createObjectURL`/`revokeObjectURL` lifecycle
- **`src/components/ResultDisplay.tsx`** — renders loading spinner, error state, or result image with download
- **`src/lib/api.ts`** — POSTs `multipart/form-data` (`image1`, `image2`) to the n8n webhook; 120s timeout via `AbortController`; validates response is an image blob
- **Static chrome components** (`TopBanner`, `Header`, `NavBar`, `LoginBanner`, `Breadcrumb`, `PageTitle`, `FilterBar`) — presentational only, no state

### Design conventions

- Black/white luxury aesthetic matching Rinascente branding
- All nav/label text: uppercase with wide letter-spacing (`tracking-wider`)
- Content max-width: `max-w-[1440px]`; banners are full-bleed
- Only `"use client"` where needed (TryOnSection, ImageUploadZone, ResultDisplay)
- API call is client-side (no API route) since there are no secrets to protect

### Deployment

Target platform is Vercel. No environment variables required — the n8n webhook URL is hardcoded in `src/lib/api.ts`.
