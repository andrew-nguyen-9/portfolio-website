"use client";

import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

// Shared chrome for sub-routes (/writing, /uses, /now). The homepage composes
// these itself in app/page.tsx (it also owns the Loader); content pages don't get
// the loader but DO need the cursor + nav + footer. Without the custom Cursor here
// the page would show no cursor at all — globals.css sets `cursor: none` on desktop.
const Cursor    = dynamic(() => import("@/components/Cursor"),    { ssr: false });
const A11yPanel = dynamic(() => import("@/components/A11yPanel"), { ssr: false });

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Cursor />
      <A11yPanel />
      <ScrollProgress />
      <Nav />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
