"use server";

const headers = {
  "Content-Type": "application/json",
  "blessed-api-key": process.env.BLESSED_API_KEY!
}

export const getTicketDetails = async () => {
  const res = await fetch(`${process.env.BLESSED_API_URL}/events/${process.env.BLESSED_EVENT_SLUG}/tickets/${process.env.BLESSED_TICKET_ID}/details`, {
    headers
  });
  return res.json();
};

export const login = async (email: string) => {
  const res = await fetch(`${process.env.BLESSED_API_URL}/users/login`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email })
  });
  return res.json();
};

export const verify = async (code: string) => {
  const res = await fetch(`${process.env.BLESSED_API_URL}/users/verify`, {
    method: "POST",
    headers,
    body: JSON.stringify({ code })
  });
  return res.json();
};

export const createStripeCheckout = async (userId: string, ticketId: string) => {
  const url = `${process.env.BLESSED_API_URL}/events/${process.env.BLESSED_EVENT_SLUG}/tickets/${process.env.BLESSED_TICKET_ID}/checkout-session`

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      ticketId,
      userId,
      eventSlug: process.env.BLESSED_EVENT_SLUG
    })
  });

  return res.json();
}