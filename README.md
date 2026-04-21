# LinguaAI

LinguaAI is a Next.js application for English learning with AI conversation, pronunciation coaching, and spaced repetition flashcards.

## Integrations

- AI conversation: OpenRouter API
- Audio and pronunciation analysis: Google Gemini API
- Billing and subscriptions: Paddle
- Database and auth: Supabase

## Required Environment Variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=
OPENROUTER_API_KEY=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

PADDLE_API_KEY=
PADDLE_VENDOR_ID=
PADDLE_WEBHOOK_SECRET=
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=
NEXT_PUBLIC_PADDLE_PRICE_ID=
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Payment Endpoints

- `POST /api/payments/checkout`: creates a Paddle transaction and returns checkout context.
- `GET /api/payments/subscription?subscriptionId=...`: fetches Paddle subscription status.
- `POST /api/payments/webhook`: verifies Paddle signature and syncs user plan in Supabase.

## AI Endpoints

- `POST /api/conversation/message`: OpenRouter first, Gemini fallback.
- `POST /api/pronunciation/score`: Gemini multimodal analysis, OpenRouter refinement fallback.
