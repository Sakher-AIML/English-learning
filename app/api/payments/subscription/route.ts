import { NextResponse } from "next/server";
import { getPaddleSubscription } from "@/lib/paddle";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subscriptionId = searchParams.get("subscriptionId");

  if (!subscriptionId) {
    return NextResponse.json({ error: "missing_subscription_id" }, { status: 400 });
  }

  try {
    const subscription = await getPaddleSubscription(subscriptionId);
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("[payments.subscription] Paddle subscription lookup failed", error);
    return NextResponse.json(
      { error: "subscription_lookup_failed", message: "Unable to fetch Paddle subscription." },
      { status: 502 },
    );
  }
}
