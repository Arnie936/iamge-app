# Virtual Try-On

AI-powered virtual try-on app styled after the Rinascente luxury e-commerce aesthetic. Upload a person image and a clothing image, and the app generates a merged result via an n8n webhook.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
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

3. Set your n8n webhook URL in `.env.local`:

```
N8N_WEBHOOK_URL=https://your-n8n-instance.example.com/webhook/your-webhook-id
```

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## How It Works

1. Upload a **person image** and a **clothing image** (JPEG, PNG, or WebP, max 10 MB each)
2. Click **Generate Try-On**
3. The app sends both images through a server-side API route (`/api/try-on`) to the n8n webhook
4. The AI-generated result is displayed with a download option

## Environment Variables

| Variable | Description |
|---|---|
| `N8N_WEBHOOK_URL` | n8n webhook endpoint for image processing |

The webhook URL is kept server-side only and never exposed to the browser.

## Deploy on Vercel

1. Push the repo to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add `N8N_WEBHOOK_URL` in the Vercel project's Environment Variables settings
4. Deploy
