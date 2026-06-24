import type { MetadataRoute } from "next";

const SITE = "https://an9.dev";

// Single-page site — the homepage is the one indexable route. The project
// subdomains (*.an9.dev) are separate origins and carry their own sitemaps.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
