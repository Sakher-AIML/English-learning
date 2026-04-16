export function XPBar({ currentXP, nextLevelXP }: { currentXP: number; nextLevelXP: number }) {
  const progress = Math.min(100, Math.round((currentXP / nextLevelXP) * 100));

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>XP progress</span>
        <span>
          {currentXP} / {nextLevelXP}
        </span>
      </div>
      <div className="h-3 rounded-full bg-surface-2">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}
