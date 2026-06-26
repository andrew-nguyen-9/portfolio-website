# Scaffolding a new project (v4.7.7)

Adding a new `*.an9.dev` project is one flow. `scripts/scaffold-project.mjs` generates
a minimal **Next.js + Supabase** starter and prints the `content/projects.ts` registry
entry — the single thing that wires the project into apex routing, OG, and the sitemap.

## Usage

```bash
npm run scaffold -- \
  --slug f1-tracker \
  --name "F1 Tracker" \
  --category Sports \
  --tagline "Data storyboard for every race, driver, and team" \
  [--dir ..]        # where to create the repo (default: parent of this repo)
  [--dry-run]       # print what it would do, write nothing
```

`--slug` is optional if `--name` is given (it's slugified). Slugs must be lowercase
letters/numbers/hyphens.

## What it generates

A new `<dir>/<slug>/` directory with: `package.json`, `tsconfig.json`, `next.config.ts`,
`app/layout.tsx`, `app/page.tsx` (a "coming soon" placeholder), `lib/supabase.ts`
(browser anon client), `.env.example`, `.gitignore`, `README.md`, and a GitHub Actions
CI workflow.

## The three steps it prints

1. **Paste the registry entry** into `content/projects.ts` in *this* repo. That alone
   gives the project an apex detail page (`/projects/<slug>`), an OG image, a sitemap
   entry, and status-aware subdomain routing — no DNS clicks needed.
2. **Create + push the repo:**
   ```bash
   cd <dir>/<slug> && git init && gh repo create andrew-nguyen-9/<slug> --private --source=. --push
   ```
3. **DNS (optional, when it goes live):** point `<slug>.an9.dev` at the new deploy.
   Until then the apex detail page covers it via the `*.an9.dev` wildcard redirect.

## Checks

`node scripts/scaffold-project.mjs --self-test` validates slugify + entry generation
(run in CI). The generated repo's own CI runs type-check / lint / build.
