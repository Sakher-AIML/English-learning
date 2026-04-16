import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    score: 78,
    transcript: "Could you tell me where the nearest station is",
    wordFeedback: [
      { word: "Could", correct: true },
      { word: "nearest", correct: false, phonemeTip: "Stretch the vowel in 'near'." },
      { word: "station", correct: true },
    ],
    tip: "Focus on the long vowel in 'nearest'.",
  });
}
