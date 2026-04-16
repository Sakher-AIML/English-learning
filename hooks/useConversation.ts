"use client";

import { useMutation } from "@tanstack/react-query";

interface ConversationPayload {
  conversationId: string;
  message: string;
  cefrLevel: string;
  topic: string;
}

export function useConversation() {
  return useMutation({
    mutationFn: async (payload: ConversationPayload) => {
      const response = await fetch("/api/conversation/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to send message.");
      }

      return (await response.json()) as { reply: string; correction?: string; xpEarned: number };
    },
  });
}
