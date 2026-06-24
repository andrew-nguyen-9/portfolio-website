# CLAUDE.md — Project guide for Claude Code

> Read this first in every new session. It tells you where things live, how this
> project is versioned, and the rules you must follow. For deep detail, follow the
> links into `docs/`.

## What this is

`an9.dev` — Andrew Nguyen's personal portfolio. It is **both a portfolio and a
home base for his projects**: a place to organize, save, and link out to a family
of data-driven passion projects (each living at its own `*.an9.dev` subdomain).

Tone to preserve: passion projects, not a job hunt. Do **not** write copy that
reads like a resume or "available for hire" pitch. See
[`docs/DESIGN-GUIDELINES.md`](docs/DESIGN-GUIDELINES.md) for voice.

## Stack

- **Next.js 15** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS 3** + CSS custom properties for theming (`app/globals.css`)
- **Framer Motion**, **GSAP**, **Lenis** (smooth scroll) for motion
- **Resend** (contact email) + **hCaptcha** (spam protection) in `app/api/contact`
- Deployed on **Vercel**

## Map of the codebase

| Path | What it is |
|------|------------|
| `app/layout.tsx` | Root layout, fonts, **SEO metadata + JSON-LD**, theme-flash guard |
| `app/page.tsx` | Page composition (section order) |
| `app/globals.css` | **Design tokens** (light / dark / high-contrast) + base styles |
| `app/robots.ts` · `app/sitemap.ts` | `robots.txt` + `sitemap.xml` routes |
| `app/opengraph-image.tsx` · `app/twitter-image.tsx` | Programmatic OG / Twitter social card |
| `app/api/contact/route.ts` | Contact form handler (Resend + hCaptcha) |
| `app/icon.tsx` | Favicon generation |
| `components/*` | One folder per UI section (Hero, About, Projects, Loader, …) |
| `content/projects.ts` | **Source of truth for the project list** |
| `lib/theme.ts` | Theme color reference (mirror of CSS tokens) |
| `hooks/useReveal.ts` | Scroll-reveal hook |
| `public/` | Static assets |

## Versioning & workflow — READ BEFORE BRANCHING

This repo uses a phase / segment / task model: **`v[phase].[segment].[task]`**.

- All prior work is frozen as **v1.0.0**.
- Current target: **v2.0.0** (see [`docs/phases/v2.0.0/PLAN.md`](docs/phases/v2.0.0/PLAN.md)).
- Full rules: [`docs/VERSIONING.md`](docs/VERSIONING.md) and [`docs/WORKFLOW.md`](docs/WORKFLOW.md).

**The short version:**
1. A **phase** opens a branch `v{p}` off `main` (e.g. `v2`).
2. A **segment** opens a sub-branch `v{p}.{s}` off the phase branch (e.g. `v2.1`).
3. Inside a segment you complete **tasks** `v{p}.{s}.{t}`, build, test, QA,
   run `/code-review`, commit, then push the segment branch into the phase branch.
4. A phase ends with: QA → `/code-review` → commit → merge to `main` →
   tag `v{p}.0.0` → delete spent branches → review all docs → archive the phase's
   docs → write the next brainstorming file.

Never commit straight to `main`. Never skip the segment QA + review step.

## House rules (inherited from global config)

- **Git attribution:** never add AI/assistant attribution to commits, PRs, or
  branch names. Write them as if authored by Andrew. No `Co-Authored-By: Claude`,
  no "Generated with Claude Code" footers.
- **Be lazy (the good kind):** reuse what's here before adding; prefer the
  smallest diff that fully solves the problem; no speculative abstractions.
- Run `npm run type-check` and `npm run lint` before declaring work done.

## Useful tooling available in this workspace

- **Vercel** plugin/MCP — deploys, logs, env (`vercel env pull`), runtime errors.
- **Context7** — pull current library docs before relying on memory.
- **Playwright / Chrome DevTools MCP** — browser QA, Lighthouse, perf traces.
- **compound-engineering** review agents + `/code-review` — phase/segment QA.
- Ponytail / Caveman / RTK are active session-wide (efficiency + terse prose).
- _Serena is not installed in this environment._

## Docs index

Everything lives under [`docs/`](docs/README.md). Start there for navigation.
