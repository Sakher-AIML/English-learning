import Link from "next/link";
import { MessageCircleMore, Mic2, Sparkles } from "lucide-react";

const featureCards = [
  {
    title: "AI Conversation",
    description: "Practice practical dialogues with gentle corrections at your CEFR level.",
    icon: MessageCircleMore,
  },
  {
    title: "Smart Flashcards",
    description: "Review words on the perfect day with an SM-2 spaced repetition schedule.",
    icon: Sparkles,
  },
  {
    title: "Pronunciation Coach",
    description: "Record, score, and improve with word-level speaking feedback.",
    icon: Mic2,
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 md:px-10">
      <header className="surface-card relative overflow-hidden p-7 md:p-10">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-secondary/20 blur-3xl" />

        <p className="relative mb-3 inline-flex rounded-full bg-secondary px-4 py-1 text-sm font-semibold text-white">
          LinguaAI MVP
        </p>
        <h1 className="relative text-4xl font-extrabold leading-tight text-text-1 md:text-6xl">
          Speak English. For Real.
        </h1>
        <p className="relative mt-5 max-w-2xl text-base text-text-2 md:text-lg">
          AI conversation, smart flashcards, and pronunciation feedback in one playful
          learning loop.
        </p>

        <div className="relative mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            Start for Free
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-full border bg-white px-6 py-3 text-sm font-semibold text-text-1 transition hover:-translate-y-0.5"
          >
            I already have an account
          </Link>
        </div>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {featureCards.map(({ title, description, icon: Icon }) => (
          <article key={title} className="surface-card p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
            <div className="mb-3 inline-flex rounded-full bg-surface-2 p-3 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-text-1">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-2">{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
