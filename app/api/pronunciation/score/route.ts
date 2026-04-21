import { NextResponse } from "next/server";
import { parseJsonResponse } from "@/lib/ai-json";
import { generateGeminiAudioAnalysis } from "@/lib/gemini";
import { createOpenRouterChatCompletion } from "@/lib/openrouter";
import type { PronunciationScoreResponse, WordFeedback } from "@/types";

interface FormPayload {
  targetText: string;
  audio: File;
}

function normalizeWordFeedback(value: unknown): WordFeedback[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      word: typeof item.word === "string" ? item.word : "",
      correct: Boolean(item.correct),
      phonemeTip: typeof item.phonemeTip === "string" ? item.phonemeTip : undefined,
    }))
    .filter((item) => item.word.length > 0)
    .slice(0, 25);
}

function sanitizePronunciationResult(value: unknown, targetText: string): PronunciationScoreResponse {
  const fallbackWords = targetText
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)
    .slice(0, 12)
    .map((word) => ({ word, correct: true as const }));

  if (!value || typeof value !== "object") {
    return {
      score: 70,
      transcript: targetText,
      wordFeedback: fallbackWords,
      tip: "Try speaking a little slower and stress each syllable clearly.",
    };
  }

  const record = value as Record<string, unknown>;
  const rawScore = typeof record.score === "number" ? record.score : 70;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    score,
    transcript: typeof record.transcript === "string" && record.transcript.trim() ? record.transcript : targetText,
    wordFeedback: normalizeWordFeedback(record.wordFeedback).length
      ? normalizeWordFeedback(record.wordFeedback)
      : fallbackWords,
    tip:
      typeof record.tip === "string" && record.tip.trim()
        ? record.tip
        : "Focus on mouth shape and stress for longer words.",
  };
}

async function parseRequest(request: Request): Promise<FormPayload | null> {
  const form = await request.formData();
  const targetText = form.get("targetText");
  const audio = form.get("audio");

  if (typeof targetText !== "string" || !(audio instanceof File)) {
    return null;
  }

  return { targetText, audio };
}

async function runGeminiAnalysis(payload: FormPayload): Promise<PronunciationScoreResponse> {
  const buffer = Buffer.from(await payload.audio.arrayBuffer());
  const audioBase64 = buffer.toString("base64");
  const mimeType = payload.audio.type || "audio/webm";

  const prompt = [
    "Return strict JSON only with this schema:",
    '{"score": number, "transcript": "string", "wordFeedback": [{"word":"string","correct":boolean,"phonemeTip":"optional string"}], "tip": "string"}',
    "You are evaluating an English learner pronunciation recording.",
    `Target sentence: ${payload.targetText}`,
    "Rules:",
    "- Score must be 0-100.",
    "- transcript should be what you hear in the audio.",
    "- wordFeedback should list key words and whether pronunciation is correct.",
    "- tip should be one concise actionable pronunciation suggestion.",
  ].join("\n");

  const response = await generateGeminiAudioAnalysis({
    prompt,
    audioBase64,
    mimeType,
  });

  return sanitizePronunciationResult(parseJsonResponse<unknown>(response), payload.targetText);
}

async function runOpenRouterRefinement(result: PronunciationScoreResponse, targetText: string) {
  const prompt = [
    "Return strict JSON only with this schema:",
    '{"score": number, "transcript": "string", "wordFeedback": [{"word":"string","correct":boolean,"phonemeTip":"optional string"}], "tip": "string"}',
    "Refine this pronunciation analysis while keeping the same intent:",
    JSON.stringify(result),
    `Target sentence: ${targetText}`,
    "Keep score within +/- 8 points and make tip more actionable.",
  ].join("\n");

  const response = await createOpenRouterChatCompletion({
    messages: [
      {
        role: "system",
        content: "You are a pronunciation coach. Always return strict JSON only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
    maxTokens: 500,
  });

  return sanitizePronunciationResult(parseJsonResponse<unknown>(response), targetText);
}

export async function POST(request: Request) {
  const payload = await parseRequest(request);
  if (!payload) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  let geminiResult: PronunciationScoreResponse;

  try {
    geminiResult = await runGeminiAnalysis(payload);
  } catch (geminiError) {
    console.error("[pronunciation.score] Gemini integration failed", geminiError);
    return NextResponse.json(
      { error: "ai_provider_error", message: "Unable to process pronunciation audio right now." },
      { status: 502 },
    );
  }

  try {
    return NextResponse.json(await runOpenRouterRefinement(geminiResult, payload.targetText));
  } catch (openRouterError) {
    console.error("[pronunciation.score] OpenRouter refinement failed", openRouterError);
    return NextResponse.json(geminiResult);
  }
}
