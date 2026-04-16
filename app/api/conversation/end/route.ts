import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    wordsUsed: 54,
    xpEarned: 28,
    tip: "Try using one transition phrase, such as 'however' or 'therefore', in your next answer.",
  });
}
