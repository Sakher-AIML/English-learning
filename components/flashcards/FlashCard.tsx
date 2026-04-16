"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface FlashCardProps {
  word: string;
  translation?: string;
  example?: string;
}

export function FlashCard({ word, translation, example }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <article className="surface-card mx-auto w-full max-w-md p-6 text-center">
      {!flipped ? (
        <>
          <p className="text-sm font-semibold uppercase tracking-wide text-text-2">Word</p>
          <h2 className="mt-4 text-4xl font-extrabold">{word}</h2>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-text-2">Translation</p>
          <h3 className="mt-2 text-2xl font-bold">{translation || "-"}</h3>
          {example ? <p className="mt-4 text-sm text-text-2">{example}</p> : null}
        </>
      )}

      <Button variant="secondary" className="mt-6" onClick={() => setFlipped((prev) => !prev)}>
        {flipped ? "Show front" : "Flip card"}
      </Button>
    </article>
  );
}
