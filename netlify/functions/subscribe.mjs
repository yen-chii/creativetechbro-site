// Adds a subscriber to your Beehiiv list from the site's signup boxes.
// Needs env vars BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID.

const ok = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return ok({ error: "POST only" }, 405);
  const key = process.env.BEEHIIV_API_KEY;
  const pub = process.env.BEEHIIV_PUBLICATION_ID;
  if (!key || !pub) return ok({ error: "Newsletter isn't connected yet." }, 503);

  let body = {};
  try { body = await req.json(); } catch {}
  const email = String(body.email || "").trim().toLowerCase();
  if (body.company) return ok({ ok: true }); // honeypot: bots fill hidden field
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    return ok({ error: "That email doesn't look right." }, 400);
  }

  try {
    const res = await fetch(`https://api.beehiiv.com/v2/publications/${pub}/subscriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: "creativetechbro.com",
        utm_medium: "website",
        referring_site: String(body.page || "").slice(0, 200),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return ok({ error: "Couldn't subscribe right now, try again in a minute." }, 502);
    return ok({ ok: true });
  } catch {
    return ok({ error: "Couldn't subscribe right now, try again in a minute." }, 502);
  }
};

export const config = { path: "/api/subscribe" };
