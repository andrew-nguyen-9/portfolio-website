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
auto-issued by **Let's Encrypt**.

> ✅ **Chosen: Option C** (permissive). It authorizes every CA that Vercel or
> Cloudflare could plausibly use, so nothing breaks if the hosting/proxy path changes,
> while the `iodef` contact still signals a properly run domain. Options A and B are
> kept below as tighter alternatives.

In Cloudflare: **DNS → Records → Add record → Type `CAA`**, `Name: @`, then set the
tag ("Only allow specific hostnames" = `issue`, "…wildcards" = `issuewild`, "Send
violation reports to" = `iodef`) and the CA domain / mailto value. Add one Cloudflare
record per line below.

---

## Option C — permissive · ✅ CHOSEN

Broadest safe set — authorizes every CA Vercel or Cloudflare could use, plus the
reporting contact, so nothing breaks regardless of the hosting/proxy path. **Add
these seven records in Cloudflare:**

```
an9.dev.  CAA  0 issue     "letsencrypt.org"
an9.dev.  CAA  0 issue     "pki.goog"
an9.dev.  CAA  0 issue     "ssl.com"
an9.dev.  CAA  0 issue     "digicert.com"
an9.dev.  CAA  0 issuewild "letsencrypt.org"
an9.dev.  CAA  0 issuewild "pki.goog"
an9.dev.  CAA  0 iodef     "mailto:andrewng9999@gmail.com"
```

In Cloudflare's CAA editor each row is: **Name** `@`, **Tag** = the middle word
(`issue` → "Only allow specific hostnames", `issuewild` → "…wildcards", `iodef` →
"Send violation reports to"), **Value/CA domain** = the quoted string (for `iodef`,
the `mailto:` URL). Flags stay `0`.

---

## Option A — Vercel direct, DNS-only (tighter alternative)

If you'd rather authorize only the CA actually in use (Vercel/Let's Encrypt), with
records **not proxied** (grey cloud):

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

---

## Notes

- `flags = 0` is correct (non-critical) for all of these.
- The `iodef` mailto is where CAs report attempted policy violations — swap in
  whatever address you prefer to receive those at.
- CAA applies to the whole domain and its subdomains (`*.an9.dev` project subdomains
  inherit it) unless a subdomain sets its own CAA. The project subdomains are also on
  Vercel/Let's Encrypt, so Option C covers them.
- Verify after adding: `dig CAA an9.dev +short`, or use the SSLMate CAA test.
- Related: email-sending DNS (SPF/DKIM/DMARC) lives in [`CONTACT-EMAIL.md`](CONTACT-EMAIL.md).
- **HSTS preload** is intentionally **not** submitted yet (deferred until the site is
  finalized); the `Strict-Transport-Security` header is already sent.
