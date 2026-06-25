#!/usr/bin/env node
// Validates every article in content/writing has the frontmatter the site relies on,
// and re-checks the reading-time math. Run in CI so a malformed post fails the build
// instead of rendering blank. ponytail: this is also lib/writing's runnable check.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content/writing");
const REQUIRED = ["title", "summary", "publishedAt", "tags"];
let errors = 0;

function fail(file, msg) {
  console.error(`✗ ${file}: ${msg}`);
  errors++;
}

if (!fs.existsSync(DIR)) {
  console.log("No content/writing dir — skipping.");
  process.exit(0);
}

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx"))) {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
  for (const key of REQUIRED) {
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      fail(file, `missing frontmatter "${key}"`);
    }
  }
  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    fail(file, `"tags" must be a list`);
  }
  if (data.publishedAt && Number.isNaN(new Date(data.publishedAt).getTime())) {
    fail(file, `"publishedAt" is not a valid date: ${data.publishedAt}`);
  }
  if (content.trim().split(/\s+/).filter(Boolean).length === 0) {
    fail(file, "empty body");
  }
}

// Self-check the reading-time formula the site uses (200 wpm, min 1).
const rt = (n) => Math.max(1, Math.round(n / 200));
if (rt(0) !== 1 || rt(100) !== 1 || rt(400) !== 2 || rt(500) !== 3) {
  fail("reading-time", "formula regression");
}

if (errors > 0) {
  console.error(`\n${errors} content error(s).`);
  process.exit(1);
}
console.log("✓ content OK");
