# an9.dev — Andrew Nguyen's portfolio

Personal site and home base for my projects, at **[an9.dev](https://an9.dev)**.

It's two things at once: a portfolio, and a place to organize and save the data-
driven things I build. Each project lives at its own `*.an9.dev` subdomain — music,
sports, civic tech, food, and games — and this site ties them together.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router, Turbopack) · React 19 · TypeScript
- Tailwind CSS + CSS custom properties for theming
- Framer Motion · GSAP · Lenis (smooth scroll) for motion
- Resend + hCaptcha for the contact form
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
app/            # routes, layout, global styles, API routes
  globals.css   # design tokens (light / dark / high-contrast) + base styles
  layout.tsx    # fonts, metadata, theme guard
  api/contact/  # contact form handler (Resend + hCaptcha)
components/      # one folder per UI section (Hero, About, Projects, Loader, …)
content/         # projects.ts — the source of truth for the project list
hooks/           # reusable hooks (scroll reveal, …)
lib/             # theme reference + helpers
public/          # static assets
docs/            # planning, workflow, versioning, design guidelines
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
