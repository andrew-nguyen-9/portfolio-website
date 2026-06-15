"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import FocusTrap from "focus-trap-react";
import { ANLogo } from "@/components/Logo";
import Tooltip from "@/components/Tooltip";

function ChicagoClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Chicago",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;
  return (
    <span
      className="font-mono text-xs tracking-widest opacity-40"
      aria-label={`Chicago time: ${time}`}
      style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
    >
      CHI {time}
    </span>
  );
}

// AN monogram — interlocking geometric design

const NAV_LINKS = [
  { href: "#about",    label: "About"    },
  { href: "#projects", label: "Projects" },
  { href: "#contact",  label: "Contact"  },
];

export default function Nav() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden,   setHidden]   = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastScrollY.current && y > 80);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    html.classList.add("theme-transitioning");
    const next = !darkMode;
    setDarkMode(next);
    html.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
    setTimeout(() => html.classList.remove("theme-transitioning"), 400);
  }, [darkMode]);

  const handleNavClick = useCallback((href: string) => {
    setOpen(false);
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  return (
    <>
      <nav
        id="nav"
        className={[scrolled ? "scrolled" : "", hidden ? "hidden" : ""].join(" ")}
        aria-label="Main navigation"
      >
        <a href="/" aria-label="Andrew Nguyen — home" style={{ lineHeight: 0 }}>
          <ANLogo size={96} />
        </a>

        <div className="flex items-center gap-5">
          <ChicagoClock />

          {/* Theme toggle */}
          <Tooltip content={darkMode ? "Light mode" : "Dark mode"}>
            <button
              onClick={toggleTheme}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--surface)]"
            >
              {darkMode ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </Tooltip>

          {/* Menu pill */}
          <Tooltip content="Navigation">
            <button
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu-overlay"
              aria-label="Open menu"
              className="flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-medium tracking-wide border border-[var(--border-strong)] hover:border-[var(--primary)] transition-colors"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              <span aria-hidden="true" className="flex flex-col gap-[4.5px] w-[13px]">
                <span className="block h-[1.5px] bg-current rounded" />
                <span className="block h-[1.5px] bg-current rounded w-[9px]" />
              </span>
              Menu
            </button>
          </Tooltip>
        </div>
      </nav>

      {/* Full-screen overlay */}
      <FocusTrap active={open} focusTrapOptions={{ allowOutsideClick: true }}>
        <div
          id="menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={open ? "open" : ""}
        >
          <div className="flex justify-between items-center mb-14">
            <ANLogo size={96} />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-strong)] hover:border-[var(--primary)] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="var(--fg)" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1.5 1.5l12 12M13.5 1.5l-12 12"/>
              </svg>
            </button>
          </div>

          <nav aria-label="Overlay navigation">
            <ul className="list-none p-0 m-0 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }, i) => (
                <li key={href}>
                  <button
                    onClick={() => handleNavClick(href)}
                    className="font-display text-left w-full hover:text-[var(--secondary)] transition-colors"
                    style={{
                      fontFamily: "var(--font-display), sans-serif",
                      fontSize: "clamp(3rem,9vw,7rem)",
                      fontWeight: 800,
                      lineHeight: 1.0,
                      letterSpacing: "-0.03em",
                      transitionDelay: `${i * 40}ms`,
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex items-end justify-between pt-12 opacity-40">
            <ChicagoClock />
            <span className="text-xs font-mono tracking-wider" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
              an9.dev
            </span>
          </div>
        </div>
      </FocusTrap>
    </>
  );
}
