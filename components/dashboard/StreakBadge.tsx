export function StreakBadge({ days }: { days: number }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-secondary to-danger px-4 py-2 text-sm font-bold text-white">
      {days} day streak
    </span>
  );
}
