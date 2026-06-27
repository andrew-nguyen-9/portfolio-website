import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";
import Seo from "@/components/Seo";
import { getAllArticles } from "@/lib/writing";

const SITE = "https://an9.dev";
const TITLE = "Writing — an9.dev";
const DESC =
  "Notes on building data-driven passion projects — the engineering, the data, and the questions behind transit, food, sports, politics, and music.";

export const metadata: Metadata = {
  title: "Writing — an9.dev",
  description:
    "Notes on building data-driven passion projects — the engineering, the data, and the questions behind transit, food, sports, politics, and music.",
  alternates: { canonical: `${SITE}/writing` },
  openGraph: {
    title: "Writing — Andrew Nguyen",
    description: "How I build the projects, and what the data turns up along the way.",
    url: `${SITE}/writing`,
    type: "website",
  },
};

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function WritingIndex() {
  const articles = getAllArticles();

  return (
    <SiteChrome>
      <Seo title={TITLE} description={DESC} canonical={`${SITE}/writing`} ogImage={`${SITE}/og`} />
      <section className="section" aria-labelledby="writing-heading">
        <span className="section-num" data-num="W" aria-hidden="true" />
        <p
          className="text-xs tracking-[0.25em] uppercase mb-5 eyebrow"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          Writing
        </p>
        <h1
          id="writing-heading"
          className="leading-[1.0] tracking-tight mb-6"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Notes from the workbench
        </h1>
        <p className="text-base leading-relaxed mb-14 max-w-2xl" style={{ color: "var(--fg-muted)" }}>
          How I build the projects, and what the data turns up along the way.
        </p>

        {articles.length === 0 ? (
          <p style={{ color: "var(--fg-subtle)" }}>Nothing published yet — soon.</p>
        ) : (
          <ul className="list-none p-0 m-0 flex flex-col">
            {articles.map((a) => (
              <li key={a.slug} style={{ borderTop: "1px solid var(--border)" }}>
                <Link href={`/writing/${a.slug}`} className="article-row">
                  <span className="article-row-main">
                    <span className="article-row-title">{a.title}</span>
                    <span className="article-row-summary">{a.summary}</span>
                  </span>
                  <span className="article-row-meta">
                    <span>{formatDate(a.publishedAt)}</span>
                    <span>{a.readingMinutes} min</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteChrome>
  );
}
