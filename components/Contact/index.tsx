"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

type State = "idle" | "submitting" | "success" | "error";
const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";

function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state,   setState]   = useState<State>("idle");
  const [errMsg,  setErrMsg]  = useState("");
  const [mounted, setMounted] = useState(false);
  const [isDark,  setIsDark]  = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting") return;

    const form = formRef.current;
    if (!form) return;

    const hToken = (form.querySelector('[name="h-captcha-response"]') as HTMLInputElement | null)?.value;
    if (HCAPTCHA_SITE_KEY && !hToken) {
      setErrMsg("Please complete the captcha.");
      return;
    }

    setState("submitting");
    setErrMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), hCaptchaToken: hToken }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(json.error ?? "Something went wrong.");
      }
      setState("success");
      form.reset();
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
          className="mt-6 text-sm underline opacity-50 hover:opacity-90 transition-opacity"
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

      {mounted && HCAPTCHA_SITE_KEY && (
        <div className="hcaptcha-wrapper">
          <div
            key={isDark ? "dark" : "light"}
            className="h-captcha"
            data-sitekey={HCAPTCHA_SITE_KEY}
            data-theme={isDark ? "dark" : "light"}
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
          className="text-xs tracking-[0.25em] uppercase mb-5 opacity-50"
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
