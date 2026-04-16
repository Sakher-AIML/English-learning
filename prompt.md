# LinguaAI — Cursor Build Prompt

Paste this entire prompt into Cursor as your starting instruction.

---

## MASTER BUILD PROMPT

You are building **LinguaAI** — a web-based English learning app for non-English speakers. It combines three core features: an AI conversation partner, spaced repetition flashcards, and pronunciation scoring tools. The design is playful and energetic (think Duolingo's energy but with a fresh identity).

---

## Tech Stack

- **Framework:** Next.js 14 with App Router and TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animation:** Framer Motion
- **State:** Zustand (global) + TanStack Query (server data)
- **Database & Auth:** Supabase (PostgreSQL + RLS + Auth)
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`) for conversation
- **Speech:** OpenAI Whisper API for speech-to-text and pronunciation
- **TTS:** Web Speech API (with OpenAI TTS as fallback)
- **Charts:** Recharts
- **Payments:** Stripe
- **Rate limiting:** Upstash Redis
- **Deployment:** Vercel

---

## Project Structure

Scaffold the project with this structure:

```
/app
  /layout.tsx
  /page.tsx                        # Landing page
  /(auth)/login/page.tsx
  /(auth)/signup/page.tsx
  /(auth)/onboarding/page.tsx      # Level assessment
  /(app)/dashboard/page.tsx
  /(app)/conversation/page.tsx
  /(app)/flashcards/page.tsx
  /(app)/pronunciation/page.tsx
  /(app)/progress/page.tsx
/components
  /ui/                             # shadcn primitives
  /conversation/
    ChatMessage.tsx
    ChatInput.tsx
    TopicSelector.tsx
    SessionSummary.tsx
  /flashcards/
    FlashCard.tsx
    RatingButtons.tsx
    DeckProgress.tsx
  /pronunciation/
    RecordButton.tsx
    WaveformDisplay.tsx
    ScoreRing.tsx
    PhonemeBreakdown.tsx
  /dashboard/
    StatCard.tsx
    StreakBadge.tsx
    DailyReviewBanner.tsx
    XPBar.tsx
  /layout/
    Sidebar.tsx
    BottomNav.tsx                  # Mobile
/lib
  /srs.ts                          # SM-2 algorithm
  /supabase.ts                     # Supabase client
  /claude.ts                       # Claude API wrapper
  /whisper.ts                      # Whisper API wrapper
  /audio.ts                        # MediaRecorder helpers
/hooks
  /useConversation.ts
  /useFlashcards.ts
  /usePronunciation.ts
  /useUser.ts
/store
  /userStore.ts                    # Zustand store
/types/index.ts
```

---

## Design System

Use these exact values throughout:

**Colors (CSS variables in globals.css):**
```css
--primary: #4F46E5;
--secondary: #F59E0B;
--success: #10B981;
--danger: #EF4444;
--bg: #FAFAFA;
--surface: #FFFFFF;
--surface-2: #F3F4F6;
--text-1: #111827;
--text-2: #6B7280;
--border: #E5E7EB;
```

**Fonts (import from Google Fonts):**
- Display/headings: `Nunito` (weights 700, 800)
- Body: `Plus Jakarta Sans` (weights 400, 600)

**Radius:**
- Cards: `rounded-2xl` (20px)
- Buttons: `rounded-full`
- Inputs: `rounded-xl`

**Animations (Framer Motion):**
- Page entry: `{ opacity: 0, y: 10 }` → `{ opacity: 1, y: 0 }`, 200ms
- Card hover: `whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}`
- Button press: `whileTap={{ scale: 0.97 }}`

---

## Database Schema (Supabase)

Create these tables with Row Level Security enabled:

```sql
-- profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  native_language text,
  cefr_level text default 'A1',
  xp integer default 0,
  streak_days integer default 0,
  last_active date,
  plan text default 'free',
  daily_goal_minutes integer default 10,
  created_at timestamptz default now()
);

-- flashcards
create table flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
  word text not null,
  translation text,
  example_sentence text,
  audio_url text,
  interval integer default 1,
  repetition integer default 0,
  easiness float default 2.5,
  next_review date default current_date,
  created_at timestamptz default now()
);

-- conversations
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
  topic text,
  messages jsonb default '[]',
  summary jsonb,
  duration_seconds integer,
  created_at timestamptz default now()
);

