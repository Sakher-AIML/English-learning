"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DailyReviewBanner({ dueCount }: { dueCount: number }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || dueCount <= 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-secondary/30 bg-secondary/15 p-4">
      <p className="text-sm font-semibold text-text-1">{dueCount} cards due today</p>
      <div className="flex gap-2">
        <Button>Review now</Button>
        <Button variant="ghost" onClick={() => setDismissed(true)}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
