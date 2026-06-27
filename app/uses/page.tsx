import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import Seo from "@/components/Seo";
import AffiliateLink from "@/components/AffiliateLink";
import Disclosure from "@/components/Disclosure";
import { uses } from "@/content/uses";

const SITE = "https://an9.dev";
const DESC = "The tools, services, and gear Andrew Nguyen actually reaches for when building.";

export const metadata: Metadata = {
  title: "Uses — an9.dev",
  description: "The tools, services, and gear Andrew Nguyen actually reaches for when building.",
  alternates: { canonical: `${SITE}/uses` },
};

export default function UsesPage() {
  const hasAffiliate = uses.some((g) => g.items.some((i) => i.affiliate));

  return (
    <SiteChrome>
      <Seo title="Uses — an9.dev" description={DESC} canonical={`${SITE}/uses`} ogImage={`${SITE}/og`} />
      <section className="section" aria-labelledby="uses-heading" style={{ maxWidth: 820 }}>
        <span className="section-num" data-num="U" aria-hidden="true" />
        <p
          className="text-xs tracking-[0.25em] uppercase mb-5 eyebrow"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          Uses
        </p>
        <h1
          id="uses-heading"
          className="leading-[1.0] tracking-tight mb-6"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          What I build with
        </h1>
        <p className="text-base leading-relaxed mb-8 max-w-2xl" style={{ color: "var(--fg-muted)" }}>
          The short list of things I actually reach for. No sponsorships, just what stays
          installed.
        </p>

        {hasAffiliate && (
          <div className="mb-12">
            <Disclosure />
          </div>
        )}

        {uses.map((group) => (
          <div key={group.title} className="uses-group">
            <p
              className="text-[0.65rem] tracking-[0.22em] uppercase mb-3 eyebrow"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              {group.title}
            </p>
            {group.items.map((item) => (
              <div key={item.name} className="uses-item">
                <p className="uses-item-name">
                  {item.href ? (
                    item.affiliate ? (
                      <AffiliateLink href={item.href}>{item.name}</AffiliateLink>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--primary)] transition-colors"
                      >
                        {item.name}
                      </a>
                    )
                  ) : (
                    item.name
                  )}
                </p>
                <p className="uses-item-note">{item.note}</p>
              </div>
            ))}
          </div>
        ))}
      </section>
    </SiteChrome>
  );
}