-- pronunciation_attempts
create table pronunciation_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
  target_text text,
  audio_url text,
  score integer,
  phoneme_feedback jsonb,
  created_at timestamptz default now()
);

-- daily_stats
create table daily_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
  date date default current_date,
  xp_earned integer default 0,
  cards_reviewed integer default 0,
  conversations integer default 0,
  pronunciation_attempts integer default 0,
  unique(user_id, date)
);
```

Enable RLS on all tables. Policy for each: users can only select/insert/update/delete rows where `user_id = auth.uid()`.

---

## Feature 1: AI Conversation Partner

### API Route: `/api/conversation/message` (POST)

```typescript
// Body: { conversationId: string, message: string, cefrLevel: string, topic: string, history: Message[] }
// Response: { reply: string, correction?: string, xpEarned: number }

const systemPrompt = `
You are a friendly English conversation tutor. The student's level is ${cefrLevel}.
Conversation topic: ${topic}

Rules:
- Respond naturally and encouragingly at the student's level
- If the student makes a grammar mistake, gently model the correct form in your reply (don't explicitly say "you made a mistake")
- Keep responses to 2–3 sentences maximum
- Use vocabulary appropriate for ${cefrLevel} level
- Be warm, patient, and encouraging
`
// Use claude-sonnet-4-20250514, max_tokens: 300, temperature: 0.7
```

### Conversation UI (`/conversation`)

Build a full-height chat interface:
- Topic selector modal on first visit (grid of topic cards with emoji icons: "☕ Ordering Coffee", "🏥 At the Doctor", "💼 Job Interview", "🛫 Travel", "🤝 Making Friends", "🛒 Shopping")
- Chat bubbles: user messages right-aligned (indigo bg), AI messages left-aligned (white card)
- Show gentle correction in AI message with green highlight: original error struck through, correction shown
- Animated typing indicator (3 bouncing dots) while waiting for AI response
- Bottom input: text field + send button + mic button
- Voice mode: use MediaRecorder API, send to Whisper, display transcript before sending
- "End Session" button → triggers `/api/conversation/end` → shows SessionSummary modal

### Session Summary Modal
After ending a conversation, display:
- Words used count + any new words (offer to add to flashcard deck)
- XP earned (animated count-up)
- A tip or encouragement message from the AI
- Two buttons: "Add New Words to Flashcards" + "Back to Dashboard"

---

## Feature 2: Spaced Repetition Flashcards

### SM-2 Algorithm (`/lib/srs.ts`)

```typescript
export type Rating = 'hard' | 'okay' | 'easy'; // maps to SM-2 quality 1, 3, 5

export interface CardSRS {
  interval: number;
  repetition: number;
  easiness: number;
  next_review: Date;
}

