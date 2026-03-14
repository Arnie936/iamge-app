# Virtual Try-On

AI-powered virtual try-on app styled after the Rinascente luxury e-commerce aesthetic. Upload a person image and a clothing image — or pick from the built-in clothing gallery — and the app generates a merged result via an n8n webhook.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Supabase** (email/password authentication)
- **Inter** font via `next/font/google`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file from the example:

```bash
cp .env.example .env.local
```

3. Set the required environment variables in `.env.local`:

```
N8N_WEBHOOK_URL=https://your-n8n-instance.example.com/webhook/your-webhook-id
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Authentication

The app uses **Supabase Auth** with email/password sign-up and login. Only authenticated users can access the main try-on page — unauthenticated visitors are redirected to `/login`.

- **`/signup`** — create an account (full name, email, password)
- **`/login`** — sign in with existing credentials
- Session is managed via middleware that refreshes Supabase auth cookies on every request
- User metadata (full name) is stored in Supabase's `auth.users` table (`raw_user_meta_data`)

> **Supabase setup:** Disable "Confirm email" under Authentication > Providers > Email so sign-ups are immediately active.

## How It Works

1. Sign up or log in
2. Upload a **person image** (JPEG, PNG, or WebP, max 10 MB)
3. Choose a clothing item: **upload your own** or **click one from the built-in gallery** (denim jacket, red hat, sunglasses, propeller cap)
4. Click **Generate Try-On**
5. The app sends both images through a server-side API route (`/api/try-on`) to the n8n webhook
6. The AI-generated result is displayed with a download option

## Environment Variables

| Variable | Description |
|---|---|
| `N8N_WEBHOOK_URL` | n8n webhook endpoint for image processing (server-side only) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

## Deploy on Vercel

1. Push the repo to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add `N8N_WEBHOOK_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel project's Environment Variables settings
4. Deploy
