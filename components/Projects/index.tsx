"use client";

import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/content/projects";
import { useReveal } from "@/hooks/useReveal";

const STATUS_LABELS: Record<Project["status"], string> = {
  live:     "Live",
  building: "Building",
  planned:  "Planned",
};

const CATEGORY_COLORS: Record<string, string> = {
  Music:  "#9E4A24",
  Sports: "#3F6B52",
  Games:  "#7A9A88",
  Civic:  "#C27848",
  Food:   "#89AD9E",
};

/* Rich gradient artwork for each category front face */
const CARD_GRADIENTS: Record<string, string> = {
  Music:  "linear-gradient(145deg, #1a0a2e 0%, #3d1a6e 40%, #7a3db8 75%, #b860c8 100%)",
  Sports: "linear-gradient(145deg, #0a1f10 0%, #1a4828 40%, #2a7845 75%, #3daa60 100%)",
  Games:  "linear-gradient(145deg, #08102a 0%, #142060 40%, #2040a8 75%, #3868d8 100%)",
  Civic:  "linear-gradient(145deg, #101820 0%, #1a3050 40%, #245078 75%, #3878a8 100%)",
  Food:   "linear-gradient(145deg, #200808 0%, #5a1808 40%, #a03818 75%, #d86030 100%)",
};

function StatusBadge({ status }: { status: Project["status"] }) {
  const color = status === "live" ? "var(--primary)" : status === "building" ? "var(--highlight)" : "var(--fg-subtle)";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[0.58rem] tracking-widest uppercase"
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        color,
        filter: "brightness(1.2)",
        background: "rgba(0,0,0,0.75)",
        padding: "4px 10px",
        borderRadius: 20,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}

