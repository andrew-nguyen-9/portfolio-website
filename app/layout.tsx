import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import {
  Inter,
  JetBrains_Mono,
  Cormorant_Garamond,
  Instrument_Serif,
  Newsreader,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Major_Mono_Display,
} from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

// hero + headings
// GeistSans.variable is fixed as "--font-geist-sans" by the geist package;
// --font-display is remapped to it in globals.css

// body
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// code
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// hero name
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// accent / pull-quotes
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

// long-form / writing
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

// data / numbers
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// labels / monospace UI
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

// hero name — typing animation
const majorMonoDisplay = Major_Mono_Display({
  subsets: ["latin"],
  variable: "--font-major-mono",
  display: "swap",
  weight: "400",
});

const SITE_URL = "https://an9.dev";
const SITE_TITLE = "AN9 — Andrew Nguyen, Data Engineer";
const SITE_DESCRIPTION =
  "A portfolio of data-driven passion projects — " +
  "transit, food, sports, politics, and music — each living at its own " +
  "subdomain. Built by Andrew Nguyen in Chicago.";
const OG_DESCRIPTION =
  "Tools useful in my life for the questions I keep asking — transit, food, sports, politics, and the city I love.";
const OG_IMAGE = `${SITE_URL}/og`;
const OG_IMAGE_ALT = "an9.dev — Andrew Nguyen's projects: transit, food, sports, politics, music";

// All head tags (title, description, canonical, OG/Twitter, robots) are rendered as
// JSX in the body so React 19 hoists them into <head>. Under the nonce-based CSP the
// page renders dynamically, and Next's metadata system streams its tags into <body>
// instead — author-rendered tags are the reliable way to keep them in <head> for
// crawlers and link-unfurl scrapers. Only build-time/non-DOM metadata stays here.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  keywords: [
    "Andrew Nguyen", "an9.dev", "Chicago", "CTA", "public transit",
    "urban planning", "data projects", "passion projects", "Next.js", "portfolio",
  ],
  authors: [{ name: "Andrew Nguyen", url: SITE_URL }],
  creator: "Andrew Nguyen",
  publisher: "Andrew Nguyen",
};

// Structured data — identity + site signals for search engines and link unfurls.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Andrew Nguyen",
      url: SITE_URL,
      jobTitle: "Builder",
      description:
        "University of Texas Mechanical Engineering graduate building data-driven passion projects across transit, food, sports, politics, and music.",
      homeLocation: { "@type": "Place", name: "Chicago, Illinois" },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "The University of Texas at Austin",
      },
      knowsAbout: [
        "Public transit", "Urban planning", "Architecture", "Cooking",
        "Politics", "Sports statistics", "Data engineering",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "an9.dev",
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en-US",
    },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    // Mirrors --bg in app/globals.css (.dark / :root). Static metadata, so it
    // can't read CSS vars — keep in sync when the bg tokens change.
    { media: "(prefers-color-scheme: dark)",  color: "#0B0F0D" },
    { media: "(prefers-color-scheme: light)", color: "#F6F5F1" },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Per-request nonce set by middleware.ts for the strict, nonce-based CSP.
  const h = await headers();
  const nonce = h.get("x-nonce") ?? undefined;
  // Homepage-identity SEO tags below are gated to "/" — on sub-routes they'd override
  // each page's own canonical/OG (which Next streams into <body> under dynamic render),
  // mis-canonicalizing every page to the homepage. Sub-routes set their own via metadata.
  const isHome = (h.get("x-pathname") ?? "/") === "/";

  return (
    // No manual <head> — Next owns it and injects metadata there. A user-authored
    // <head> breaks metadata placement under dynamic rendering (the nonce-based CSP
    // forces dynamic), streaming the tags into <body> instead.
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          GeistSans.variable,
          inter.variable,
          jetbrainsMono.variable,
          cormorantGaramond.variable,
          instrumentSerif.variable,
          newsreader.variable,
          ibmPlexSans.variable,
          ibmPlexMono.variable,
          majorMonoDisplay.variable,
        ].join(" ")}
      >
        {/* Head tags rendered as JSX so React 19 hoists them into <head> even under
            the dynamic (nonce-CSP) render — Next's metadata stream lands in <body>.
            Global tags (RSS, robots) apply everywhere; the homepage-identity block is
            gated to "/" so sub-routes aren't mis-canonicalized to the homepage — they
            render their own via <Seo> (see components/Seo.tsx). */}
        <link rel="alternate" type="application/rss+xml" title="an9.dev — Writing" href={`${SITE_URL}/writing/rss.xml`} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        {isHome && (
          <>
            <title>{SITE_TITLE}</title>
            <meta name="description" content={SITE_DESCRIPTION} />
            <link rel="canonical" href={SITE_URL} />
            <meta property="og:title" content={SITE_TITLE} />
            <meta property="og:description" content={OG_DESCRIPTION} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:url" content={SITE_URL} />
            <meta property="og:site_name" content="an9.dev" />
            <meta property="og:image" content={OG_IMAGE} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={OG_IMAGE_ALT} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={SITE_TITLE} />
            <meta name="twitter:description" content={OG_DESCRIPTION} />
            <meta name="twitter:image" content={OG_IMAGE} />
            <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />
          </>
        )}

        {/* Dark-mode flash prevention — beforeInteractive injects this into <head>
            and runs it before hydration. hCaptcha loads inside Contact via next/script. */}
        <Script id="theme-flash" strategy="beforeInteractive" nonce={nonce}>
          {`(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`}
        </Script>
        {/* JSON-LD — valid in body; Google reads it either way. */}
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
