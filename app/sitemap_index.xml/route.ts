import { projects } from "@/content/projects";

const SITE = "https://an9.dev";

// Root sitemap index (v5.5). References the apex sitemap plus every live project
// subdomain's own sitemap, so search engines discover the whole *.an9.dev family from
// one entry point. robots.ts points crawlers here. Live subdomains are derived from the
// project registry so the index tracks the family as builds go live.
export const dynamic = "force-static";

function sitemapUrls(): string[] {
  const live = projects
    .filter((p) => p.status === "live")
    .map((p) => `https://${p.subdomain}/sitemap.xml`);
  return [`${SITE}/sitemap.xml`, ...live];
}

export function GET() {
  const lastmod = new Date().toISOString();
  const entries = sitemapUrls()
    .map((loc) => `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
