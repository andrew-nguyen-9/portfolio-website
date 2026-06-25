import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import SiteChrome from "@/components/SiteChrome";
import { mdxComponents } from "@/components/mdx";
import { getArticle } from "@/lib/writing";

const SITE = "https://an9.dev";
const AUTHOR = "Andrew Nguyen";

// The page reads the per-request CSP nonce (headers()) for its inline JSON-LD, so it
// must render dynamically — a static prerender would bake an empty nonce and the
// strict CSP would drop the structured data at runtime. (No generateStaticParams:
// it would re-force static prerender and reintroduce that bug.)
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `${SITE}/writing/${slug}`;
  return {
    title: `${article.title} — an9.dev`,
    description: article.summary,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.summary,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [AUTHOR],
      tags: article.tags,
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.summary },
  };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const url = `${SITE}/writing/${slug}`;

  const { content } = await compileMDX({
    source: article.content,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  // Article structured data — same nonce'd inline pattern as the homepage JSON-LD.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    keywords: article.tags.join(", "),
    url,
    mainEntityOfPage: url,
    author: { "@type": "Person", name: AUTHOR, url: SITE },
    publisher: { "@type": "Person", name: AUTHOR, url: SITE },
  };

  return (
    <SiteChrome>
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="section" style={{ maxWidth: 760 }}>
        <Link
          href="/writing"
          className="inline-block mb-10 text-sm eyebrow hover:text-[var(--primary)] transition-colors"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          ← Writing
        </Link>

        <p
          className="text-xs tracking-[0.2em] uppercase mb-4 eyebrow flex flex-wrap gap-x-4 gap-y-1"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          <span>{formatDate(article.publishedAt)}</span>
          <span>{article.readingMinutes} min read</span>
        </p>

        <h1
          className="leading-[1.05] tracking-tight mb-8"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          {article.title}
        </h1>

        <div className="article-prose">{content}</div>

        {article.tags.length > 0 && (
          <ul className="project-detail-tags mt-12">
            {article.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </article>
    </SiteChrome>
  );
}
