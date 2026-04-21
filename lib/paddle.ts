import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const PADDLE_API_BASE_URL =
  process.env.PADDLE_ENVIRONMENT === "production"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";

interface PaddleApiResponse<T> {
  data: T;
}

type JsonObject = Record<string, unknown>;

function getPaddleApiKey() {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing PADDLE_API_KEY.");
  }

  return apiKey;
}

async function paddleRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${PADDLE_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getPaddleApiKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Paddle request failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as PaddleApiResponse<T>;
  return payload.data;
}

export async function createPaddleCheckoutTransaction({
  priceId,
  quantity = 1,
  customData,
}: {
  priceId: string;
  quantity?: number;
  customData?: JsonObject;
}) {
  const requestBody: JsonObject = {
    items: [{ price_id: priceId, quantity }],
  };

  if (customData) {
    requestBody.custom_data = customData;
  }

  const transaction = await paddleRequest<{ id: string; checkout?: { url?: string } }>("/transactions", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  return {
    transactionId: transaction.id,
    checkoutUrl: transaction.checkout?.url ?? null,
  };
}

export async function getPaddleSubscription(subscriptionId: string) {
  return paddleRequest<JsonObject>(`/subscriptions/${subscriptionId}`);
}

export function verifyPaddleWebhookSignature({
  rawBody,
  signatureHeader,
  webhookSecret,
}: {
  rawBody: string;
  signatureHeader: string;
  webhookSecret: string;
}): boolean {
  const parts = signatureHeader.split(";").map((entry) => entry.trim());
  const timestampPart = parts.find((entry) => entry.startsWith("ts="));
  const hashPart = parts.find((entry) => entry.startsWith("h1="));

  if (!timestampPart || !hashPart) {
    return false;
  }

  const timestamp = timestampPart.slice(3);
  const hash = hashPart.slice(3);

  if (!timestamp || !hash) {
    return false;
  }

  const signedPayload = `${timestamp}:${rawBody}`;
  const digest = createHmac("sha256", webhookSecret).update(signedPayload, "utf8").digest("hex");

  const left = Buffer.from(digest, "utf8");
  const right = Buffer.from(hash, "utf8");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}
