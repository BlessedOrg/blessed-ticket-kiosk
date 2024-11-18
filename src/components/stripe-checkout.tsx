"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { createStripeCheckout } from "@/actions";


export default function StripeCheckoutButton({ userId, ticketId }: { userId: string, ticketId: string }) {
  console.log({ userId, ticketId });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const stripePromise = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

      const session = await createStripeCheckout(userId, ticketId)

      const stripe = stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({
          sessionId: session.id
        });
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSubmit} disabled={loading}>
      Pay with Stripe
    </Button>
  );
}