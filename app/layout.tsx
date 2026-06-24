import type { Metadata, Viewport } from "next";
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
const SITE_DESCRIPTION =
  "A portfolio and home base for a family of data-driven passion projects — " +
  "transit, food, sports, politics, and music — each living at its own an9.dev " +
  "subdomain. Built by Andrew Nguyen in Chicago.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "an9.dev — Andrew Nguyen",
    template: "%s | an9.dev",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Andrew Nguyen", "an9.dev", "Chicago", "CTA", "public transit",
    "urban planning", "data projects", "passion projects", "Next.js", "portfolio",
  ],
  authors: [{ name: "Andrew Nguyen", url: SITE_URL }],
  creator: "Andrew Nguyen",
  publisher: "Andrew Nguyen",
  alternates: { canonical: "/" },
  openGraph: {
    title: "an9.dev — Andrew Nguyen",
    description:
      "Small tools for the questions I keep asking — transit, food, sports, politics, and the city I love.",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "an9.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "an9.dev — Andrew Nguyen",
    description:
      "Small tools for the questions I keep asking — transit, food, sports, politics, and the city I love.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Dark-mode flash prevention */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        {/* hCaptcha script is loaded inside the Contact component via next/script
            so we can detect when an ad/script blocker prevents it and fall back. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
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
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
