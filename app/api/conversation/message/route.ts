import { NextResponse } from "next/server";
import { parseJsonResponse } from "@/lib/ai-json";
import { generateGeminiText } from "@/lib/gemini";
import { createOpenRouterChatCompletion } from "@/lib/openrouter";

interface MessagePayload {
  conversationId: string;
  message: string;
  cefrLevel: string;
  topic: string;
}

interface ConversationResult {
  reply: string;
  correction?: string;
  xpEarned: number;
}

function buildConversationPrompt(payload: MessagePayload) {
  return [
    "Return strict JSON only.",
    '{"reply":"string","correction":"string optional","xpEarned":number}',
    "You are an encouraging English tutor.",
    `CEFR level: ${payload.cefrLevel}`,
    `Topic: ${payload.topic}`,
    "Rules:",
    "- Keep the reply concise (2-4 short sentences).",
    "- If the user made a mistake, provide a gentle corrected sentence in correction.",
    "- If there is no clear mistake, omit correction.",
    "- xpEarned must be an integer between 4 and 12.",
    `User message: ${payload.message}`,
  ].join("\n");
}

function sanitizeConversationResult(result: ConversationResult): ConversationResult {
  const xp = Number.isFinite(result.xpEarned) ? Math.round(result.xpEarned) : 6;
  return {
    reply: result.reply,
    correction: result.correction,
    xpEarned: Math.min(12, Math.max(4, xp)),
  };
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<MessagePayload>;

  if (!payload.message || !payload.conversationId || !payload.cefrLevel || !payload.topic) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const safePayload: MessagePayload = {
    conversationId: payload.conversationId,
    message: payload.message,
    cefrLevel: payload.cefrLevel,
    topic: payload.topic,
  };

  const prompt = buildConversationPrompt(safePayload);

  try {
    const openRouterOutput = await createOpenRouterChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "You are a CEFR-aware English conversation tutor. Always return only JSON matching the requested schema.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.65,
      maxTokens: 450,
    });

    return NextResponse.json(
      sanitizeConversationResult(parseJsonResponse<ConversationResult>(openRouterOutput)),
    );
  } catch (openRouterError) {
    console.error("[conversation.message] OpenRouter integration failed", openRouterError);
  }

  try {
    const geminiOutput = await generateGeminiText(prompt);
    return NextResponse.json(sanitizeConversationResult(parseJsonResponse<ConversationResult>(geminiOutput)));
  } catch (geminiError) {
    console.error("[conversation.message] Gemini integration failed", geminiError);
    return NextResponse.json(
      { error: "ai_provider_error", message: "Unable to generate a tutor response at the moment." },
      { status: 502 },
    );
  }
}
