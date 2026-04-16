export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border bg-gradient-to-br from-primary to-indigo-700 p-4 text-white">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{label}</p>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
    </article>
  );
}
