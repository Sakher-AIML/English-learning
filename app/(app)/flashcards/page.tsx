import { DeckProgress } from "@/components/flashcards/DeckProgress";
import { FlashCard } from "@/components/flashcards/FlashCard";
import { RatingButtons } from "@/components/flashcards/RatingButtons";

export default function FlashcardsPage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="space-y-1 text-center">
        <h1 className="text-3xl font-extrabold">Daily Review</h1>
        <p className="text-sm text-text-2">12 cards remaining</p>
      </header>

      <DeckProgress completed={4} total={12} />
      <FlashCard word="appointment" translation="rendez-vous" example="I have a doctor appointment at noon." />
      <RatingButtons />
    </section>
  );
}
