# LinguaAI — Architecture Document

**Version:** 1.0  
**Stack:** Next.js 14 (App Router), React, Supabase, Claude API, OpenAI Whisper  
**Deployment:** Vercel  

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                  │
│         Next.js React App (App Router)              │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────────┐
│              Next.js API Routes (Server)            │
│   /api/conversation  /api/pronunciation  /api/cards │
└──────┬──────────────┬───────────────────┬───────────┘
       │              │                   │
┌──────▼──────┐ ┌─────▼──────┐  ┌────────▼────────┐
│ Anthropic   │ │  OpenAI    │  │    Supabase     │
│ Claude API  │ │ Whisper    │  │  (DB + Auth +   │
│ (Chat/Conv) │ │ (STT/Pron) │  │   Storage)      │
└─────────────┘ └────────────┘  └─────────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Framework
- **Next.js 14** with App Router
- **React 18** with Server and Client Components
- **TypeScript** throughout

### 2.2 Folder Structure
```
/app
  /layout.tsx              # Root layout (fonts, providers)
  /page.tsx                # Landing page
  /(auth)
    /login/page.tsx
    /signup/page.tsx
  /(app)                   # Protected routes
    /dashboard/page.tsx
    /conversation/page.tsx
    /flashcards/page.tsx
    /pronunciation/page.tsx
    /progress/page.tsx
/components
  /ui/                     # Reusable UI primitives (shadcn/ui)
  /conversation/           # Chat UI components
  /flashcards/             # Card components, deck manager
  /pronunciation/          # Waveform, recorder, score display
  /dashboard/              # Streak, XP, charts
/lib
  /srs.ts                  # SM-2 algorithm
  /level.ts                # CEFR level utilities
  /audio.ts                # Audio recording helpers
/hooks
  /useConversation.ts
  /useFlashcards.ts
  /usePronunciation.ts
/store
  /userStore.ts            # Zustand global state
/types
  /index.ts                # Shared TypeScript types
```

### 2.3 State Management
- **Zustand** for global client state (user, XP, streak)
- **React Query (TanStack Query)** for server data fetching and caching
- **Local state** (useState) for component-level UI state

### 2.4 UI Component Library
- **shadcn/ui** for base components (buttons, cards, inputs, dialogs)
- **Tailwind CSS** for styling
- **Framer Motion** for animations and transitions
- **Recharts** for progress charts

---

## 3. Backend Architecture

### 3.1 API Routes (Next.js)

| Route | Method | Description |
|---|---|---|
| `/api/conversation/start` | POST | Create new conversation session |
| `/api/conversation/message` | POST | Send message, get AI reply |
| `/api/conversation/end` | POST | End session, generate summary |
| `/api/pronunciation/score` | POST | Upload audio, return score |
| `/api/cards/due` | GET | Get today's due flashcards |
| `/api/cards/review` | POST | Submit card rating (SM-2 update) |
| `/api/cards/add` | POST | Add new word to deck |
| `/api/user/progress` | GET | Fetch dashboard stats |
| `/api/onboarding/assess` | POST | Submit assessment, return CEFR level |

### 3.2 Middleware
- **Auth middleware** on all `/api/(app)/*` routes via Supabase session
- **Rate limiting** middleware (Upstash Redis) for free tier enforcement
- **Error boundary** wrapper for all API routes

---

## 4. Database Schema (Supabase / PostgreSQL)

### 4.1 Tables

```sql
-- Users (extends Supabase auth.users)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  native_language TEXT,
  cefr_level TEXT DEFAULT 'A1',   -- A1, A2, B1, B2, C1
  xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active DATE,
  plan TEXT DEFAULT 'free',       -- free | pro
  daily_goal_minutes INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ
)

-- Flashcard Deck
flashcards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  word TEXT NOT NULL,
  translation TEXT,
  example_sentence TEXT,
  audio_url TEXT,
  -- SM-2 fields
  interval INTEGER DEFAULT 1,
  repetition INTEGER DEFAULT 0,
  easiness FLOAT DEFAULT 2.5,
  next_review DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ
)

-- Conversation Sessions
conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  topic TEXT,
  messages JSONB,               -- [{role, content, timestamp}]
  summary JSONB,                -- {words_used, mistakes, suggestions}
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ
)

-- Pronunciation Attempts
pronunciation_attempts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  target_text TEXT,
  audio_url TEXT,
  score INTEGER,                -- 0–100
  phoneme_feedback JSONB,
  created_at TIMESTAMPTZ
)

-- Daily Stats (for dashboard)
daily_stats (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  date DATE,
  xp_earned INTEGER DEFAULT 0,
  cards_reviewed INTEGER DEFAULT 0,
  conversations INTEGER DEFAULT 0,
  pronunciation_attempts INTEGER DEFAULT 0
)
```

