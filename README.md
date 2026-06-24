# an9.dev — Andrew Nguyen's portfolio

Personal site and home base for my projects, at **[an9.dev](https://an9.dev)**.

It's two things at once: a portfolio, and a place to organize and save the data-
driven things I build for fun. Each project lives at its own `*.an9.dev` subdomain —
transit (CTA), food, sports, politics, and music — and this site ties them together.
It's a passion-project home base, not a job hunt.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router, Turbopack) · React 19 · TypeScript
- Tailwind CSS + CSS custom properties for theming (light / bold-dark / high-contrast)
- Framer Motion · GSAP · Lenis (smooth scroll) for motion
- Resend + hCaptcha for the contact form
- SEO + discoverability: `robots.ts`, `sitemap.ts`, a programmatic OpenGraph image,
  JSON-LD structured data, and a hardened Content-Security-Policy
- Deployed on Vercel

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm run start        # serve the production build
npm run lint         # eslint
npm run type-check   # tsc --noEmit
```

Environment variables: copy `.env.local.example` to `.env.local` and fill in the
Resend / hCaptcha keys used by the contact form.

## Project structure

```
app/                  # routes, layout, global styles, API + metadata routes
  globals.css         # design tokens (light / dark / high-contrast) + base styles
  layout.tsx          # fonts, metadata, JSON-LD, theme guard
  page.tsx            # section composition (Hero → About → Projects → Contact)
  robots.ts           # robots.txt route
  sitemap.ts          # sitemap.xml route
  opengraph-image.tsx # programmatic 1200×630 social card (+ twitter-image.tsx)
  icon.tsx            # favicon generation
  api/contact/        # contact form handler (Resend + hCaptcha)
components/           # one folder per UI section (Hero, About, Projects, Loader, …)
content/              # projects.ts — the source of truth for the project list
hooks/                # reusable hooks (scroll reveal, …)
lib/                  # theme.ts — token reference mirror of globals.css
public/               # static assets
docs/                 # planning, workflow, versioning, design guidelines
```

## How this repo is run

Work moves in **phases → segments → tasks** (`v[phase].[segment].[task]`), each
phase on its own branch, gated by tests + review at every merge. The current
target is **v2.0.0**.

- Contributing / workflow → [`docs/WORKFLOW.md`](docs/WORKFLOW.md)
- Versioning scheme → [`docs/VERSIONING.md`](docs/VERSIONING.md)
- Design system + voice → [`docs/DESIGN-GUIDELINES.md`](docs/DESIGN-GUIDELINES.md)
- Full docs index → [`docs/README.md`](docs/README.md)
- Building with Claude Code? Start at [`CLAUDE.md`](CLAUDE.md).

## License

See [`LICENSE`](LICENSE).
