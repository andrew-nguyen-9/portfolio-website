import type { Metadata, Viewport } from "next";
import {
  Inter,
  JetBrains_Mono,
  Cormorant_Garamond,
  Instrument_Serif,
  Newsreader,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
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

export const metadata: Metadata = {
  title: {
    default: "Andrew Nguyen — Data Engineer & Builder",
    template: "%s | Andrew Nguyen",
  },
  description:
    "Chicago-based data engineer building products at the intersection of data systems and thoughtful design. Music, sports, politics, civic tech.",
  keywords: ["data engineer", "software developer", "Next.js", "Python", "Chicago", "portfolio"],
  authors: [{ name: "Andrew Nguyen" }],
  creator: "Andrew Nguyen",
  openGraph: {
    title: "Andrew Nguyen — Data Engineer & Builder",
    description: "Data engineer. Product builder. Chicago.",
    type: "website",
    locale: "en_US",
    url: "https://an9.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Nguyen",
    description: "Data engineer. Product builder. Chicago.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#222B28" },
    { media: "(prefers-color-scheme: light)", color: "#F8F4EB" },
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
        {process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY && (
          <script src="https://js.hcaptcha.com/1/api.js" async defer />
        )}
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
        ].join(" ")}
      >
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
