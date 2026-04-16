import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as { score?: number };
  const score = payload.score ?? 45;

  const cefrLevel = score < 20 ? "A1" : score < 40 ? "A2" : score < 60 ? "B1" : score < 80 ? "B2" : "C1";

  return NextResponse.json({ cefrLevel });
}