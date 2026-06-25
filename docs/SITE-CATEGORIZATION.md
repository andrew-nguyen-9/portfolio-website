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
  fix that by excluding `an9.dev` from Sophos TLS inspection, or making the browser trust
  the Sophos CA (e.g. Zen/Firefox `about:config` → `security.enterprise_roots.enabled =
  true`). Don't disable the site's HSTS — it's correct.

Related: [`DNS-CAA.md`](DNS-CAA.md) (CAA records) · [`CONTACT-EMAIL.md`](CONTACT-EMAIL.md)
(SPF/DKIM/DMARC, which also strengthen the "legitimate domain" signal).
