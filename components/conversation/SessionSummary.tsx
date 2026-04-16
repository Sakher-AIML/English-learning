import { Button } from "../ui/button";

interface SessionSummaryProps {
  wordsUsed: number;
  xpEarned: number;
  tip: string;
}

export function SessionSummary({ wordsUsed, xpEarned, tip }: SessionSummaryProps) {
  return (
    <section className="space-y-3 rounded-2xl border bg-white p-4">
      <h2 className="text-xl font-bold">Great session!</h2>
      <p className="text-sm text-text-2">Words used: {wordsUsed}</p>
      <p className="text-sm text-text-2">XP earned: {xpEarned}</p>
      <p className="text-sm">Tip: {tip}</p>
      <div className="flex gap-2">
        <Button>Add new words</Button>
        <Button variant="secondary">Back to dashboard</Button>
      </div>
    </section>
  );
}
