"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useReveal } from "@/hooks/useReveal";

type State = "idle" | "submitting" | "success" | "error";
// "loading" until we know whether hCaptcha loaded; "hcaptcha" when ready;
// "fallback" when blocked/unavailable (NoScript, Privacy Badger, ad blockers…)
type CaptchaMode = "loading" | "hcaptcha" | "fallback";
const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";

declare global {
  interface Window { hcaptcha?: unknown }
}

function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state,   setState]   = useState<State>("idle");
  const [errMsg,  setErrMsg]  = useState("");
  const [mounted, setMounted] = useState(false);
  const [isDark,  setIsDark]  = useState(false);

  // Captcha resilience
  const [captchaMode, setCaptchaMode] = useState<CaptchaMode>(
    HCAPTCHA_SITE_KEY ? "loading" : "fallback"
  );
  const [math, setMath] = useState({ a: 0, b: 0 });
  const [mathAnswer, setMathAnswer] = useState("");
  const startRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    startRef.current = Date.now();
    setMath({ a: Math.floor(Math.random() * 9), b: Math.floor(Math.random() * 9) });

    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // If hCaptcha hasn't initialized shortly after mount, assume it's blocked.
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (HCAPTCHA_SITE_KEY) {
      timer = setTimeout(() => {
        setCaptchaMode((m) => (m === "loading" && !window.hcaptcha ? "fallback" : m));
      }, 2800);
    }
    return () => { obs.disconnect(); if (timer) clearTimeout(timer); };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting") return;

    const form = formRef.current;
    if (!form) return;

    const fd = new FormData(form);
    const base = {
      name:    String(fd.get("name") ?? ""),
      email:   String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    let payload: Record<string, unknown>;
    if (captchaMode === "hcaptcha") {
      const hToken = (form.querySelector('[name="h-captcha-response"]') as HTMLInputElement | null)?.value;
      if (!hToken) {
        setErrMsg("Please complete the captcha.");
        return;
      }
      payload = { ...base, hCaptchaToken: hToken };
    } else {
      if (mathAnswer.trim() === "") {
        setErrMsg("Please answer the verification question.");
        return;
      }
      payload = {
        ...base,
        fallback: {
          honeypot: String(fd.get("company") ?? ""),
          answer:   Number(mathAnswer),
          a: math.a,
          b: math.b,
          elapsedMs: Date.now() - startRef.current,
        },
      };
    }

    setState("submitting");
    setErrMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(json.error ?? "Something went wrong.");
      }
      setState("success");
      form.reset();
      setMathAnswer("");
    } catch (err) {
      setState("error");
      setErrMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm outline-none transition-colors focus:border-[var(--primary)] placeholder:opacity-40";

  const labelClass =
    "text-[0.6rem] tracking-[0.2em] uppercase opacity-60";

  if (state === "success") {
    return (
      <div role="alert" className="rounded-2xl border border-[var(--border)] p-10 text-center" style={{ background: "var(--surface)" }}>
        <p className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display), sans-serif" }}>
          Message sent — thanks!
        </p>
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>I&apos;ll be in touch soon.</p>
        <button
          onClick={() => setState("idle")}
          className="mt-6 text-sm underline eyebrow hover:text-[var(--primary)] transition-colors"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass} style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>Name</label>
          <input id="name" name="name" type="text" required autoComplete="name" placeholder="Your name" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass} style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className={labelClass} style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>Subject</label>
        <input id="subject" name="subject" type="text" placeholder="What's this about?" className={inputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass} style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>Message</label>
        <textarea id="message" name="message" required rows={5} placeholder="Tell me more…" className={`${inputClass} resize-y min-h-[120px]`} />
      </div>

      {/* Honeypot — hidden from humans; bots that fill it are rejected */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Load hCaptcha; if a blocker stops it, onError → self-hosted fallback */}
      {HCAPTCHA_SITE_KEY && (
        <Script
          src="https://js.hcaptcha.com/1/api.js"
          strategy="afterInteractive"
          onLoad={() => setCaptchaMode((m) => (m === "loading" ? "hcaptcha" : m))}
          onError={() => setCaptchaMode("fallback")}
        />
      )}

      {/* hCaptcha widget (auto-rendered by api.js) */}
      {captchaMode === "hcaptcha" && (
        <div className="hcaptcha-wrapper">
          <div
            key={mounted ? (isDark ? "dark" : "light") : "light"}
            className="h-captcha"
            data-sitekey={HCAPTCHA_SITE_KEY}
            data-theme={mounted && isDark ? "dark" : "light"}
          />
        </div>
      )}

      {/* Self-hosted fallback challenge — works with any blocker */}
      {captchaMode === "fallback" && mounted && (
        <div className="flex flex-col gap-2">
          <label htmlFor="math" className={labelClass} style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            Verify you&apos;re human — what is {math.a} + {math.b}?
          </label>
          <input
            id="math"
            name="math"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
            value={mathAnswer}
            onChange={(e) => setMathAnswer(e.target.value)}
            placeholder="Answer"
            className={`${inputClass} max-w-[160px]`}
          />
        </div>
      )}

      {errMsg && (
        <p role="alert" className="text-sm" style={{ color: "var(--secondary)" }}>{errMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="self-start inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "var(--primary)",
          color: "var(--bg)",
          fontFamily: "var(--font-display), sans-serif",
        }}
      >
        {state === "submitting" ? "Sending…" : (
          <>
            Send message
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M1.5 6.5h10M7.5 2.5l4 4-4 4"/>
            </svg>
          </>
        )}
      </button>
    </form>
  );
}

export default function Contact() {
  const revealRef = useReveal();

  return (
    <section id="contact" aria-labelledby="contact-heading" className="section relative">
      <span className="section-num" aria-hidden="true">03</span>
      <div ref={revealRef} className="reveal max-w-2xl">
        <p
          className="text-xs tracking-[0.25em] uppercase mb-5 eyebrow"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          03 / Contact
        </p>

        <h2
          id="contact-heading"
          className="leading-[1.0] tracking-tight mb-6"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Let&apos;s talk
        </h2>

        <p className="text-base leading-relaxed mb-12" style={{ color: "var(--fg-muted)" }}>
          Open to interesting collaborations, data engineering roles, and side-project
          conversations. Drop a note and I&apos;ll get back within a day.
        </p>

        <ContactForm />
      </div>
    </section>
  );
}
