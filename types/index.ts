export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type Plan = "free" | "pro";

export interface Profile {
  id: string;
  name?: string;
  nativeLanguage?: string;
  cefrLevel: CEFRLevel;
  xp: number;
  streakDays: number;
  plan: Plan;
  dailyGoalMinutes: number;
}

export interface Flashcard {
  id: string;
  userId: string;
  word: string;
  translation?: string;
  exampleSentence?: string;
  interval: number;
  repetition: number;
  easiness: number;
  nextReview: string;
}

export interface WordFeedback {
  word: string;
  correct: boolean;
  phonemeTip?: string;
}

export interface PronunciationScoreResponse {
  score: number;
  transcript: string;
  wordFeedback: WordFeedback[];
  tip: string;
}