### 4.2 Row Level Security (RLS)
All tables have RLS enabled — users can only read/write their own rows.

---

## 5. AI & External Services

### 5.1 Claude API (Anthropic) — Conversation Partner
```typescript
// System prompt strategy
const systemPrompt = `
  You are an English conversation tutor. The user's level is ${cefrLevel}.
  Topic: ${topic}
  - Respond naturally at the user's level
  - Gently correct grammar errors by modeling correct usage
  - Keep responses concise (2-4 sentences)
  - After 10 exchanges, end gracefully
`
// Model: claude-sonnet-4-20250514
// Max tokens: 300 per response
// Temperature: 0.7
```

### 5.2 OpenAI Whisper — Speech-to-Text + Pronunciation
- User records audio in browser (MediaRecorder API)
- Audio blob sent to `/api/pronunciation/score`
- Server sends to Whisper for transcription
- Transcription compared to target text using phoneme-level diff
- Score calculated: (matched_phonemes / total_phonemes) * 100

### 5.3 Text-to-Speech (for flashcards + shadowing)
- **Web Speech API** (free, browser-native) for flashcard audio
- Fallback: **OpenAI TTS API** for higher quality pronunciation examples

### 5.4 Supabase
- **Auth:** Email/password + Google OAuth
- **Database:** PostgreSQL with RLS
- **Storage:** Audio recordings (pronunciation attempts)
- **Realtime:** Not needed for MVP

---

## 6. SM-2 Algorithm Implementation

```typescript
// lib/srs.ts
interface Card {
  interval: number;      // days until next review
  repetition: number;    // number of successful reviews
  easiness: number;      // difficulty factor (1.3 – 2.5)
  next_review: Date;
}

type Rating = 0 | 1 | 2 | 3 | 4 | 5; // 0-2 = fail, 3-5 = pass

function sm2(card: Card, rating: Rating): Card {
  if (rating < 3) {
    return { ...card, repetition: 0, interval: 1, next_review: tomorrow() }
  }

  const newEasiness = Math.max(
    1.3,
    card.easiness + 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)
  );

  const newInterval =
    card.repetition === 0 ? 1 :
    card.repetition === 1 ? 6 :
    Math.round(card.interval * card.easiness);

  return {
    interval: newInterval,
    repetition: card.repetition + 1,
    easiness: newEasiness,
    next_review: daysFromNow(newInterval)
  };
}
```

---

## 7. Freemium Enforcement

- User's `plan` field stored in `profiles` table
- Rate limits checked in API middleware via **Upstash Redis** counters
- Daily counters reset at midnight UTC
- Stripe webhooks update `plan` field on subscription events

```
Free limits (enforced server-side):
- conversations: 3/day
- pronunciation_attempts: 5/day  
- flashcards: 200 total (count check on add)
```

---

## 8. Deployment

| Service | Purpose |
|---|---|
| **Vercel** | Next.js hosting, edge functions |
| **Supabase** | Database, auth, file storage |
| **Upstash Redis** | Rate limiting counters |
| **Stripe** | Subscription billing |
| **Anthropic API** | AI conversation |
| **OpenAI API** | Whisper STT, TTS |

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## 9. Security Considerations

- All AI API keys server-side only (never exposed to client)
- Audio files in Supabase Storage with signed URLs (expire in 1hr)
- Input sanitization on all user text before sending to AI
- Rate limiting on all AI-touching endpoints
- CSRF protection via Next.js built-in headers
