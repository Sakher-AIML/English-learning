# LinguaAI — UI/UX Design Specification

**Version:** 1.0  
**Design Direction:** Playful, energetic, encouraging — Duolingo-inspired but with a fresh identity  

---

## 1. Design Philosophy

LinguaAI's design should feel like a **game you want to play, not a textbook you have to read.**

Core principles:
- **Celebrate progress** — every small win gets a visual reaction
- **Reduce friction** — one clear action per screen
- **Encourage, never shame** — mistakes are part of learning
- **Delight in the details** — subtle animations, satisfying interactions

---

## 2. Visual Identity

### 2.1 Color Palette

```
Primary:     #4F46E5  (Indigo 600)   — main CTA, active states
Secondary:   #F59E0B  (Amber 400)    — XP, streaks, rewards
Success:     #10B981  (Emerald 500)  — correct answers, scores
Danger:      #EF4444  (Red 500)      — wrong answers, warnings
Background:  #FAFAFA  (Near white)   — main app background
Surface:     #FFFFFF  (White)        — cards, panels
Surface-2:   #F3F4F6  (Gray 100)    — secondary backgrounds
Text-1:      #111827  (Gray 900)     — headings, primary text
Text-2:      #6B7280  (Gray 500)     — secondary, captions
Border:      #E5E7EB  (Gray 200)     — card borders, dividers

Accent gradients:
- Hero: linear-gradient(135deg, #4F46E5, #7C3AED)
- Streak: linear-gradient(135deg, #F59E0B, #EF4444)
- Score: linear-gradient(135deg, #10B981, #059669)
```

### 2.2 Typography

```
Display font:   "Nunito" (Google Fonts) — rounded, friendly, energetic
Body font:      "Plus Jakarta Sans" — clean, modern, readable
Mono font:      "JetBrains Mono" — pronunciation phoneme display

Scale:
--text-xs:   12px
--text-sm:   14px
--text-base: 16px
--text-lg:   18px
--text-xl:   20px
--text-2xl:  24px
--text-3xl:  30px
--text-4xl:  36px

Font weights: 400 (body), 600 (labels/buttons), 700 (headings), 800 (display)
```

### 2.3 Spacing & Radius

```
Spacing scale: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
Border radius:
  --radius-sm:  8px   (inputs, tags)
  --radius-md:  12px  (cards)
  --radius-lg:  20px  (modals, panels)
  --radius-xl:  32px  (feature cards)
  --radius-full: 9999px (badges, pills, buttons)
```

### 2.4 Shadows

```
--shadow-sm:  0 1px 3px rgba(0,0,0,0.08)
--shadow-md:  0 4px 16px rgba(0,0,0,0.10)
--shadow-lg:  0 8px 32px rgba(0,0,0,0.12)
--shadow-xl:  0 20px 60px rgba(0,0,0,0.15)
--shadow-glow: 0 0 0 4px rgba(79,70,229,0.15)  (focus rings)
```

---

## 3. Component Library

### 3.1 Buttons

```
Primary button:
  bg: #4F46E5 | text: white | radius: full
  hover: scale(1.02) + shadow-md
  active: scale(0.98)
  padding: 12px 24px | font: 600 16px

Secondary button:
  bg: white | border: 2px #E5E7EB | text: #111827
  hover: border-color #4F46E5, text #4F46E5

Danger button:
  bg: #FEF2F2 | text: #EF4444 | border: 2px #FECACA

Icon button:
  bg: #F3F4F6 | radius: full | w/h: 40px
  hover: bg #E5E7EB
```

### 3.2 Cards

```
Default card:
  bg: white | border: 1px #E5E7EB | radius: radius-md
  shadow: shadow-sm | padding: 24px

Feature card (flashcard, conversation):
  radius: radius-xl | shadow: shadow-md
  hover: translateY(-2px) + shadow-lg (transition: 200ms)

Stat card (dashboard):
  bg: gradient | text: white
  radius: radius-lg | padding: 20px
```

### 3.3 Progress & Gamification Elements

