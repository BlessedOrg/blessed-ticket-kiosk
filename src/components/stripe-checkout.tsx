"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createStripeCheckout } from "@/actions";
import { useRouter } from "next/navigation";

export default function StripeCheckoutButton({ userId, ticketId }: { userId: string, ticketId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const session = await createStripeCheckout(userId, ticketId)

      console.log("🌳 session: ", session)

      if (session.url) {
        router.push(session.url);
      } else {
        alert("Something went wrong. Please contact the Blessed team");
      }

    } catch (error: any) {
      console.log("🚨 Error on stripe-checkout: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSubmit} disabled={loading} className="w-full">
      Pay with Stripe
    </Button>
  );
}