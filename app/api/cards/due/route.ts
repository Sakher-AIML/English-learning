import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: crypto.randomUUID(),
      userId: "demo-user",
      word: "appointment",
      translation: "rendez-vous",
      exampleSentence: "I have an appointment this afternoon.",
      interval: 6,
      repetition: 2,
      easiness: 2.4,
      nextReview: new Date().toISOString(),
    },
  ]);
}