```
XP Bar:
  height: 12px | radius: full
  track: #E5E7EB | fill: gradient(#4F46E5 → #7C3AED)
  animated fill on mount

Streak Badge:
  bg: gradient(#F59E0B → #EF4444) | text: white
  emoji: 🔥 | font: 700 | radius: full | padding: 6px 14px
  pulse animation when streak > 0

CEFR Level Badge:
  colors per level: A1(gray), A2(blue), B1(green), B2(teal), C1(purple)
  radius: full | font: 700 | padding: 4px 12px

Score Ring (pronunciation):
  SVG circle with stroke-dashoffset animation
  color: success green | size: 80px
  number in center: font 800 24px
```

---

## 4. Screen-by-Screen Specifications

### 4.1 Landing Page

**Layout:** Full-page hero + 3 feature sections + pricing + CTA footer

**Hero Section:**
- Headline: "Speak English. For Real." (Nunito, 56px, 800 weight)
- Subheadline: "AI conversation, smart flashcards, and pronunciation feedback — all in one place."
- Two CTAs: "Start for Free" (primary) + "See how it works" (ghost)
- Animated illustration: floating conversation bubbles with score badges
- Background: subtle dot grid pattern + soft indigo gradient top-right

**Feature Sections (3 cards):**
- AI Conversation Partner → Flashcards → Pronunciation
- Each: icon, title, 2-line description, mini screenshot/mockup

**Pricing Section:**
- Two-column card layout (Free vs Pro)
- Pro card: highlighted with indigo border + "Most Popular" badge

---

### 4.2 Onboarding / Level Assessment

**Progress indicator:** Step dots at top (5 steps)

**Step 1 — Welcome:**
- Friendly mascot/character illustration (owl or speech bubble character)
- "What's your name?" input
- "What's your native language?" dropdown (searchable)

**Step 2–4 — Assessment questions:**
- Mix of multiple choice (listening comprehension) + fill-in-blank
- Large, readable question cards
- Answer options: pill buttons, highlight selected in indigo

**Step 5 — Result:**
- Animated badge reveal: "You're a B1 Learner! 🎉"
- Short description of what that means
- "Set Your Daily Goal" (5 / 10 / 20 min selector)
- "Let's Go!" CTA → Dashboard

---

### 4.3 Dashboard

**Layout:** Sidebar nav (left, 240px) + main content area

**Sidebar:**
- LinguaAI logo + wordmark at top
- Nav items: Dashboard, Conversation, Flashcards, Pronunciation, Progress
- Active state: indigo background pill
- Bottom: user avatar + name + plan badge + settings

**Main Content:**

Top bar:
- "Good morning, [Name]! 👋" heading
- Streak badge (🔥 7 days) + XP total

Stat cards row (4 cards):
- Words Learned | Conversations | Avg. Score | Study Time
- Each with icon, number, sparkline trend

Daily Review Banner:
- "You have 12 cards due today" — amber bg, "Review Now" button
- Disappears when all reviewed

Feature Quick-Access (3 large cards):
- AI Conversation → Flashcards → Pronunciation
- Each: icon, title, short status ("3 conversations left today")
- hover lift effect

Recent Activity list at bottom

---

### 4.4 AI Conversation Screen

**Layout:** Full-height chat interface

**Top bar:**
- Topic badge (e.g. "☕ Ordering Coffee") + CEFR level badge
- "End Session" button (top right)
- Session timer (subtle, top center)

**Chat area:**
- User messages: right-aligned, indigo background, white text, radius-lg
- AI messages: left-aligned, white card with shadow, gray text
- AI messages include: small robot/tutor avatar
- Gentle correction inline: corrected text shown in green with strikethrough original
- Typing indicator: animated dots when AI is responding
- Smooth scroll to latest message

**Bottom input:**
- Text input + send button
- Microphone button (toggles voice mode)
- Voice mode: large waveform visualizer, "Listening..." label, tap to stop

