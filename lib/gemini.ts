import "server-only";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
export const GEMINI_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL ?? "gemini-2.0-flash";
export const GEMINI_AUDIO_MODEL = process.env.GEMINI_AUDIO_MODEL ?? GEMINI_TEXT_MODEL;

interface GeminiPart {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
}

function getGeminiApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY.");
  }

  return apiKey;
}

async function requestGemini(parts: GeminiPart[], model: string, temperature = 0.5): Promise<string> {
  const endpoint = `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${getGeminiApiKey()}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as GeminiResponse;
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}

export async function generateGeminiText(prompt: string, model = GEMINI_TEXT_MODEL): Promise<string> {
  return requestGemini([{ text: prompt }], model, 0.6);
}

export async function generateGeminiAudioAnalysis({
  prompt,
  audioBase64,
  mimeType,
  model = GEMINI_AUDIO_MODEL,
}: {
  prompt: string;
  audioBase64: string;
  mimeType: string;
  model?: string;
}): Promise<string> {
  return requestGemini(
    [
      { text: prompt },
      {
        inline_data: {
          mime_type: mimeType,
          data: audioBase64,
        },
      },
    ],
    model,
    0.35,
  );
}
