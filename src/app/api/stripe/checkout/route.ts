import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("🔮 process.env.STRIPE_SECRET_KEY: ", process.env.STRIPE_SECRET_KEY)
  try {
    const { userId, ticketId } = await request.json();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/events/${process.env.BLESSED_EVENT_SLUG}/tickets/${process.env.BLESSED_TICKET_ID}/checkout-session`
    console.log("🔥 url: ", url)

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "blessed-api-key": process.env.BLESSED_API_KEY!,
      },
      body: JSON.stringify({
        ticketId,
        userId,
        eventSlug: process.env.BLESSED_EVENT_SLUG
      })
    });

    const session = await res.json();

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.log("🚨 error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}