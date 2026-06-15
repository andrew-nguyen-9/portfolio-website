import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "edge";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      hCaptchaToken?: string;
    };

    const { name, email, subject, message, hCaptchaToken } = body;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // hCaptcha verification
    if (hCaptchaToken) {
      const valid = await verifyHCaptcha(hCaptchaToken);
      if (!valid) {
        return NextResponse.json({ error: "Captcha verification failed." }, { status: 400 });
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.CONTACT_EMAIL ?? "hh5zvph54s@privaterelay.appleid.com";

    await resend.emails.send({
      from:     "Portfolio Contact <onboarding@resend.dev>",
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
