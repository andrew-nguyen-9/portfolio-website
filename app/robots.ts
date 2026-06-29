import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";

const SITE = "https://an9.dev";

// Allow indexing everywhere except the API. Point crawlers at the root sitemap index
// (which fans out to the apex + every live subdomain sitemap) and also list each live
// subdomain sitemap directly, so the whole *.an9.dev family is discoverable. Live
// subdomains are derived from the project registry.
export default function robots(): MetadataRoute.Robots {
  const subdomainSitemaps = projects
    .filter((p) => p.status === "live")
    .map((p) => `https://${p.subdomain}/sitemap.xml`);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: [`${SITE}/sitemap_index.xml`, ...subdomainSitemaps],
    host: SITE,
  };
}
