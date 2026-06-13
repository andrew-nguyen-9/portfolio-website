"use client";

import { useState } from "react";
import { projects, type Project } from "@/content/projects";

const STATUS_LABELS: Record<Project["status"], string> = {
  live:     "Live",
  building: "Building",
  planned:  "Planned",
};

const STATUS_COLORS: Record<Project["status"], string> = {
  live:     "var(--primary)",
  building: "var(--highlight)",
  planned:  "var(--fg-subtle)",
};

function StatusDot({ status }: { status: Project["status"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] tracking-widest uppercase">
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: STATUS_COLORS[status] }}
        aria-hidden="true"
      />
      <span style={{ color: STATUS_COLORS[status] }}>{STATUS_LABELS[status]}</span>
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card" aria-label={project.name}>
      <div
        className="project-card-inner rounded-2xl border border-[var(--border)] p-7 flex flex-col gap-5"
        style={{ background: "var(--surface)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              className="font-heading text-xl font-semibold mb-1"
              style={{ fontFamily: "var(--font-ibm-plex-serif), Georgia, serif" }}
            >
              {project.name}
            </h3>
            <p
              className="text-sm leading-snug"
              style={{ color: "var(--fg-muted)", fontFamily: "var(--font-ibm-plex-serif), Georgia, serif", fontStyle: "italic" }}
            >
              {project.tagline}
            </p>
          </div>
          <StatusDot status={project.status} />
        </div>

        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: "var(--fg-muted)" }}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[0.6rem] tracking-wider px-2 py-1 rounded border border-[var(--border)]"
              style={{
                color: "var(--fg-subtle)",
                fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-1">
          {project.status !== "planned" && (
            <a
              href={`https://${project.subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-[var(--primary)] transition-colors"
              aria-label={`Visit ${project.name}`}
            >
              Visit
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 10L10 2M5 2h5v5" />
              </svg>
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm opacity-50 hover:opacity-90 transition-opacity"
              aria-label={`${project.name} on GitHub`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--fg)" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.003.071 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Repo
            </a>
          )}
          <span
            className="ml-auto font-mono text-[0.6rem] tracking-wider opacity-30"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            {project.year}
          </span>
        </div>
      </div>
    </article>
  );
}

type View = "grid" | "list";
type Filter = "all" | "featured";

export default function Projects() {
  const [view,   setView]   = useState<View>("grid");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = filter === "featured"
    ? projects.filter((p) => p.featured)
    : projects;

  return (
    <section id="projects" aria-labelledby="projects-heading" className="section">
      {/* Header row */}
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <p
            className="font-mono text-xs tracking-[0.25em] uppercase mb-4 opacity-50"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            02 / Projects
          </p>
          <h2
            id="projects-heading"
            className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontVariationSettings: "'opsz' 72, 'SOFT' 40",
            }}
          >
            Things I&apos;m building
          </h2>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Filter */}
          <div
            className="flex rounded-full border border-[var(--border)] overflow-hidden"
            role="group"
            aria-label="Filter projects"
          >
            {(["all", "featured"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className="px-4 py-2 text-xs tracking-wide capitalize transition-colors"
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  background: filter === f ? "var(--primary)" : "transparent",
                  color:      filter === f ? "var(--bg)"     : "var(--fg-muted)",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div
            className="flex rounded-full border border-[var(--border)] overflow-hidden"
            role="group"
            aria-label="Toggle view"
          >
            {([
              { id: "grid", icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                  <rect x="0" y="0" width="5.5" height="5.5" rx="1" />
                  <rect x="8.5" y="0" width="5.5" height="5.5" rx="1" />
                  <rect x="0" y="8.5" width="5.5" height="5.5" rx="1" />
                  <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" />
                </svg>
              )},
              { id: "list", icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M1 3h12M1 7h12M1 11h12" />
                </svg>
              )},
            ] as { id: View; icon: React.ReactNode }[]).map(({ id, icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                aria-pressed={view === id}
                aria-label={`${id} view`}
                className="px-3 py-2 transition-colors"
                style={{
                  background: view === id ? "var(--primary)" : "transparent",
                  color:      view === id ? "var(--bg)"     : "var(--fg-muted)",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {visible.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
