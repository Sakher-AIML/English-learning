"use client";

import { useState } from "react";
import { initializePaddle } from "@paddle/paddle-js";
import { Button } from "@/components/ui/button";

type CheckoutResponse = {
  transactionId: string;
  checkoutUrl?: string | null;
  error?: string;
  message?: string;
};

const paddleClientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
const paddleEnvironment =
  process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production" ? "production" : "sandbox";
const paddlePriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;

export function UpgradePlanCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    if (!paddlePriceId) {
      setError("Missing NEXT_PUBLIC_PADDLE_PRICE_ID.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: paddlePriceId,
        }),
      });

      const payload = (await response.json()) as CheckoutResponse;

      if (!response.ok || !payload.transactionId) {
        throw new Error(payload.message ?? payload.error ?? "Unable to start checkout.");
      }

      if (paddleClientToken) {
        const paddle = await initializePaddle({
          token: paddleClientToken,
          environment: paddleEnvironment,
        });

        if (paddle) {
          paddle.Checkout.open({
            transactionId: payload.transactionId,
          });
          return;
        }
      }

      if (payload.checkoutUrl) {
        window.location.assign(payload.checkoutUrl);
        return;
      }

      throw new Error("No Paddle checkout session could be opened.");
    } catch (checkoutError) {
      const message = checkoutError instanceof Error ? checkoutError.message : "Checkout failed.";
      setError(message);
      console.error("[dashboard.upgrade] Paddle checkout failed", checkoutError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
      <p className="text-sm font-semibold text-text-2">Unlock Pro</p>
      <h3 className="mt-1 text-xl font-extrabold text-text-1">Unlimited conversations and pronunciation checks</h3>
      <p className="mt-2 text-sm text-text-2">Upgrade with Paddle to remove daily limits and access advanced analytics.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button onClick={handleUpgrade} disabled={isLoading}>
          {isLoading ? "Starting checkout..." : "Upgrade to Pro"}
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm font-semibold text-danger">{error}</p> : null}
    </div>
  );
}
