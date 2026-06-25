# Contact form & Resend email

The contact form (`components/Contact`) POSTs to `app/api/contact/route.ts`, which
sends the message via [Resend](https://resend.com). Human-verification is hCaptcha,
with a self-hosted math-question fallback when hCaptcha is blocked.

The form **only sends if the `from` address is a verified Resend sender.** That's the
one thing that has to be set up — everything else already works.

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production +
Preview), and locally in `.env.local` (see `.env.local.example`):

| Var | Required | What |
|-----|----------|------|
| `RESEND_API_KEY` | yes | API key from the Resend dashboard. |
| `RESEND_FROM` | recommended | Sender, e.g. `an9.dev <contact@an9.dev>`. Must be a verified Resend sender. If unset, falls back to Resend's test sender. |
| `CONTACT_EMAIL` | yes | Where messages are delivered. |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | optional | hCaptcha site key. If unset, the form uses the math fallback. |
| `HCAPTCHA_SECRET` | optional | hCaptcha secret (server-side verify). |

## Two ways to make it send

### A. Quick / no-DNS (good for testing)

1. Create a Resend account, grab `RESEND_API_KEY`.
2. **Leave `RESEND_FROM` unset** → the route uses Resend's test sender
   `onboarding@resend.dev`.
3. Set `CONTACT_EMAIL` to **the email you signed up to Resend with** — the test sender
   *only* delivers to the account owner.
4. Deploy. Submissions arrive in that inbox.

Limitation: only delivers to you, and the `from` reads as `resend.dev`. Fine for
confirming the pipeline; not for production.

### B. Production — verified `an9.dev` domain (recommended)

1. Resend dashboard → **Domains → Add Domain → `an9.dev`**.
2. Resend shows a set of DNS records to add. They're region-specific — **use the exact
   values Resend gives you**, not the shapes below. Typically:
   - **DKIM** — a `TXT` (or `CNAME`) at `resend._domainkey` with the public key.
   - **SPF / return-path** — an `MX` and a `TXT` on a `send` subdomain
     (e.g. `MX send → feedback-smtp.<region>.amazonses.com` priority 10, and
     `TXT send → "v=spf1 include:amazonses.com ~all"`).
   - **(optional) DMARC** — `TXT _dmarc → "v=DMARC1; p=none;"` to start (move to
     `quarantine`/`reject` later).
3. Add those records in **Cloudflare DNS as DNS-only (grey cloud)** — never proxy mail
   records. (MX/TXT aren't proxyable anyway; the DKIM CNAME must be grey-clouded.)
4. Wait for Resend to mark the domain **Verified** (minutes up to ~1h).
5. Set `RESEND_FROM="an9.dev <contact@an9.dev>"` (any address on the domain) and
   `CONTACT_EMAIL` to wherever you want messages — now it can be anything.
6. Redeploy.

## Verifying it works

- Locally without keys, the form drops to the **math fallback** and the API returns
  `"Email isn't configured yet."` (500) on submit — expected.
- With keys set, submit the form; check the `CONTACT_EMAIL` inbox. Server errors are
  logged as `[contact] resend error …` in the Vercel function logs.

See also [`DNS-CAA.md`](DNS-CAA.md) for the CAA / certificate-authority records that
round out the domain's DNS posture.
