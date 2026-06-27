#!/usr/bin/env node
// Satellite-project scaffolder (v4.7.7). Generates a minimal Next.js + Supabase
// starter for a new *.an9.dev project and prints the content/projects.ts registry
// entry to paste in. "Add a project" = run this, paste the entry, push the repo.
//
//   node scripts/scaffold-project.mjs --slug f1-tracker --name "F1 Tracker" \
//     --category Sports --tagline "Data storyboard for every race" [--dir ..] [--dry-run]
//
//   node scripts/scaffold-project.mjs --self-test   # runnable check, writes nothing
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) out[key] = true;
      else { out[key] = next; i++; }
    }
  }
  return out;
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidSlug(s) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
}

// content/projects.ts entry — the one thing that wires routing/OG/sitemap on apex.
function registryEntry({ slug, name, tagline, category }) {
  return `  {
    id: "${slug}",
    name: "${name}",
    tagline: "${tagline}",
    description: "TODO: one-paragraph description.",
    subdomain: "${slug}.an9.dev",
    repoUrl: "https://github.com/andrew-nguyen-9/${slug}",
    status: "building",
    year: ${new Date().getFullYear()},
    tags: ["Next.js", "Supabase"],
    category: "${category}",
    featured: false,
  },`;
}

// ── Starter file templates ──────────────────────────────────────────────────────
function files({ slug, name, tagline }) {
  return {
    "package.json": JSON.stringify(
      {
        name: slug,
        private: true,
        version: "0.1.0",
        scripts: { dev: "next dev --turbopack", build: "next build", start: "next start", lint: "next lint", "type-check": "tsc --noEmit" },
        dependencies: { "@supabase/supabase-js": "^2.45.0", next: "^15.5.0", react: "^19.0.0", "react-dom": "^19.0.0" },
        devDependencies: { "@types/node": "^20", "@types/react": "^19", "@types/react-dom": "^19", typescript: "^5" },
      },
      null,
      2
    ) + "\n",
    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022", lib: ["dom", "dom.iterable", "esnext"], allowJs: true, skipLibCheck: true,
          strict: true, noEmit: true, esModuleInterop: true, module: "esnext", moduleResolution: "bundler",
          resolveJsonModule: true, isolatedModules: true, jsx: "preserve", incremental: true,
          plugins: [{ name: "next" }], paths: { "@/*": ["./*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      },
      null,
      2
    ) + "\n",
    "next.config.ts": `import type { NextConfig } from "next";\nconst nextConfig: NextConfig = {};\nexport default nextConfig;\n`,
    ".gitignore": "node_modules\n.next\n.env*.local\n.DS_Store\n",
    ".env.example": "NEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_ANON_KEY=\n",
    "lib/supabase.ts": `import { createClient } from "@supabase/supabase-js";\n\n// Browser-safe client (anon key). Server-only keys must never be exposed here.\nexport const supabase = createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",\n  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""\n);\n`,
    "app/layout.tsx": `export const metadata = { title: ${JSON.stringify(name)}, description: ${JSON.stringify(tagline)} };\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}\n`,
    "app/page.tsx": `export default function Home() {\n  return (\n    <main style={{ fontFamily: "system-ui", padding: "10vh 8vw" }}>\n      <p style={{ letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12, opacity: 0.6 }}>an9.dev</p>\n      <h1 style={{ fontSize: "clamp(2rem,6vw,4rem)" }}>${name}</h1>\n      <p style={{ fontSize: "1.2rem", opacity: 0.7, maxWidth: 600 }}>${tagline}</p>\n      <p style={{ marginTop: 32, opacity: 0.5 }}>Coming soon.</p>\n    </main>\n  );\n}\n`,
    "README.md": `# ${name}\n\n${tagline}\n\nPart of the [an9.dev](https://an9.dev) project family. Lives at \`${slug}.an9.dev\`.\n\n## Setup\n\n\`\`\`bash\nnpm install\ncp .env.example .env.local   # fill in Supabase URL + anon key\nnpm run dev\n\`\`\`\n`,
    ".github/workflows/ci.yml": `name: CI\non:\n  pull_request:\n  push:\n    branches: [main]\njobs:\n  verify:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci\n      - run: npm run type-check\n      - run: npm run lint\n      - run: npm run build\n`,
  };
}

function selfTest() {
  const assert = (cond, msg) => { if (!cond) { console.error(`✗ ${msg}`); process.exitCode = 1; } };
  assert(slugify("F1 Tracker") === "f1-tracker", "slugify spaces");
  assert(slugify("  Mid--Terms!! ") === "mid-terms", "slugify punctuation/trim");
  assert(isValidSlug("f1-tracker"), "valid slug accepted");
  assert(!isValidSlug("Bad_Slug"), "invalid slug rejected");
  const f = files({ slug: "x", name: "X", tagline: "t" });
  assert(JSON.parse(f["package.json"]).name === "x", "package.json name");
  assert(registryEntry({ slug: "x", name: "X", tagline: "t", category: "C" }).includes('subdomain: "x.an9.dev"'), "registry subdomain");
  if (!process.exitCode) console.log("✓ scaffold self-test OK");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args["self-test"]) return selfTest();

  const slug = slugify(args.slug || args.name || "");
  const name = args.name || slug;
  const tagline = args.tagline || "A new an9.dev project.";
  const category = args.category || "Data";

  if (!slug || !isValidSlug(slug)) {
    console.error("Need --slug (or --name). Slug must be lowercase letters/numbers/hyphens.");
    process.exit(1);
  }

  const targetRoot = path.resolve(args.dir || "..");
  const dest = path.join(targetRoot, slug);
  const tree = files({ slug, name, tagline });

  if (args["dry-run"]) {
    console.log(`Would create ${dest}/ with:`);
    for (const f of Object.keys(tree)) console.log(`  ${f}`);
    console.log("\nRegistry entry for content/projects.ts:\n");
    console.log(registryEntry({ slug, name, tagline, category }));
    return;
  }

  if (fs.existsSync(dest)) {
    console.error(`Refusing to overwrite existing directory: ${dest}`);
    process.exit(1);
  }

  for (const [rel, content] of Object.entries(tree)) {
    const full = path.join(dest, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }

  console.log(`✓ Scaffolded ${name} at ${dest}\n`);
  console.log("Next:");
  console.log(`  1. Paste this into content/projects.ts (this repo):\n`);
  console.log(registryEntry({ slug, name, tagline, category }));
  console.log(`\n  2. Create the repo + push:`);
  console.log(`     cd ${dest} && git init && gh repo create andrew-nguyen-9/${slug} --private --source=. --push`);
  console.log(`  3. Point ${slug}.an9.dev DNS at the new deploy (or leave it — the apex`);
  console.log(`     detail page covers it via the wildcard until then).`);
}

main();
