export function WaveformDisplay() {
  return (
    <div className="surface-card flex h-20 items-end justify-center gap-1 p-3">
      {Array.from({ length: 28 }).map((_, index) => (
        <span
          key={index}
          className="w-1 rounded-full bg-primary/60"
          style={{ height: `${10 + ((index * 17) % 50)}px` }}
        />
      ))}
    </div>
  );
}