/* ── Flip card (grid view) ─────────────────────────────── */
function FlipCard({ project }: { project: Project }) {
  const [flipped, setFlipped] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const catColor = CATEGORY_COLORS[project.category] ?? "#7D9A8A";
  const gradient = CARD_GRADIENTS[project.category] ?? CARD_GRADIENTS.Sports;
  const imgPosition = project.id === "cooking-music-game" ? "top" : "center";
  const frontStyle = project.imageUrl
    ? { backgroundImage: `url('${project.imageUrl}')`, backgroundSize: "cover", backgroundPosition: imgPosition }
    : { background: gradient };

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  return (
    <article
      className={`project-card${flipped ? " flipped" : ""}`}
      aria-label={project.name}
      onClick={isTouch ? () => setFlipped((f) => !f) : undefined}
    >
      <div className="project-card-inner">
        {/* ── FRONT ── */}
        <div className="project-card-front" style={frontStyle}>
          {/* Vignette — blurred dark edges over the photo */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 55%, transparent 28%, rgba(0,0,0,0.68) 100%)",
            }}
          />

          {/* Status + category top row */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
            <StatusBadge status={project.status} />
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: catColor,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                filter: "brightness(1.2)",
                background: "rgba(0,0,0,0.75)",
                padding: "4px 10px",
                borderRadius: 20,
              }}
            >
              {project.category}
            </span>
          </div>

          {/* Bottom name/tagline overlay */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
              padding: "48px 20px 20px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
                marginBottom: 4,
              }}
            >
              {project.name}
            </h3>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.35 }}>
              {project.tagline}
            </p>
          </div>

          {/* Touch hint */}
          {isTouch && (
            <div
              className="absolute bottom-4 right-4"
              style={{ opacity: 0.5, color: "#fff" }}
              aria-hidden="true"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
          )}
        </div>

        {/* ── BACK ── */}
        <div className="project-card-back">
          {/* Colour top bar */}
          <div style={{ height: 3, background: catColor, opacity: 0.8, flexShrink: 0 }} aria-hidden="true" />

          <div className="flex flex-col gap-4 p-5 flex-1 overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3
                  className="text-base mb-0.5"
                  style={{ fontFamily: "var(--font-display), sans-serif", fontWeight: 700, letterSpacing: "-0.02em" }}
                >
                  {project.name}
                </h3>
                <p className="text-xs italic leading-snug" style={{ color: "var(--fg-muted)" }}>
                  {project.tagline}
                </p>
              </div>
              <StatusBadge status={project.status} />
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--fg-muted)" }}>
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.55rem] tracking-wider px-1.5 py-0.5 rounded border border-[var(--border)]"
                  style={{ color: "var(--fg-subtle)", fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 pt-0.5 border-t border-[var(--border)]">
              {project.status !== "planned" && (
                <a
                  href={`https://${project.subdomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium hover:text-[var(--primary)] transition-colors"
                  aria-label={`Visit ${project.name}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit
                  <svg width="10" height="10" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M1.5 9.5L9.5 1.5M5 1.5h4.5v4.5"/>
                  </svg>
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs opacity-45 hover:opacity-90 transition-opacity"
                  aria-label={`${project.name} on GitHub`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--fg)" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.003.071 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  Repo
                </a>
              )}
              <span
                className="ml-auto text-[0.55rem] tracking-wider opacity-30"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                {project.year}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── List card (list view — no flip) ──────────────────── */
function ListCard({ project }: { project: Project }) {
  const catColor = CATEGORY_COLORS[project.category] ?? "var(--primary)";
  return (
    <article
      className="rounded-2xl border border-[var(--border)] overflow-hidden flex gap-0 hover:-translate-y-0.5 transition-transform"
      style={{ background: "var(--surface)" }}
      aria-label={project.name}
    >
      {/* Side accent */}
      <div style={{ width: 4, background: catColor, opacity: 0.75, flexShrink: 0 }} aria-hidden="true" />
      <div className="flex flex-wrap items-start justify-between gap-4 p-5 flex-1">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 style={{ fontFamily: "var(--font-display), sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>
              {project.name}
            </h3>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-sm italic" style={{ color: "var(--fg-muted)" }}>{project.tagline}</p>
          <p className="text-xs leading-relaxed mt-1" style={{ color: "var(--fg-muted)" }}>{project.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {project.tags.map((t) => (
              <span key={t} className="text-[0.55rem] tracking-wider px-1.5 py-0.5 rounded border border-[var(--border)]"
                style={{ color: "var(--fg-subtle)", fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {project.status !== "planned" && (
            <a href={`https://${project.subdomain}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium hover:text-[var(--primary)] transition-colors"
              aria-label={`Visit ${project.name}`}>
              Visit <svg width="10" height="10" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M1.5 9.5L9.5 1.5M5 1.5h4.5v4.5"/></svg>
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs opacity-40 hover:opacity-80 transition-opacity"
              aria-label={`${project.name} on GitHub`}>
              Repo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Main section ──────────────────────────────────────── */
type View   = "grid" | "list";
type Filter = "all"  | "featured";

function ProjectsContent() {
  const [view,   setView]   = useState<View>("grid");
  const [filter, setFilter] = useState<Filter>("all");
  const revealRef    = useReveal();
  const filterBarRef = useRef<HTMLDivElement>(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const visible = filter === "featured" ? projects.filter((p) => p.featured) : projects;

  // Slide the underline indicator under the active filter label
  useEffect(() => {
    const bar = filterBarRef.current;
    if (!bar) return;
    const id = requestAnimationFrame(() => {
      const btn = bar.querySelector<HTMLButtonElement>(`[data-f="${filter}"]`);
      if (btn) setUnderline({ left: btn.offsetLeft, width: btn.offsetWidth });
    });
    return () => cancelAnimationFrame(id);
  }, [filter]);

  return (
    <div ref={revealRef} className="reveal">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-4 opacity-50"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            02 / Projects
          </p>
          <h2 id="projects-heading" className="leading-[1.0] tracking-tight"
            style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Things I&apos;m building
          </h2>
        </div>

        <div className="flex items-center gap-5">
          {/* Sliding underline filter */}
          <div ref={filterBarRef} className="relative flex items-center pb-px" role="group" aria-label="Filter projects">
            {(["all", "featured"] as Filter[]).map((f) => (
              <button
                key={f}
                data-f={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className="px-3 pb-2 text-xs capitalize transition-colors"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  letterSpacing: "0.08em",
                  background: "transparent",
                  border: "none",
                  color: filter === f ? "var(--fg)" : "var(--fg-subtle)",
                }}
              >
                {f}
              </button>
            ))}
            {/* Animated underline */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                left: underline.left,
                width: underline.width,
                height: 2,
                background: "var(--primary)",
                borderRadius: 1,
                transition: "left 0.26s cubic-bezier(0.4,0,0.2,1), width 0.26s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>

          {/* View toggle — minimal icon pair */}
          <div className="flex items-center gap-1" role="group" aria-label="Toggle layout">
            {([
              { id: "grid" as View, icon: <svg width="14" height="14" viewBox="0 0 13 13" fill="currentColor" aria-hidden="true"><rect x="0" y="0" width="5.5" height="5.5" rx="1"/><rect x="7.5" y="0" width="5.5" height="5.5" rx="1"/><rect x="0" y="7.5" width="5.5" height="5.5" rx="1"/><rect x="7.5" y="7.5" width="5.5" height="5.5" rx="1"/></svg> },
              { id: "list" as View, icon: <svg width="14" height="14" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M1 2.5h11M1 6.5h11M1 10.5h11"/></svg> },
            ]).map(({ id, icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                aria-pressed={view === id}
                aria-label={`${id} layout`}
                className="p-2 rounded transition-colors"
                style={{
                  color: view === id ? "var(--primary)" : "var(--fg-subtle)",
                  background: "transparent",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {visible.map((p) => <FlipCard key={p.id} project={p} />)}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((p) => <ListCard key={p.id} project={p} />)}
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
