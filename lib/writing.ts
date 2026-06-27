import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Git-based content engine: MDX files in content/writing are the source of truth.
// No CMS, no DB — articles are authored as files and read at build time. (A
// Keystatic authoring GUI over these same files was considered and deferred to v4.7.)

const WRITING_DIR = path.join(process.cwd(), "content/writing");

export interface ArticleMeta {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string; // ISO date, e.g. "2026-06-20"
  tags: string[];
  readingMinutes: number;
}

export interface Article extends ArticleMeta {
  content: string; // raw MDX body (compiled by the page)
}

// ~200 wpm is the conventional silent-reading baseline; min 1 so nothing reads "0 min".
function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function listSlugs(): string[] {
  if (!fs.existsSync(WRITING_DIR)) return [];
  return fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getArticle(slug: string): Article | null {
  const file = path.join(WRITING_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    publishedAt: String(data.publishedAt ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingMinutes: readingMinutes(content),
    content,
  };
}

// Newest first. ponytail: re-reads every file (parses content it then drops) — fine
// for a personal blog's handful of posts; revisit only if the count gets large.
export function getAllArticles(): ArticleMeta[] {
  return listSlugs()
    .map((slug) => getArticle(slug))
    .filter((a): a is Article => a !== null)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .map((a): ArticleMeta => ({
      slug: a.slug,
      title: a.title,
      summary: a.summary,
      publishedAt: a.publishedAt,
      tags: a.tags,
      readingMinutes: a.readingMinutes,
    }));
}

export function getAllSlugs(): string[] {
  return listSlugs();
}
