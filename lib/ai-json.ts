import "server-only";

function stripCodeFence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.startsWith("```") || !trimmed.endsWith("```")) {
    return trimmed;
  }

  return trimmed
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
}

function extractBracedJson(value: string): string {
  const start = value.indexOf("{");
  const end = value.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not contain a JSON object.");
  }

  return value.slice(start, end + 1);
}

export function parseJsonResponse<T>(rawResponse: string): T {
  const normalized = stripCodeFence(rawResponse);

  try {
    return JSON.parse(normalized) as T;
  } catch {
    return JSON.parse(extractBracedJson(normalized)) as T;
  }
}
