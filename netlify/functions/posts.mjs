// Pulls your published posts from Beehiiv so they show on creativetechbro.com.
// Needs env vars BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID (set in Netlify).
//   GET /api/posts            -> latest posts (list)
//   GET /api/posts?slug=xyz   -> one post with full content

const API = "https://api.beehiiv.com/v2";

export function category(tags = []) {
  const t = tags.join(" ").toLowerCase();
  if (t.includes("interview")) return "interview";
  if (t.includes("article") || t.includes("feature") || t.includes("essay")) return "article";
  return "brief";
}

export function cleanHtml(html = "") {
  let body = html;
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (m) body = m[1];
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

export function shape(p, withContent = false) {
  const tags = p.content_tags || [];
  const out = {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle || p.preview_text || p.meta_default_description || "",
    date: p.publish_date ? new Date(p.publish_date * 1000).toISOString() : null,
    image: p.thumbnail_url || null,
    tags,
    category: category(tags),
    authors: p.authors || [],
  };
  if (withContent) out.html = cleanHtml(p?.content?.free?.web || "");
  return out;
}

const json = (data, status = 200, cache = true) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
      ...(cache ? { "Netlify-CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } : {}),
    },
  });

export default async (req) => {
  const key = process.env.BEEHIIV_API_KEY;
  const pub = process.env.BEEHIIV_PUBLICATION_ID;
  if (!key || !pub) return json({ configured: false, posts: [] }, 200, false);

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const params = new URLSearchParams({
    status: "confirmed",
    order_by: "publish_date",
    direction: "desc",
    limit: slug ? "100" : "30",
    hidden_from_feed: "false",
  });
  if (slug) params.append("expand[]", "free_web_content");

  try {
    const res = await fetch(`${API}/publications/${pub}/posts?${params}`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return json({ configured: true, error: `beehiiv ${res.status}`, posts: [] }, 502, false);
    const { data = [] } = await res.json();
    if (slug) {
      const p = data.find((x) => x.slug === slug);
      return p ? json({ post: shape(p, true) }) : json({ error: "not found" }, 404, false);
    }
    return json({ configured: true, posts: data.map((p) => shape(p)) });
  } catch (e) {
    return json({ configured: true, error: "fetch failed", posts: [] }, 502, false);
  }
};

export const config = { path: "/api/posts" };
