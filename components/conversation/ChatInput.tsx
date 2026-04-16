"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function ChatInput({ onSend }: { onSend?: (message: string) => void }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = message.trim();
    if (!next) {
      return;
    }

    onSend?.(next);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="flex-1 rounded-xl border bg-white px-3 py-2 text-sm"
        placeholder="Type your message"
      />
      <Button type="submit">Send</Button>
    </form>
  );
}
