import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import { now, lead, nowUpdated } from "@/content/now";

const SITE = "https://an9.dev";

export const metadata: Metadata = {
  title: "Now — an9.dev",
  description: "What Andrew Nguyen is building and focused on right now.",
  alternates: { canonical: `${SITE}/now` },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function NowPage() {
  return (
    <SiteChrome>
      <section className="section" aria-labelledby="now-heading" style={{ maxWidth: 760 }}>
        <span className="section-num" data-num="N" aria-hidden="true" />
        <p
          className="text-xs tracking-[0.25em] uppercase mb-5 eyebrow"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          Now · updated {formatDate(nowUpdated)}
        </p>
        <h1
          id="now-heading"
          className="leading-[1.05] tracking-tight mb-6"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          What I&apos;m building
        </h1>
        <p
          className="mb-14 max-w-2xl"
          style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "1.25rem", lineHeight: 1.6 }}
        >
          {lead}
        </p>

        <div>
          {now.map((entry) => (
            <div key={entry.date} className="now-entry">
              <p className="now-entry-date">{formatDate(entry.date)}</p>
              <p className="now-entry-body">{entry.body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteChrome>
  );
}