export function updateCard(card: CardSRS, rating: Rating): CardSRS {
  const quality = rating === 'hard' ? 1 : rating === 'okay' ? 3 : 5;
  
  if (quality < 3) {
    return { ...card, repetition: 0, interval: 1, next_review: tomorrow() };
  }
  
  const newEasiness = Math.max(
    1.3,
    card.easiness + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
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

### Flashcard UI (`/flashcards`)

- Show cards where `next_review <= today` ordered by oldest first
- Card component: 400px wide centered card
  - Front: word in large text (32px Nunito 800) + speaker icon button (plays TTS)
  - Back (3D flip animation using Framer Motion `rotateY`): translation + example sentence + audio
- After flip, show three rating buttons: "Hard 😓" (red), "Okay 🙂" (amber), "Easy 😄" (green)
- On rating: call `updateCard()`, PATCH the card in Supabase, animate card away, show next
- Progress bar at top showing cards remaining
- On completion: confetti animation (use `canvas-confetti` package) + stats summary

---

## Feature 3: Pronunciation Tools

### API Route: `/api/pronunciation/score` (POST)

```typescript
// Body: FormData with { audio: Blob, targetText: string }
// 1. Send audio to OpenAI Whisper for transcription
// 2. Compare transcript to targetText using word-level diff
// 3. Calculate score: (matching_words / total_words) * 100
// 4. Return: { score: number, transcript: string, wordFeedback: WordFeedback[], tip: string }

interface WordFeedback {
  word: string;
  correct: boolean;
  phonemeTip?: string;
}
```

### Pronunciation UI (`/pronunciation`)

Build a focused single-task interface:

1. **Sentence display:** Show target sentence in large readable text (24px)
2. **Listen first:** "Listen" button plays native TTS audio of the sentence
3. **Record button:** Large circular button (80px), red pulsing ring animation when recording
   - Use `MediaRecorder` API to capture audio
   - Show recording waveform (animated bars reacting to audio level using `AudioContext`)
   - Tap again to stop recording
4. **Score reveal:** Animated SVG ring filling to score percentage (800ms ease-out animation)
5. **Word breakdown:** Show each word colored green (correct) or red (needs work)
6. **Tip:** Show one specific improvement tip
7. **Actions:** "Try Again" (same sentence) + "Next Sentence" buttons

Sentences should come from a predefined list, grouped by CEFR level.

---

## Dashboard (`/dashboard`)

Layout: Fixed sidebar on left (240px) on desktop, bottom nav on mobile

**Sidebar:**
- Logo: "LinguaAI" in Nunito 800 with indigo color
- Nav items with icons: Dashboard, Conversation, Flashcards, Pronunciation, Progress
- Active: indigo pill background
- Bottom: user avatar (initials fallback), name, CEFR badge, settings icon

**Main content:**
- Greeting: "Good [morning/afternoon/evening], [name]! 👋"
- Row of 4 stat cards: Words Learned, Conversations, Avg Score, Study Time
- Daily Review Banner (amber, dismissible when complete): "📚 12 cards due today"
- 3 feature cards: AI Conversation, Flashcards, Pronunciation
  - Show daily usage for free tier users: "3 conversations left today"
- Streak display: 🔥 badge with day count, XP progress bar to next level

---

## Onboarding (`/onboarding`)

5-step assessment flow:

**Step 1:** Name + native language (searchable dropdown of ~40 languages)

**Steps 2–4:** Assessment questions
- Step 2: Listening — play an audio clip, multiple choice question about what you heard
- Step 3: Reading — fill-in-the-blank sentence completion
- Step 4: Speaking — record yourself reading a sentence (optional, skip available)

**Step 5:** Result reveal
- Animate in the CEFR level badge
- Brief description of the level
- Daily goal selector: 5 min / 10 min / 20 min (pill buttons)
- "Start Learning!" button → Dashboard

Auto-detect level from assessment answers using a simple scoring rubric.

---

## Freemium Enforcement

Use Upstash Redis to track daily usage per user:

```typescript
// Middleware check before AI routes
const key = `limits:${userId}:${feature}:${today}`;
const count = await redis.incr(key);
await redis.expire(key, 86400); // Reset daily

const limits = { conversation: 3, pronunciation: 5 };
if (userPlan === 'free' && count > limits[feature]) {
  return Response.json({ error: 'limit_reached', feature }, { status: 429 });
}
```

When limit is reached, show an upgrade modal:
- "You've used all 3 free conversations today"
- Feature list of Pro plan
- "Upgrade to Pro — $9.99/mo" button → Stripe checkout

---

## Auth Flow

Use Supabase Auth:
- Email/password signup + login
- Google OAuth (one-click)
- On signup: create `profiles` row, redirect to `/onboarding`
- On login: if `profiles.cefr_level` is set → Dashboard, else → Onboarding
- Middleware in `middleware.ts` to protect all `/(app)/*` routes

---

## Environment Variables Needed

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
OPENAI_API_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

---

## Build Order (follow this sequence)

1. Project setup: Next.js 14 + Tailwind + shadcn/ui + TypeScript + Supabase
2. Auth: signup, login, Google OAuth, middleware protection
3. Database: create all tables + RLS policies
4. Design system: globals.css with CSS variables, font imports, base component styles
5. Layout: Sidebar + BottomNav + App shell
6. Onboarding: 5-step assessment flow
7. Dashboard: stat cards, streak, daily review banner, feature cards
8. Flashcards: SM-2 engine + card UI + flip animation + deck completion
9. Conversation: topic selector + chat UI + Claude API integration + session summary
10. Pronunciation: recorder + Whisper API + score display + word breakdown
11. Progress page: charts + history + achievements
12. Freemium: Redis rate limiting + upgrade modal + Stripe integration

---

## Quality Standards

- TypeScript strict mode — no `any` types
- All API keys server-side only, never in client bundle
- Loading states on every async action (skeleton loaders, not spinners)
- Error boundaries around each major feature
- Mobile-first responsive design
- Optimistic UI updates where possible (flashcard ratings, XP)
- All audio interactions have visual equivalents for accessibility