**Session End Modal:**
- "Great session! 🎉" heading
- Summary card: words used, mistakes corrected, XP earned
- CTA: "Review New Words" (adds to flashcard deck) + "Go to Dashboard"

---

### 4.5 Flashcards Screen

**Layout:** Centered card stack on neutral background

**Header:**
- "Daily Review" heading + "12 cards remaining" counter
- Progress bar (cards completed / total)

**Card:**
- Large centered card (400px wide, 260px tall on desktop)
- Front: English word in large text (32px, 700) + speaker icon
- Back (flip animation): Translation + example sentence + audio
- Card flip: smooth 3D CSS transform (rotateY 180deg, 300ms)

**Rating buttons (after flip):**
- Three buttons: "Hard 😓" (red) | "Okay 🙂" (amber) | "Easy 😄" (green)
- Full width, large tap targets

**Completion Screen:**
- Confetti animation 🎉
- "Deck complete!" + stats (time, accuracy %)
- Streak update if applicable
- "Back to Dashboard" button

---

### 4.6 Pronunciation Screen

**Layout:** Centered, focused single-task interface

**Top:** Sentence to practice (large, 24px, readable font)

**Shadowing Mode:**
1. Play button → audio plays the sentence (native speaker)
2. "Now you try!" prompt appears
3. Record button (large, red pulsing ring when recording)
4. Waveform display (user's voice vs target waveform, overlaid)
5. Score reveal: animated ring filling to score (e.g. 78%)

**Feedback panel:**
- Overall score badge
- Word-by-word breakdown: green (correct) / red (needs work)
- Phoneme tip: "Try pronouncing 'th' by placing your tongue between your teeth"
- "Try Again" + "Next Sentence" buttons

---

### 4.7 Progress Screen

**Layout:** Dashboard-style, scrollable

**Sections:**
1. **This Week** — bar chart of daily XP (Recharts)
2. **Pronunciation Trend** — line chart of average scores over 30 days
3. **Vocabulary Growth** — total words learned, cards by status (new/learning/mastered)
4. **Conversations** — list of past sessions with topic + date + summary expandable
5. **Achievements** — unlocked badges grid (e.g. "First Conversation", "7-Day Streak")

---

## 5. Motion & Animation Guidelines

```
Page transitions:       fadeIn + slight translateY (200ms, ease-out)
Card hover:             translateY(-2px) + shadow (150ms)
Button press:           scale(0.97) (100ms)
Card flip (flashcard):  rotateY 180deg (300ms, ease-in-out)
Score ring fill:        stroke-dashoffset animation (800ms, ease-out)
XP bar fill:            width animation (600ms, ease-out)
Confetti:               burst from center on completion
Modal open:             scale(0.95→1) + fade (200ms)
Correct answer:         green flash + checkmark bounce
Wrong answer:           red flash + shake (200ms)
Typing indicator:       bouncing dots (infinite, staggered 150ms)
```

---

## 6. Responsive Behavior

```
Breakpoints:
  Mobile:  < 640px
  Tablet:  640–1024px
  Desktop: > 1024px

Mobile adaptations:
- Sidebar becomes bottom navigation bar (5 icons)
- Cards go full-width
- Font sizes scale down ~10%
- Chat input pinned to bottom with safe area inset
- Flashcard buttons become larger (56px height, thumb-friendly)
```

---

## 7. Empty & Loading States

```
Loading skeleton:       Pulsing gray placeholder shapes (not spinners)
Empty flashcard deck:   Illustration + "Add words from a conversation to get started"
No conversations yet:   Illustration + "Start your first conversation" CTA card
Offline state:          Banner at top "You're offline — flashcard review still works"
API error:              Toast notification (bottom right, red, auto-dismiss 4s)
```

---

## 8. Accessibility

- All interactive elements have focus rings (shadow-glow)
- Color is never the only indicator (always paired with icon or text)
- Audio controls always have visual equivalents
- Minimum touch target: 44x44px
- ARIA labels on all icon-only buttons
- Keyboard navigation through flashcards (Space = flip, 1/2/3 = rating)
