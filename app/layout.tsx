import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Serif, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  // Variable axes: optical size + stylistic
  axes: ["opsz", "SOFT", "WONK"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-ibm-plex-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Andrew Nguyen — Data Engineer & Builder",
    template: "%s | Andrew Nguyen",
  },
  description:
    "Chicago-based data engineer building products at the intersection of data systems and thoughtful design. Music, sports, politics, civic tech.",
  keywords: [
    "data engineer",
    "software developer",
    "Next.js",
    "Python",
    "Chicago",
    "portfolio",
  ],
  authors: [{ name: "Andrew Nguyen" }],
  creator: "Andrew Nguyen",
  openGraph: {
    title: "Andrew Nguyen — Data Engineer & Builder",
    description: "Data engineer. Product builder. Chicago.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Nguyen",
    description: "Data engineer. Product builder. Chicago.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#222B28" },
    { media: "(prefers-color-scheme: light)", color: "#F8F4EB" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent dark-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={[
          fraunces.variable,
          ibmPlexSerif.variable,
          jetbrainsMono.variable,
          GeistSans.variable,
        ].join(" ")}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
