import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteChrome from "@/components/SiteChrome";
import Seo from "@/components/Seo";
import { projects } from "@/content/projects";

const SITE = "https://an9.dev";

// Reads the per-request CSP nonce for inline JSON-LD → must render dynamically (a
// static prerender would bake an empty nonce and the strict CSP would drop it).
export const dynamic = "force-dynamic";

const STATUS_LABEL = { live: "Live", building: "Building", planned: "Planned" } as const;

function getProject(id: string) {
  return projects.find((p) => p.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = getProject(id);
  if (!p) return {};
  const url = `${SITE}/projects/${id}`;
  return {
    title: `${p.name} — an9.dev`,
    description: p.tagline,
    alternates: { canonical: url },
    openGraph: { title: p.name, description: p.tagline, url, type: "website" },
    twitter: { card: "summary_large_image", title: p.name, description: p.tagline },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = getProject(id);
  if (!p) notFound();

  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const url = `${SITE}/projects/${id}`;
  const body = p.writeUp && p.writeUp.length > 0 ? p.writeUp : [p.description];

  // SoftwareApplication — these are tools/apps. Links to repo + live site as `sameAs`.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#project`,
    name: p.name,
    description: p.description,
    url,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    author: { "@type": "Person", name: "Andrew Nguyen", url: SITE },
    keywords: p.tags.join(", "),
    sameAs: [
      p.status !== "planned" ? `https://${p.subdomain}` : null,
      p.repoUrl ?? null,
    ].filter(Boolean),
  };

  return (
    <SiteChrome>
      <Seo
        title={`${p.name} — an9.dev`}
        description={p.tagline}
        canonical={url}
        ogImage={`${url}/opengraph-image`}
      />
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="section" style={{ maxWidth: 820 }}>
        <Link
          href="/#projects"
          className="inline-block mb-10 text-sm eyebrow hover:text-[var(--primary)] transition-colors"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          ← Projects
        </Link>

        <p
          className="text-xs tracking-[0.2em] uppercase mb-4 eyebrow flex flex-wrap gap-x-4 gap-y-1"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          <span>{STATUS_LABEL[p.status]}</span>
          <span>{p.category}</span>
        </p>

        <h1
          className="leading-[1.05] tracking-tight mb-4"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          {p.name}
        </h1>
        <p
          className="mb-10"
          style={{
            fontFamily: "var(--font-newsreader), serif",
            fontStyle: "italic",
            fontSize: "1.3rem",
            lineHeight: 1.4,
            color: "var(--fg-muted)",
          }}
        >
          {p.tagline}
        </p>

        <div className="article-prose">
          {body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {p.screenshots && p.screenshots.length > 0 && (
          <div className="project-shots">
            {p.screenshots.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element -- remote art; CSP img-src allows https:, avoids next.config remotePatterns
              <img key={s.url} src={s.url} alt={s.alt} loading="lazy" className="project-shot" />
            ))}
          </div>
        )}

        {p.whatILearned && p.whatILearned.length > 0 && (
          <div className="mt-12">
            <p
              className="text-[0.65rem] tracking-[0.22em] uppercase mb-3 eyebrow"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              What I learned
            </p>
            <ul className="project-learned">
              {p.whatILearned.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <ul className="project-detail-tags mt-10">
          {p.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className="project-detail-links mt-8">
          {p.status !== "planned" && (
            <a href={`https://${p.subdomain}`} target="_blank" rel="noopener noreferrer">
              Visit ↗
            </a>
          )}
          {p.repoUrl && (
            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer">
              Repo ↗
            </a>
          )}
          {p.status === "planned" && !p.repoUrl && (
            <span className="project-detail-note">In planning — no public link yet</span>
          )}
        </div>
      </article>
    </SiteChrome>
  );
}
