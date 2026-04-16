"use client";

const topics = [
  "☕ Ordering Coffee",
  "🏥 At the Doctor",
  "💼 Job Interview",
  "🛫 Travel",
  "🤝 Making Friends",
  "🛒 Shopping",
];

export function TopicSelector() {
  return (
    <div className="rounded-full border bg-surface px-3 py-2 text-xs font-semibold text-text-2">
      {topics[0]}
    </div>
  );
}
