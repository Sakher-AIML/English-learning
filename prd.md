# LinguaAI — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** April 2026  
**Author:** Solo Founder  
**Platform:** Web (Browser)  
**Stack:** React / Next.js

---

## 1. Product Overview

### 1.1 Vision
LinguaAI is a web-based English learning app for non-English speakers worldwide. It combines AI-powered conversation, spaced repetition flashcards, and pronunciation tools into a single, engaging learning loop — making English acquisition faster, more personalized, and more enjoyable than traditional apps.

### 1.2 Mission
Help any non-English speaker go from beginner to confident English communicator using proven language acquisition science, powered by modern AI.

### 1.3 Target Users
- **Primary:** Non-English speakers aged 16–45 learning English for work, education, travel, or personal growth
- **Geography:** Global — no single native language assumed
- **Tech comfort:** Moderate — comfortable using a web browser, may use mobile browser
- **Motivation:** Practical fluency, not academic mastery

---

## 2. Problem Statement

Most language learning apps fail users in three ways:
1. They teach isolated vocabulary instead of contextual, comprehensible language
2. They don't offer real speaking practice — the most critical (and neglected) skill
3. Their review systems are either nonexistent or not personalized

LinguaAI solves all three in a single cohesive product.

---

## 3. Goals & Success Metrics

### 3.1 Business Goals (MVP)
- Launch a working freemium product
- Achieve 1,000 registered users in the first 3 months
- Convert 5% of users to paid tier within 60 days of signup

### 3.2 User Goals
- Users complete at least one session per day
- Users feel measurable progress within the first 2 weeks
- Users rate the speaking practice as "useful" or "very useful"

### 3.3 Key Metrics
| Metric | Target |
|---|---|
| Daily Active Users (DAU) / MAU | > 30% |
| Session length | 10–20 min average |
| Flashcard review completion rate | > 70% |
| Day-7 retention | > 40% |
| Free → Paid conversion | > 5% |

---

## 4. Core Features (MVP v1)

### 4.1 AI Conversation Partner ⭐ Core
Users have real-time text and voice conversations with an AI tutor that adapts to their English level.

**Requirements:**
- User selects a conversation topic (e.g. "ordering food", "job interview", "making friends")
- AI responds naturally, correcting errors gently inline
- Conversation adapts difficulty based on user's CEFR level (auto-detected or user-set)
- After each session, user gets a brief summary: words used, mistakes made, suggestions
- Free tier: 3 conversations/day | Paid: unlimited

### 4.2 Spaced Repetition Flashcards ⭐ Core
A personal vocabulary deck that grows automatically and schedules reviews intelligently.

**Requirements:**
- Words are added from conversation sessions and user manual input
- Uses SM-2 algorithm for review scheduling
- Cards show: word, example sentence, audio pronunciation, translation (auto-detected language)
- User rates recall difficulty (Easy / Medium / Hard) after each card
- Daily review streak with gamified rewards
- Free tier: up to 200 cards | Paid: unlimited

### 4.3 Pronunciation Tools ⭐ Core
Users practice speaking and receive real-time feedback on their pronunciation.

**Requirements:**
- Shadowing mode: hear a sentence, then record yourself saying it
- Pronunciation score (0–100) comparing user's speech to native audio
- Visual waveform feedback showing where pronunciation differed
- Specific phoneme-level feedback (e.g. "Your 'th' sounds like 'd'")
- Free tier: 5 pronunciations/day | Paid: unlimited

### 4.4 Onboarding & Level Assessment
- 5-minute placement quiz (listening + reading + speaking) to detect CEFR level (A1–C1)
- Collects native language for UI localization hints
- Sets daily goal (5 / 10 / 20 min per day)

### 4.5 Progress Dashboard
- Daily streak tracker
- Words learned this week / total
- Pronunciation score trend
- Conversation topics completed
- XP points and level badge (gamification)

---

## 5. Freemium Model

| Feature | Free | Pro ($9.99/mo) |
|---|---|---|
| AI Conversations | 3/day | Unlimited |
| Flashcards | Up to 200 | Unlimited |
| Pronunciation checks | 5/day | Unlimited |
| Conversation history | Last 3 sessions | Full history |
| Progress analytics | Basic | Advanced |
| Offline flashcards | ❌ | ✅ |
| Priority AI responses | ❌ | ✅ |

---

## 6. User Flows

### 6.1 New User Flow
```
Landing Page → Sign Up → Level Assessment → Dashboard → First Conversation Session
```

### 6.2 Returning User Flow
```
Login → Dashboard (shows streak + daily review due) → Flashcard Review → Conversation or Pronunciation Practice
```

### 6.3 Flashcard Loop
```
New word encountered in conversation → Auto-added to deck → 
Appears in daily review → User rates difficulty → SM-2 schedules next review
```

---

## 7. Out of Scope (v1)

- Mobile native apps (iOS/Android)
- Peer-to-peer language matching
- Comprehensible input content library (planned for v2)
- Leaderboards / social features
- Languages other than English as the target

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Speech API accuracy varies by accent | Use Whisper (OpenAI) for high accent tolerance |
| High AI API costs on free tier | Rate limit conversations; use caching for common responses |
| User drop-off after day 3 | Streak system + daily push notifications via email |
| Solo dev bandwidth | Strict MVP scope; use existing libraries (SM-2, shadcn/ui) |

---

## 9. Timeline (Estimated)

| Phase | Duration | Deliverable |
|---|---|---|
| Setup & Auth | Week 1 | Next.js app, Supabase auth, DB schema |
| Flashcard SRS | Week 2–3 | SM-2 engine, card UI, deck management |
| AI Conversation | Week 3–4 | Chat UI, Claude integration, level adaptation |
| Pronunciation Tools | Week 5–6 | Whisper STT, scoring, waveform UI |
| Dashboard + Gamification | Week 7 | XP, streaks, progress charts |
| Freemium + Stripe | Week 8 | Paywall, subscription management |
| Beta Launch | Week 9 | Public launch, feedback loop |
