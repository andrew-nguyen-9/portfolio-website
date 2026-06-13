"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Nav          from "@/components/Nav";
import Hero         from "@/components/Hero";
import About        from "@/components/About";
import Projects     from "@/components/Projects";
import Contact      from "@/components/Contact";
import Footer       from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });
const Cursor = dynamic(() => import("@/components/Cursor"), { ssr: false });

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);

  const handleLoaderComplete = useCallback(() => setLoaderDone(true), []);

  return (
    <>
      <Cursor />
      <ScrollProgress />

      {!loaderDone && <Loader onComplete={handleLoaderComplete} />}

      <div style={{ opacity: loaderDone ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}>
        <Nav />
        <main id="main-content">
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
