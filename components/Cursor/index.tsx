"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only render on pointer-fine (mouse) devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const dotEl  = dot;
    const ringEl = ring;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dotEl.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
    };

    function tick() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ringEl.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      rafId = requestAnimationFrame(tick);
    }

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [role='button'], label, input, textarea, select")) {
        dotEl.classList.add("hover");
        ringEl.classList.add("hover");
      }
    };

    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [role='button'], label, input, textarea, select")) {
        dotEl.classList.remove("hover");
        ringEl.classList.remove("hover");
      }
    };

    const onLeave = () => { dotEl.classList.add("hidden"); ringEl.classList.add("hidden"); };
    const onEnter = () => { dotEl.classList.remove("hidden"); ringEl.classList.remove("hidden"); };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
