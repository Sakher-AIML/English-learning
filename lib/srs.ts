export type Rating = "hard" | "okay" | "easy";

export interface CardSRS {
  interval: number;
  repetition: number;
  easiness: number;
  next_review: Date;
}

function tomorrow(): Date {
  return daysFromNow(1);
}

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export function updateCard(card: CardSRS, rating: Rating): CardSRS {
  const quality = rating === "hard" ? 1 : rating === "okay" ? 3 : 5;

  if (quality < 3) {
    return { ...card, repetition: 0, interval: 1, next_review: tomorrow() };
  }

  const newEasiness = Math.max(
    1.3,
    card.easiness + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
  );

  const newInterval =
    card.repetition === 0
      ? 1
      : card.repetition === 1
        ? 6
        : Math.round(card.interval * card.easiness);

  return {
    interval: newInterval,
    repetition: card.repetition + 1,
    easiness: newEasiness,
    next_review: daysFromNow(newInterval),
  };
}
