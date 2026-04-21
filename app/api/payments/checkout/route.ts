import { NextResponse } from "next/server";
import { createPaddleCheckoutTransaction } from "@/lib/paddle";

interface CheckoutPayload {
  priceId: string;
  userId?: string;
  quantity?: number;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as Partial<CheckoutPayload>;

  if (!payload.priceId) {
    return NextResponse.json({ error: "missing_price_id" }, { status: 400 });
  }

  try {
    const checkout = await createPaddleCheckoutTransaction({
      priceId: payload.priceId,
      quantity: payload.quantity ?? 1,
      customData: payload.userId ? { userId: payload.userId } : undefined,
    });

    return NextResponse.json(checkout);
  } catch (error) {
    console.error("[payments.checkout] Paddle checkout creation failed", error);
    return NextResponse.json(
      { error: "checkout_failed", message: "Unable to start Paddle checkout." },
      { status: 502 },
    );
  }
}
