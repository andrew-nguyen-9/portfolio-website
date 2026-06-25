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

---

## Email authentication: SPF · DKIM · DMARC · BIMI

All are **Cloudflare DNS records** (DNS-only / grey cloud). Add `dig` after each to
confirm. Order matters: fix SPF, keep Resend's DKIM, then ratchet DMARC, then BIMI.

### SPF — fix the "multiple records" failure

RFC 7208 allows **exactly one** `v=spf1` TXT record per name. The scanner found two on
`an9.dev` → email validation can fail. **Merge them into one** and delete the rest.

```
# Root an9.dev — ONE TXT record, all senders' includes merged:
an9.dev.  TXT  "v=spf1 include:amazonses.com ~all"
```

- `include:amazonses.com` covers Resend (it sends through Amazon SES). If you also send
  via another provider (e.g. Google Workspace), merge its include into the **same**
  record: `v=spf1 include:amazonses.com include:_spf.google.com ~all`. Never two
  `v=spf1` records.
- End with `~all` (softfail) while testing; tighten to `-all` (hardfail) once you've
  confirmed every legitimate sender is listed.
- Resend's own verification also adds an SPF TXT on the **`send` subdomain**
  (`send.an9.dev`) for its return-path — that's separate and fine; leave it. The
  "multiple records" error is about two records on the **same** name.

### DKIM — leave Resend's record in place

Resend's domain verification adds `resend._domainkey.an9.dev` (the DKIM key). This is
what makes DMARC pass via **DKIM alignment** (the signature is for `an9.dev`), so
tightening DMARC below won't block legitimate Resend mail. Don't remove it.

### DMARC — move off `p=none`

One TXT at `_dmarc.an9.dev`. Ratchet the policy in three steps; don't jump straight to
`reject` until reports are clean.

```
# Step 1 — monitor (collect reports ~1–2 weeks). You may already have this.
_dmarc.an9.dev.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@an9.dev; fo=1; pct=100"

# Step 2 — enforce softly (spoofed mail → spam folder)
_dmarc.an9.dev.  TXT  "v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@an9.dev; fo=1"

# Step 3 — full protection (spoofed mail rejected) — clears the scanner warning + unblocks BIMI
_dmarc.an9.dev.  TXT  "v=DMARC1; p=reject; pct=100; rua=mailto:dmarc@an9.dev; fo=1"
```

- Alignment stays **relaxed** (the default — no `adkim=s`/`aspf=s`). Strict SPF
  alignment would fail because Resend's return-path is the `send.an9.dev` subdomain;
  relaxed lets it (and DKIM) align. Leave it relaxed.
- **`rua` reporting address gotcha:** aggregate reports only reach an address whose
  domain authorizes it. A different domain (e.g. `…@gmail.com`) needs a
  `an9.dev._report._dmarc.gmail.com` record you can't set on gmail.com — so use an
  address **on `an9.dev`** (`dmarc@an9.dev`, forwarded to your inbox) or a free DMARC
  monitoring service that hands you a working `rua` address. Reports are optional; the
  policy works without them.

### BIMI — optional, and gated on a paid VMC

BIMI shows your logo in inboxes. It requires, in order:

1. DMARC at **`p=quarantine` or `p=reject`** on the org domain at `pct=100` (Step 3
   above). Until then BIMI can't pass — that's the scanner's "Fail".
2. A square logo in **SVG Tiny Portable/Secure** (SVG P/S) profile, served over HTTPS
   (e.g. `https://an9.dev/bimi.svg` — drop the file in `public/`; the current
   `public/an-logo.png` must be converted to SVG P/S first).
3. For **Gmail and Apple Mail**, a **VMC** (Verified Mark Certificate, `a=` below) —
   ~$1,000/yr from DigiCert/Entrust and it requires a **registered trademark** of the
   logo. Without a VMC the record is valid but the logo only shows in a few clients
   (e.g. Fastmail), not Gmail.

```
default._bimi.an9.dev.  TXT  "v=BIMI1; l=https://an9.dev/bimi.svg; a=https://an9.dev/vmc.pem"
```

Reality check: BIMI is the lowest-ROI item here — pursue it only if the inbox logo
matters enough to buy + trademark. SPF + DKIM + DMARC are the ones that actually affect
deliverability and the "legitimate sender" signal; do those first.
