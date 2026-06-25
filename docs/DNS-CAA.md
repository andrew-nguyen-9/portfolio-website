# CAA records for an9.dev (Cloudflare)

A **CAA** (Certification Authority Authorization) record lists which certificate
authorities are allowed to issue TLS certs for `an9.dev`. It's a legitimacy +
anti-mis-issuance signal: a domain with a clean CAA (and an `iodef` reporting
contact) reads as a properly run site, not an abandoned/parked one — which helps
with the "blocked by corporate filters" perception.

> ⚠️ **Rule:** a CAA set that omits the CA your host actually uses will **block
> certificate renewal** and take the site down at renewal time. Pick the option that
> matches how `an9.dev` is served, and add the matching CA(s).

How `an9.dev` is served today: **Vercel** (apex `an9.dev` + `www.an9.dev`), certs
auto-issued by **Let's Encrypt**. Pick the option below for your DNS setup.

In Cloudflare: **DNS → Records → Add record → Type `CAA`**, `Name: @`, then set the
tag ("Only allow specific hostnames" = `issue`, "…wildcards" = `issuewild`, "Send
violation reports to" = `iodef`) and the CA domain / mailto value.

---

## Option A — Vercel direct, DNS-only (recommended for the current setup)

Records are served by Cloudflare but **not proxied** (grey cloud), so Vercel issues
the cert via Let's Encrypt:

```
an9.dev.  CAA  0 issue     "letsencrypt.org"
an9.dev.  CAA  0 issuewild "letsencrypt.org"
an9.dev.  CAA  0 iodef     "mailto:andrewng9999@gmail.com"
```

## Option B — Cloudflare-proxied (orange cloud)

If the records are proxied through Cloudflare, the **edge cert** is issued by
Cloudflare's CAs (Google Trust Services / SSL.com), and the origin cert by Let's
Encrypt — authorize all of them:

```
an9.dev.  CAA  0 issue     "letsencrypt.org"
an9.dev.  CAA  0 issue     "pki.goog"        ; Google Trust Services (Cloudflare)
an9.dev.  CAA  0 issue     "ssl.com"         ; Cloudflare fallback CA
an9.dev.  CAA  0 issuewild "letsencrypt.org"
an9.dev.  CAA  0 issuewild "pki.goog"
an9.dev.  CAA  0 iodef     "mailto:andrewng9999@gmail.com"
```

## Option C — permissive (when unsure which path is live)

Broadest safe set — authorizes the common CAs so nothing breaks while you settle the
hosting path, plus the reporting contact. Tighten to A or B once confirmed:

```
an9.dev.  CAA  0 issue     "letsencrypt.org"
an9.dev.  CAA  0 issue     "pki.goog"
an9.dev.  CAA  0 issue     "ssl.com"
an9.dev.  CAA  0 issue     "digicert.com"
an9.dev.  CAA  0 issuewild "letsencrypt.org"
an9.dev.  CAA  0 issuewild "pki.goog"
an9.dev.  CAA  0 iodef     "mailto:andrewng9999@gmail.com"
```

---

## Notes

- `flags = 0` is correct (non-critical) for all of these.
- The `iodef` mailto is where CAs report attempted policy violations — swap in
  whatever address you prefer to receive those at.
- CAA applies to the whole domain and its subdomains (`*.an9.dev` project subdomains
  inherit it) unless a subdomain sets its own CAA. The project subdomains are also on
  Vercel/Let's Encrypt, so Option A covers them.
- Verify after adding: `dig CAA an9.dev +short`, or use the SSLMate CAA test.
- Related: email-sending DNS (SPF/DKIM/DMARC) lives in [`CONTACT-EMAIL.md`](CONTACT-EMAIL.md).
- **HSTS preload** is intentionally **not** submitted yet (deferred until the site is
  finalized); the `Strict-Transport-Security` header is already sent.
