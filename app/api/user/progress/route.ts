import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    wordsLearned: 146,
    conversations: 28,
    avgScore: 82,
    studyMinutes: 375,
    streakDays: 7,
    xp: 780,
  });
}
