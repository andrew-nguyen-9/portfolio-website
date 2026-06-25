import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "edge";

type Fallback = { honeypot?: string; answer?: number; a?: number; b?: number; elapsedMs?: number };

async function verifyHCaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret) return true; // Skip verification when secret not configured

  const res = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = (await res.json()) as { success: boolean };
  return data.success;
}

// Self-hosted check used when hCaptcha's script is blocked (NoScript, Privacy
// Badger, ad blockers, etc.). Honeypot must be empty, the form must have been
// open long enough to be human, and the arithmetic answer must be correct.
function verifyFallback(fb: Fallback | undefined): boolean {
  if (!fb) return false;
  const { honeypot, answer, a, b, elapsedMs } = fb;
  if (honeypot && honeypot.trim() !== "") return false;
  if (typeof elapsedMs !== "number" || elapsedMs < 2000) return false;
  if (typeof a !== "number" || typeof b !== "number" || typeof answer !== "number") return false;
  if (a < 0 || a > 9 || b < 0 || b > 9) return false;
  return answer === a + b;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      hCaptchaToken?: string;
      fallback?: Fallback;
    };

    const { name, email, subject, message, hCaptchaToken, fallback } = body;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Human verification — hCaptcha if available, else the self-hosted fallback
    const captchaConfigured = !!process.env.HCAPTCHA_SECRET;
    if (hCaptchaToken) {
      if (!(await verifyHCaptcha(hCaptchaToken))) {
        return NextResponse.json({ error: "Captcha verification failed." }, { status: 400 });
      }
    } else if (fallback) {
      if (!verifyFallback(fallback)) {
        return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
      }
    } else if (captchaConfigured) {
      return NextResponse.json({ error: "Human verification required." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[contact] RESEND_API_KEY is not set — cannot send email");
      return NextResponse.json({ error: "Email isn't configured yet." }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    // `from` MUST be a verified Resend sender. Two setups (see docs/CONTACT-EMAIL.md):
    //   • Production: verify an9.dev in Resend → RESEND_FROM="an9.dev <contact@an9.dev>"
    //     (then `to` can be anything).
    //   • Quick/no-DNS: leave RESEND_FROM unset to use Resend's test sender
    //     (onboarding@resend.dev) — but it ONLY delivers to your Resend account
    //     email, so CONTACT_EMAIL must be that address.
    const from = process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>";
    const to   = process.env.CONTACT_EMAIL ?? "andrewng9999@gmail.com";

    const { error } = await resend.emails.send({
      from,
      to:       [to],
      replyTo:  email,
      subject:  `[Portfolio] ${subject?.trim() || "New message"} — from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        <hr />
        <p style="white-space:pre-wrap">${message}</p>
      `,
    });

    if (error) {
      console.error("[contact] resend error", error);
      return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
