"use client";

import { useQuery } from "@tanstack/react-query";
import type { Flashcard } from "@/types";

export function useFlashcards() {
  return useQuery({
    queryKey: ["flashcards", "due"],
    queryFn: async () => {
      const response = await fetch("/api/cards/due", { method: "GET" });
      if (!response.ok) {
        throw new Error("Unable to load due cards.");
      }

      return (await response.json()) as Flashcard[];
    },
  });
}
