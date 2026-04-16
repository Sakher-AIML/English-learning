interface PhonemeItem {
  word: string;
  correct: boolean;
  phonemeTip?: string;
}

export function PhonemeBreakdown({ items }: { items: PhonemeItem[] }) {
  return (
    <section className="surface-card space-y-3 p-4 text-left">
      <h2 className="text-lg font-bold">Word feedback</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.word}
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              item.correct ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
            }`}
          >
            {item.word}
          </span>
        ))}
      </div>
      {items.find((item) => item.phonemeTip)?.phonemeTip ? (
        <p className="text-sm text-text-2">Tip: {items.find((item) => item.phonemeTip)?.phonemeTip}</p>
      ) : null}
    </section>
  );
}
