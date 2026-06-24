"use client";

import { projects, type Project } from "@/content/projects";
import { useReveal } from "@/hooks/useReveal";

const STATUS_LABELS: Record<Project["status"], string> = {
  live:     "Live",
  building: "Building",
  planned:  "Planned",
};

/* Each category maps onto a brand accent token (no raw hex — token contract). */
const CAT_ACCENT: Record<string, string> = {
  Music:  "var(--secondary)",
  Sports: "var(--primary)",
  Civic:  "var(--highlight)",
  Games:  "var(--primary)",
  Food:   "var(--secondary)",
};

/* Deliberate reading order for the index, not data order. */
const CATEGORY_ORDER = ["Music", "Sports", "Civic", "Games", "Food"];

function groupByCategory(list: Project[]): [string, Project[]][] {
  const map = new Map<string, Project[]>();
  for (const p of list) {
    (map.get(p.category) ?? map.set(p.category, []).get(p.category)!).push(p);
  }
  const ordered = CATEGORY_ORDER.filter((c) => map.has(c));
  // Any category not in the explicit order falls in afterwards, alphabetically.
  const extra = [...map.keys()].filter((c) => !CATEGORY_ORDER.includes(c)).sort();
  return [...ordered, ...extra].map((c) => [c, map.get(c)!]);
}

function statusColor(s: Project["status"]) {
  return s === "live" ? "var(--primary)" : s === "building" ? "var(--highlight)" : "var(--fg-subtle)";
}

/* ── A single index row ────────────────────────────────── */
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const idx = String(index).padStart(2, "0");
  return (
    <div className="project-row">
      <span className="project-row-idx" aria-hidden="true">{idx}</span>

      <span className="project-row-main">
        <span className="project-row-name">{project.name}</span>
        <span className="project-row-tagline">{project.tagline}</span>
      </span>

      <span className="project-row-meta">
        <span className="project-row-status" style={{ color: statusColor(project.status) }}>
          {STATUS_LABELS[project.status]}
        </span>
        <span className="project-row-year">{project.year}</span>
      </span>
    </div>
  );
}

/* ── Category group ────────────────────────────────────── */
function CategoryGroup({
  category,
  items,
  startIndex,
}: {
  category: string;
  items: Project[];
  startIndex: number;
}) {
  return (
    <section className="project-group" aria-label={category}>
      <header className="project-group-head" style={{ color: CAT_ACCENT[category] }}>
        <span className="project-group-name">{category}</span>
        <span className="project-group-count" aria-hidden="true">
          {String(items.length).padStart(2, "0")}
        </span>
      </header>

      {items.map((p, i) => (
        <ProjectRow key={p.id} project={p} index={startIndex + i} />
      ))}
    </section>
  );
}

function ProjectsContent() {
  const revealRef = useReveal();
  const groups = groupByCategory(projects);

  // Running 1-based index across all groups, in display order.
  let running = 0;
  const numbered = groups.map(([cat, items]) => {
    const start = running + 1;
    running += items.length;
    return { cat, items, start };
  });

  return (
    <div ref={revealRef} className="reveal">
      {/* Header */}
      <div className="mb-14">
        <p
          className="text-xs tracking-[0.25em] uppercase mb-4 opacity-50"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          02 / Projects
        </p>
        <h2
          id="projects-heading"
          className="leading-[1.0] tracking-tight"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Things I&apos;m building
        </h2>
      </div>

      {/* Editorial index */}
      <div className="project-index">
        {numbered.map(({ cat, items, start }) => (
          <CategoryGroup key={cat} category={cat} items={items} startIndex={start} />
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="section relative">
      <span className="section-num" aria-hidden="true">02</span>
      <ProjectsContent />
    </section>
  );
}
