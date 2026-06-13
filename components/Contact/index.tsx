"use client";

import { useRef, useState } from "react";

type State = "idle" | "submitting" | "success" | "error";

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state,   setState]   = useState<State>("idle");
  const [errMsg,  setErrMsg]  = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting") return;

    const form = formRef.current;
    if (!form) return;

    // hCaptcha response token
    const hToken = (form.querySelector('[name="h-captcha-response"]') as HTMLInputElement | null)?.value;
    if (HCAPTCHA_SITE_KEY && !hToken) {
      setErrMsg("Please complete the captcha.");
      return;
    }

    const data = Object.fromEntries(new FormData(form));

    setState("submitting");
    setErrMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, hCaptchaToken: hToken }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Something went wrong.");
      }

      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setErrMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="section">
      <div className="max-w-2xl">
        <p
          className="font-mono text-xs tracking-[0.25em] uppercase mb-5 opacity-50"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          03 / Contact
        </p>

        <h2
          id="contact-heading"
          className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight mb-6"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontVariationSettings: "'opsz' 72, 'SOFT' 40",
          }}
        >
          Let&apos;s talk
        </h2>

        <p
          className="text-base leading-relaxed mb-12"
          style={{
            color: "var(--fg-muted)",
            fontFamily: "var(--font-ibm-plex-serif), Georgia, serif",
          }}
        >
          I&apos;m open to interesting collaborations, data engineering roles, and side-project
          conversations. Drop me a note and I&apos;ll get back to you within a day.
        </p>

        {state === "success" ? (
          <div
            role="alert"
            className="rounded-2xl border border-[var(--border)] p-8 text-center"
            style={{ background: "var(--surface)" }}
          >
            <p
              className="font-heading text-xl"
              style={{ fontFamily: "var(--font-ibm-plex-serif), Georgia, serif" }}
            >
              Message sent — thanks!
            </p>
            <p className="text-sm mt-2" style={{ color: "var(--fg-muted)" }}>
              I&apos;ll be in touch soon.
            </p>
            <button
              onClick={() => setState("idle")}
              className="mt-6 text-sm underline opacity-50 hover:opacity-90 transition-opacity"
            >
              Send another
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-xs font-mono tracking-wider opacity-60 uppercase"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm outline-none transition-colors focus:border-[var(--primary)]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-xs font-mono tracking-wider opacity-60 uppercase"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm outline-none transition-colors focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="subject"
                className="text-xs font-mono tracking-wider opacity-60 uppercase"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="What's this about?"
                className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm outline-none transition-colors focus:border-[var(--primary)]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-xs font-mono tracking-wider opacity-60 uppercase"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me more..."
                className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm outline-none transition-colors focus:border-[var(--primary)] resize-y min-h-[120px]"
              />
            </div>

            {/* hCaptcha widget — injected client-side if site key set */}
            {HCAPTCHA_SITE_KEY && (
              <div
                className="h-captcha"
                data-sitekey={HCAPTCHA_SITE_KEY}
                data-theme="dark"
              />
            )}

            {errMsg && (
              <p role="alert" className="text-sm" style={{ color: "var(--secondary)" }}>
                {errMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={state === "submitting"}
              className="self-start inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "var(--primary)",
                color: "var(--bg)",
                fontFamily: "var(--font-geist-sans), sans-serif",
              }}
            >
              {state === "submitting" ? "Sending…" : "Send message"}
              {state !== "submitting" && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" />
                </svg>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
