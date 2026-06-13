"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Nav      from "@/components/Nav";
import Hero     from "@/components/Hero";
import About    from "@/components/About";
import Projects from "@/components/Projects";
import Contact  from "@/components/Contact";

// Load loader only on client — references sessionStorage and RAF
const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  return (
    <>
      {!loaderDone && <Loader onComplete={handleLoaderComplete} />}

      <div
        style={{
          opacity: loaderDone ? 1 : 0,
          transition: "opacity 0.5s ease 0.1s",
        }}
      >
        <Nav />

        <main id="main-content">
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>

        <footer
          className="section pt-0"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 py-8 text-xs opacity-40">
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
              © {new Date().getFullYear()} Andrew Nguyen
            </span>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
              Chicago, IL
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
