export function DeckProgress({ completed, total }: { completed: number; total: number }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="space-y-2">
      <p className="text-sm font-semibold text-text-2">
        {completed} / {total} reviewed
      </p>
      <div className="h-2 rounded-full bg-surface-2">
        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </section>
  );
}
