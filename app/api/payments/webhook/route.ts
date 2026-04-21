import { NextResponse } from "next/server";
import { verifyPaddleWebhookSignature } from "@/lib/paddle";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type { Plan } from "@/types";

interface PaddleWebhookEvent {
  event_type: string;
  data: Record<string, unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractUserId(data: Record<string, unknown>): string | null {
  const directUserId = data.user_id;
  if (typeof directUserId === "string" && directUserId.trim()) {
    return directUserId;
  }

  if (!isRecord(data.custom_data)) {
    return null;
  }

  const customData = data.custom_data;
  const userId = customData.userId ?? customData.user_id;
  return typeof userId === "string" && userId.trim() ? userId : null;
}

function mapSubscriptionStatusToPlan(status: string, eventType: string): Plan | null {
  if (eventType === "subscription.canceled") {
    return "free";
  }

  if (["active", "trialing", "past_due"].includes(status)) {
    return "pro";
  }

  if (["paused", "canceled", "inactive"].includes(status)) {
    return "free";
  }

  return null;
}

async function syncPlan(userId: string, plan: Plan) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("profiles").update({ plan }).eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("paddle-signature");
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

  if (!signatureHeader || !webhookSecret) {
    console.error("[payments.webhook] Missing Paddle webhook signature context");
    return NextResponse.json({ error: "invalid_webhook_context" }, { status: 400 });
  }

  const isValidSignature = verifyPaddleWebhookSignature({
    rawBody,
    signatureHeader,
    webhookSecret,
  });

  if (!isValidSignature) {
    console.error("[payments.webhook] Invalid Paddle webhook signature");
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let event: PaddleWebhookEvent;

  try {
    event = JSON.parse(rawBody) as PaddleWebhookEvent;
  } catch (error) {
    console.error("[payments.webhook] Failed to parse webhook payload", error);
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const status = typeof event.data.status === "string" ? event.data.status : "";
  const userId = extractUserId(event.data);
  const nextPlan = mapSubscriptionStatusToPlan(status, event.event_type);

  if (userId && nextPlan) {
    try {
      await syncPlan(userId, nextPlan);
    } catch (error) {
      console.error("[payments.webhook] Failed to sync user plan", {
        eventType: event.event_type,
        userId,
        nextPlan,
        error,
      });
    }
  } else {
    console.warn("[payments.webhook] No plan update performed", {
      eventType: event.event_type,
      status,
      userId,
    });
  }

  return NextResponse.json({ ok: true });
}
