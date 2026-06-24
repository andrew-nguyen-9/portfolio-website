"use client";

import { useEffect, useState } from "react";
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

const PLATE_W = 260;
const PLATE_H = 180;

function groupByCategory(list: Project[]): [string, Project[]][] {
  const map = new Map<string, Project[]>();
  for (const p of list) {
    (map.get(p.category) ?? map.set(p.category, []).get(p.category)!).push(p);
  }
  const ordered = CATEGORY_ORDER.filter((c) => map.has(c));
  const extra = [...map.keys()].filter((c) => !CATEGORY_ORDER.includes(c)).sort();
  return [...ordered, ...extra].map((c) => [c, map.get(c)!]);
}

function statusColor(s: Project["status"]) {
  return s === "live" ? "var(--primary)" : s === "building" ? "var(--highlight)" : "var(--fg-subtle)";
}

/* Abstract category visual — tokenized accent wash + oversized serif initial.
   Stands in for a real screenshot; per-project art can replace it later. */
function CategoryPlate({ category, className }: { category: string; className?: string }) {
  const accent = CAT_ACCENT[category] ?? "var(--primary)";
  return (
    <div className={`project-plate-art${className ? ` ${className}` : ""}`}>
      <span
        aria-hidden="true"
        className="project-plate-wash"
        style={{ background: `radial-gradient(120% 100% at 15% 0%, ${accent} 0%, transparent 55%)` }}
      />
      <span aria-hidden="true" className="project-plate-glyph" style={{ color: accent }}>
        {category.charAt(0)}
      </span>
      <span className="project-plate-label">{category}</span>
    </div>
  );
}

/* ── A single index row ────────────────────────────────── */
function ProjectRow({
  project,
  index,
  isTouch,
  selected,
  onSelect,
  onPreview,
  onClearPreview,
}: {
  project: Project;
  index: number;
  isTouch: boolean;
  selected: boolean;
  onSelect: () => void;
  onPreview: (p: Project, rect?: DOMRect) => void;
  onClearPreview: (p: Project) => void;
}) {
  const idx = String(index).padStart(2, "0");
  const detailId = `project-detail-${project.id}`;

  return (
    <div className={`project-row-wrap${selected ? " is-selected" : ""}`}>
      <button
        type="button"
        className="project-row"
        aria-expanded={selected}
        aria-controls={detailId}
        onClick={onSelect}
        onMouseEnter={() => !isTouch && onPreview(project)}
        onMouseLeave={() => !isTouch && onClearPreview(project)}
        onFocus={(e) => !isTouch && onPreview(project, e.currentTarget.getBoundingClientRect())}
        onBlur={() => !isTouch && onClearPreview(project)}
      >
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
      </button>

      {/* Inline preview — primary reveal on touch; v2.3.4 will add detail here. */}
      <div id={detailId} className="project-row-detail" hidden={!selected}>
        {selected && <CategoryPlate category={project.category} className="is-inline" />}
      </div>
    </div>
  );
}

function ProjectsContent() {
  const revealRef = useReveal();
  const groups = groupByCategory(projects);

  const [isTouch, setIsTouch] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<Project | null>(null);
  // Floating-plate position; `pinned` means anchored to a focused row (keyboard).
  const [pos, setPos] = useState<{ x: number; y: number; pinned: boolean }>({ x: 0, y: 0, pinned: false });

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  const showPreview = (p: Project, rect?: DOMRect) => {
    setPreview(p);
    if (rect) {
      // Keyboard focus: anchor beside the row, clamped to the viewport.
      const x = Math.min(rect.right + 20, window.innerWidth - PLATE_W - 12);
      const y = Math.min(Math.max(rect.top, 12), window.innerHeight - PLATE_H - 12);
      setPos({ x, y, pinned: true });
    }
  };
  const clearPreview = (p: Project) => setPreview((cur) => (cur === p ? null : cur));

  const onMove = (e: React.MouseEvent) => {
    if (isTouch || pos.pinned) return;
    const x = Math.min(e.clientX + 24, window.innerWidth - PLATE_W - 12);
    const y = Math.min(Math.max(e.clientY - PLATE_H / 2, 12), window.innerHeight - PLATE_H - 12);
    setPos({ x, y, pinned: false });
  };

  let running = 0;

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
      <div className="project-index" onMouseMove={onMove}>
        {groups.map(([cat, items]) => {
          const start = running + 1;
          running += items.length;
          return (
            <section key={cat} className="project-group" aria-label={cat}>
              <header className="project-group-head" style={{ color: CAT_ACCENT[cat] }}>
                <span className="project-group-name">{cat}</span>
                <span className="project-group-count" aria-hidden="true">
                  {String(items.length).padStart(2, "0")}
                </span>
              </header>

              {items.map((p, i) => (
                <ProjectRow
                  key={p.id}
                  project={p}
                  index={start + i}
                  isTouch={isTouch}
                  selected={selectedId === p.id}
                  onSelect={() => setSelectedId((id) => (id === p.id ? null : p.id))}
                  onPreview={showPreview}
                  onClearPreview={clearPreview}
                />
              ))}
            </section>
          );
        })}
      </div>

      {/* Floating preview — pointer (follows cursor) + keyboard (anchored). Never on touch. */}
      {!isTouch && preview && (
        <div
          className="project-plate-floating"
          aria-hidden="true"
          style={{ left: pos.x, top: pos.y }}
        >
          <CategoryPlate category={preview.category} />
        </div>
      )}
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
