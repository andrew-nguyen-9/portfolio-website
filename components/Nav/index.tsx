"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import FocusTrap from "focus-trap-react";

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
      className="font-mono text-xs tracking-widest opacity-50"
      aria-label={`Current time in Chicago: ${time}`}
      style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
    >
      CHI {time}
    </span>
  );
}

const NAV_LINKS = [
  { href: "#about",    label: "About"    },
  { href: "#projects", label: "Projects" },
  { href: "#contact",  label: "Contact"  },
];

const THEME_TOGGLE_LABEL = { dark: "Switch to light mode", light: "Switch to dark mode" };

export default function Nav() {
  const [open,      setOpen]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [hidden,    setHidden]    = useState(false);
  const [darkMode,  setDarkMode]  = useState(false);
  const lastScrollY = useRef(0);

  // Init theme state from DOM
  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  // Scroll: hide on down-scroll, show on up-scroll
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

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Escape key closes menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  }, [darkMode]);

  const handleNavClick = useCallback((href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, []);

  return (
    <>
      <nav
        id="nav"
        className={[
          scrolled ? "scrolled" : "",
          hidden    ? "hidden"   : "",
        ].join(" ")}
        aria-label="Main navigation"
      >
        {/* AN Monogram */}
        <a
          href="/"
          aria-label="Andrew Nguyen — home"
          className="flex items-center shrink-0"
          style={{ lineHeight: 0 }}
        >
          <svg
            width="44" height="28"
            viewBox="-22 -14 44 28"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g
              fill="none"
              stroke="var(--fg)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="-21" y1="12" x2="-8"  y2="-12" />
              <line x1="-8"  y1="-12" x2="4"  y2="12"  />
              <line x1="-16.5" y1="1" x2="-1" y2="1"   />
              <line x1="7"  y1="12"  x2="7"  y2="-12" />
              <line x1="7"  y1="-12" x2="22" y2="12"  />
              <line x1="22" y1="-12" x2="22" y2="12"  />
            </g>
            <circle cx="-8" cy="-15.5" r="2" fill="var(--secondary)" />
          </svg>
        </a>

        {/* Right cluster: clock + theme + menu */}
        <div className="flex items-center gap-5">
          <ChicagoClock />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={darkMode ? THEME_TOGGLE_LABEL.dark : THEME_TOGGLE_LABEL.light}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--border)] focus-visible:ring-2"
          >
            {darkMode ? (
              /* Sun icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              /* Moon icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Menu button */}
          <button
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-overlay"
            aria-label="Open menu"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium tracking-wide border border-[var(--border-strong)] hover:border-[var(--primary)] transition-colors"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            <span aria-hidden="true" className="flex flex-col gap-[4px] w-[14px]">
              <span className="block h-[1.5px] bg-current rounded" />
              <span className="block h-[1.5px] bg-current rounded w-[10px]" />
            </span>
            Menu
          </button>
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
          {/* Close */}
          <div className="flex justify-between items-center mb-16">
            <svg width="44" height="28" viewBox="-22 -14 44 28" aria-hidden="true">
              <g fill="none" stroke="var(--fg)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="-21" y1="12" x2="-8"  y2="-12" />
                <line x1="-8"  y1="-12" x2="4"  y2="12"  />
                <line x1="-16.5" y1="1" x2="-1" y2="1"   />
                <line x1="7"  y1="12"  x2="7"  y2="-12" />
                <line x1="7"  y1="-12" x2="22" y2="12"  />
                <line x1="22" y1="-12" x2="22" y2="12"  />
              </g>
              <circle cx="-8" cy="-15.5" r="2" fill="var(--secondary)" />
            </svg>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-strong)] hover:border-[var(--primary)] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--fg)" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav aria-label="Overlay navigation">
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <button
                    onClick={() => handleNavClick(href)}
                    className="font-display text-[clamp(3rem,8vw,6rem)] leading-none tracking-tight text-left hover:text-[var(--secondary)] transition-colors"
                    style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer row */}
          <div className="mt-auto flex items-end justify-between pt-12">
            <ChicagoClock />
            <span className="text-xs opacity-40 font-mono tracking-wider">
              andrewnguyen.dev
            </span>
          </div>
        </div>
      </FocusTrap>
    </>
  );
}
