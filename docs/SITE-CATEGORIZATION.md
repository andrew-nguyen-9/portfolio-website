# Getting an9.dev categorized by web filters

## Why this exists

New domains sit **"uncategorized"** in web-filter databases (Sophos, Cisco, Palo Alto,
Zscaler, Symantec, Forcepoint…). Strict corporate/school policies **block anything
uncategorized**, and some products (e.g. Sophos) do HTTPS interception that, combined
with the site's HSTS, produces a scary "this site isn't safe" screen with no bypass —
even though the site, cert, and DNS are all valid. (See the diagnosis: the cert
presented was re-signed by a *Sophos SSL CA*, i.e. a Sophos firewall/endpoint
intercepting TLS — not a site problem.)

Submitting `an9.dev` for categorization tells those vendors what the site is, so it
stops being treated as unknown/risky. This is a **manual, per-vendor** task — each is a
gated web form (CAPTCHA / vendor login / category dropdown), so it can't be automated.
Budget ~10–15 minutes. Re-check in ~1 week.

## Paste-ready details (use the same for every vendor)

- **URL:** `https://an9.dev` (also submit `https://www.an9.dev` if a form allows)
- **Requested category:** **Personal Sites and Blogs** — or the nearest equivalent the
  vendor offers: *Personal Pages*, *Information Technology*, *Computers & Internet*,
  *Technology*.
- **Description to paste:**
  > an9.dev is the personal portfolio and project hub of Andrew Nguyen, a software
  > developer based in Chicago. It links out to a small family of personal
  > data/analytics side-projects hosted on \*.an9.dev subdomains. No malware, no
  > logins; the only interactive feature is a contact form.
- **Contact email:** `andrewng9999@gmail.com` (or `contact@an9.dev` once mail is live)

## Vendors

Do **Sophos first** — it's the one currently intercepting/blocking.

| Vendor | Where | How |
|--------|-------|-----|
| **Sophos** (priority) | <https://submit.sophos.com> | Choose **"Web Address (URL)"** → Submit URL. No Sophos ID required. Product: pick *Endpoint Protection (Sophos Central)* or *Sophos Firewall*. Updates in ~24h (re-assessment up to 72h). **No confirmation email** — just re-check. |
| **Cisco Talos** | <https://talosintelligence.com/reputation_center/> | Search `an9.dev` → open the result → **"Suggest a category" / submit a dispute**. |
| **Palo Alto** | <https://urlfiltering.paloaltonetworks.com/> | "Test A Site" → search `an9.dev` → **Request Change**. ⚠️ As of Mar 2026 a (free) login is required for *change requests* (lookups are open). An auto-crawler validates; else human review. |
| **Zscaler** | <https://sitereview.zscaler.com/> | Look up `an9.dev` → **Submit for review** with the suggested category. (JS required.) |
| **Symantec / Broadcom (WebPulse)** | <https://sitereview.bluecoat.com/> | "Check Category" for `an9.dev` → **dispute / suggest** the category. |
| **Forcepoint** | <https://csi.forcepoint.com/> | Look up `an9.dev` → **suggest a different category**. |

## Google (different lever)

Google **Safe Browsing** isn't a category system — there's nothing to "categorize," and
you only act if the site gets flagged as dangerous. The real Google move is to verify
the domain in **Google Search Console** (<https://search.google.com/search-console>):
it confirms ownership, surfaces any Safe Browsing/security flags with a "Request Review"
button if they ever appear, and helps indexing. Worth doing once.

## After submitting

- Re-check categorization in ~1 week (re-run the lookups above; most update within
  24–72h).
- Confirm the site itself is healthy (it is — issue was network-side interception):
  ```
  dig +short A an9.dev          # → Vercel IPs (64.29.17.x / 216.198.79.x)
  dig +short CAA an9.dev        # → the Option C records once added (see DNS-CAA.md)
  ```
- The **Sophos cert error on your own machine/network** is separate from categorization —
  see the troubleshooting section below. Don't disable the site's HSTS — it's correct.

---

## Troubleshooting: "issuer not recognized" / "this site isn't safe" (TLS interception)

If a browser refuses to open `an9.dev` with a cert/HSTS error, **first check whether the
site is actually broken or whether something is intercepting your TLS.** Inspect the
certificate the browser shows:

- **Issued by a real CA** (Let's Encrypt / Google Trust Services) → a genuine site/cert
  issue; investigate Vercel + DNS.
- **Issued by something like `O=Sophos, OU=NSG, CN=Sophos SSL CA…`** (or Zscaler,
  Netskope, Palo Alto, a corporate name) → **TLS interception (MITM)**. A
  firewall/endpoint is decrypting and re-signing traffic with its own CA, which your
  browser doesn't trust. **The site is fine** — you're seeing the interceptor's cert,
  not Vercel's. HSTS then (correctly) blocks the "add exception" bypass.

### Is the interceptor on your machine, or on the network?

```
# macOS — is a Sophos product installed locally?
ls -d /Applications/Sophos* /Library/Sophos* 2>/dev/null
ps -axo comm | grep -i sophos
security find-certificate -a -c "Sophos" /Library/Keychains/System.keychain
```

- **Something found** → it's a **local** endpoint (Sophos Home / Intercept X). Configure
  or disable its web/TLS protection, or exclude `an9.dev`.
- **Nothing found** (the actual case here) → the interceptor is **upstream on the
  network** — a Sophos firewall (XGS/UTM/SG) at the router/gateway decrypting all TLS,
  whose CA was never installed on your device. Every HSTS site behind it errors the same
  way.

### Confirm + workaround (20 seconds)

Open `an9.dev` on your **phone over mobile data** (WiFi off). Loads clean → it's the
network, not the site. To use it now from the affected device: **phone hotspot** or a
**VPN** that tunnels past the local firewall.

### Real fix

- **You control the firewall** (home Sophos): admin UI → **Rules & Policies → SSL/TLS
  inspection** → add `an9.dev` + `*.an9.dev` to a **"Don't decrypt" / exclusion** list.
  (Or install the firewall's CA on your devices — but exclusion beats trusting a MITM CA.)
- **You don't control it** (work / school / landlord / public WiFi): only the network
  admin can exclude `an9.dev` or push the CA. Use mobile data / VPN meanwhile.
- **Never** remove the site's HSTS to "make it work" — that just trades a loud, correct
  failure for a silently intercepted connection.

---

Related: [`DNS-CAA.md`](DNS-CAA.md) (CAA records) · [`CONTACT-EMAIL.md`](CONTACT-EMAIL.md)
(SPF/DKIM/DMARC, which also strengthen the "legitimate domain" signal).
