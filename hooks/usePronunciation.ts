"use client";

import { useMutation } from "@tanstack/react-query";
import type { PronunciationScoreResponse } from "@/types";

export function usePronunciation() {
  return useMutation({
    mutationFn: async ({ audio, targetText }: { audio: Blob; targetText: string }) => {
      const formData = new FormData();
      formData.append("audio", audio, "practice.webm");
      formData.append("targetText", targetText);

      const response = await fetch("/api/pronunciation/score", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Unable to score pronunciation.");
      }

      return (await response.json()) as PronunciationScoreResponse;
    },
  });
}
