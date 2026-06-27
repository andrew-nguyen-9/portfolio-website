#!/usr/bin/env node
// SEO coverage audit (v4.6.5). Static, no server — catches a page shipped without
// metadata, a content route missing its OG image, or a sitemap that forgot a section.
// Runtime Core Web Vitals / Lighthouse stay a post-deploy step (must run against a
// production build, not next dev — see docs).
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const appDir = path.join(root, "app");
let errors = 0;
const fail = (msg) => { console.error(`✗ ${msg}`); errors++; };

// Pages exempt from the metadata-export rule:
//  - app/page.tsx: home, metadata authored in app/layout.tsx (manual <head> under CSP)
//  - keystatic/*: dev-only admin, never indexed
function isExempt(rel) {
  return rel === "page.tsx" || rel.includes("keystatic");
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === "page.tsx") checkPage(full);
  }
}

function checkPage(full) {
  const rel = path.relative(appDir, full);
  if (isExempt(rel)) return;
  const src = fs.readFileSync(full, "utf8");
  const hasMeta =
    /export\s+const\s+metadata\b/.test(src) ||
    /export\s+(async\s+)?function\s+generateMetadata\b/.test(src);
  if (!hasMeta) fail(`${rel}: no metadata / generateMetadata export`);
}

// 1) Every indexable page exports metadata.
walk(appDir);

// 2) Dynamic content routes ship a programmatic OG image.
const ogRoutes = [
  "app/projects/[id]/opengraph-image.tsx",
  "app/writing/[slug]/opengraph-image.tsx",
];
for (const r of ogRoutes) {
  if (!fs.existsSync(path.join(root, r))) fail(`missing OG image route: ${r}`);
}

// 3) Sitemap covers projects + articles (not just static routes).
const sitemap = fs.readFileSync(path.join(appDir, "sitemap.ts"), "utf8");
if (!/projects/.test(sitemap)) fail("sitemap.ts does not reference projects");
if (!/getAllArticles/.test(sitemap)) fail("sitemap.ts does not reference articles");

if (errors > 0) {
  console.error(`\n${errors} SEO coverage error(s).`);
  process.exit(1);
}
console.log("✓ SEO coverage OK");
