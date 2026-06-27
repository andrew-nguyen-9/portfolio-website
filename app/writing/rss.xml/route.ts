import { getAllArticles } from "@/lib/writing";

const SITE = "https://an9.dev";

// Minimal RSS 2.0 — escape the five XML entities so titles/summaries with &, <, >,
// or quotes can't break the feed. ponytail: a feed this small doesn't need a builder dep.
function xml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const articles = getAllArticles();
  const items = articles
    .map((a) => {
      const url = `${SITE}/writing/${a.slug}`;
      const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : "";
      return `    <item>
      <title>${xml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
      <description>${xml(a.summary)}</description>
      ${a.tags.map((t) => `<category>${xml(t)}</category>`).join("\n      ")}
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>an9.dev — Writing</title>
    <link>${SITE}/writing</link>
    <description>Notes on building data-driven passion projects.</description>
    <language>en-US</language>
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
