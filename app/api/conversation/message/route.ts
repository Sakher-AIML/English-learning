import { NextResponse } from "next/server";

interface MessagePayload {
  conversationId: string;
  message: string;
  cefrLevel: string;
  topic: string;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<MessagePayload>;

  if (!payload.message || !payload.conversationId || !payload.cefrLevel || !payload.topic) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  return NextResponse.json({
    reply: "Great attempt. Could you add one more detail to your answer?",
    correction: undefined,
    xpEarned: 8,
  });
}
