// Live AI news wire: headlines + links from major outlets' public RSS feeds.
// Cached at Netlify's edge for 15 minutes so the page stays fast.

export const FEEDS = [
  { source: "TechCrunch", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { source: "The Verge", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml" },
  { source: "VentureBeat", url: "https://venturebeat.com/category/ai/feed/" },
  { source: "MIT Tech Review", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed" },
  { source: "Wired", url: "https://www.wired.com/feed/tag/ai/latest/rss" },
  { source: "Ars Technica", url: "https://arstechnica.com/ai/feed/" },
  { source: "The Guardian", url: "https://www.theguardian.com/technology/artificialintelligence/rss" },
];

const decode = (s = "") =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
};

export function parseFeed(xml, source) {
  const items = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const b of blocks) {
    const title = decode(tag(b, "title"));
    let link = decode(tag(b, "link"));
    if (!link) {
      const alt = b.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i) ||
                  b.match(/<link[^>]*href=["']([^"']+)["']/i);
      link = alt ? alt[1] : "";
    }
    const dateStr = tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date");
    const date = dateStr ? new Date(decode(dateStr)) : null;
    if (title && /^https?:\/\//.test(link)) {
      items.push({ title, link, source, date: date && !isNaN(date) ? date.toISOString() : null });
    }
  }
  return items;
}

async function fetchFeed({ source, url }) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "creativetechbro-wire/1.0 (+https://creativetechbro.com)" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    return parseFeed(await res.text(), source);
  } catch {
    return [];
  }
}

export default async () => {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const cutoff = Date.now() - 4 * 24 * 3600 * 1000;
  const seen = new Set();
  const items = results
    .flat()
    .filter((i) => !i.date || new Date(i.date).getTime() > cutoff)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .filter((i) => {
      const k = i.title.toLowerCase().slice(0, 60);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 40);

  return new Response(JSON.stringify({ updated: new Date().toISOString(), items }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
      "Netlify-CDN-Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
};

export const config = { path: "/api/wire" };
