import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/writing";

const SITE = "https://an9.dev";

// Apex routes + every published article. Project subdomains (*.an9.dev) are separate
// origins and carry their own sitemaps; this covers what lives on the apex.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/writing`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/now`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/uses`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const articles: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${SITE}/writing/${a.slug}`,
    lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articles];
}
