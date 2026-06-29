"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FontSize = "small" | "medium" | "large";

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "19px",
};

// ─── Inline Toggle Switch ─────────────────────────────────────────────────────

function ToggleSwitch({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  id: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        padding: 0,
        flexShrink: 0,
        position: "relative",
        background: checked ? "var(--primary)" : "var(--border-strong)",
        transition: "background 0.2s",
        outline: "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          display: "block",
        }}
      />
      <span className="sr-only">{checked ? "On" : "Off"}</span>
    </button>
  );
}

// ─── Accessibility Icon SVG ───────────────────────────────────────────────────

function A11yIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="4" r="2" />
      <path d="M15.5 8.5l-3.5-.5-3.5.5L6 16h2.5l1-4.5 1 2.5v4h3v-4l1-2.5 1 4.5H18l-2.5-7.5z" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const LS_KEY = "a11y-panel";

interface A11yState {
  fontSize: FontSize;
  highContrast: boolean;
  reduceMotion: boolean;
}

function loadState(prefersReducedMotion: boolean): A11yState {
  const defaults: A11yState = {
    fontSize: "medium",
    highContrast: false,
    reduceMotion: prefersReducedMotion,
  };
  try {
    const raw = localStorage.getItem(LS_KEY);
    // Merge over defaults so older saved state (which may carry retired keys) still loads.
    if (raw) return { ...defaults, ...(JSON.parse(raw) as Partial<A11yState>) };
  } catch {
    // ignore
  }
  return defaults;
}

function saveState(state: A11yState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export default function A11yPanel() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<A11yState>({
    fontSize: "medium",
    highContrast: false,
    reduceMotion: false,
  });

  // Hydrate from localStorage + media query on mount
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const loaded = loadState(prefersReducedMotion);
    setState(loaded);
    applyState(loaded);
    setMounted(true);
  }, []);

  function applyState(next: A11yState) {
    const root = document.documentElement;
    root.style.fontSize = FONT_SIZE_MAP[next.fontSize];
    root.classList.toggle("high-contrast", next.highContrast);
    root.classList.toggle("reduce-motion", next.reduceMotion);
  }

  function update(patch: Partial<A11yState>) {
    setState((prev) => {
      const next = { ...prev, ...patch };
      applyState(next);
      saveState(next);
      return next;
    });
  }

  // Don't render until mounted to avoid SSR/hydration mismatch
  if (!mounted) return null;

  const fontSizeOptions: { key: FontSize; label: string; ariaLabel: string }[] =
    [
      { key: "small", label: "A", ariaLabel: "Small text" },
      { key: "medium", label: "A", ariaLabel: "Medium text" },
      { key: "large", label: "A", ariaLabel: "Large text" },
    ];

  const fontSizeScale: Record<FontSize, number> = {
    small: 0.78,
    medium: 1,
    large: 1.22,
  };

  return (
    <div
      className="fixed bottom-6 right-6 flex flex-col items-end gap-3"
      style={{ zIndex: 500 }}
    >
      {/* ── Panel ── */}
      {open && (
        <div
          role="region"
          aria-label="Accessibility settings"
          style={{
            width: "min(260px, calc(100vw - 48px))",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.18), 0 1.5px 6px rgba(0,0,0,0.10)",
            overflow: "hidden",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 14px 10px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <A11yIcon />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
              }}
            >
              Accessibility
            </span>
          </div>

          {/* Body */}
          <div style={{ padding: "14px" }}>
            {/* Font size */}
            <div style={{ marginBottom: 12 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--fg-muted)",
                  marginBottom: 8,
                }}
              >
                Text size
              </p>
              <div style={{ display: "flex", gap: 6 }}>
                {fontSizeOptions.map(({ key, label, ariaLabel }) => {
                  const active = state.fontSize === key;
                  return (
                    <button
                      key={key}
                      aria-label={ariaLabel}
                      aria-pressed={active}
                      onClick={() => update({ fontSize: key })}
                      style={{
                        flex: 1,
                        height: 36,
                        borderRadius: 8,
                        border: active
                          ? "1.5px solid var(--primary)"
                          : "1.5px solid var(--border)",
                        background: active ? "var(--primary)" : "var(--bg)",
                        color: active ? "var(--bg)" : "var(--fg)",
                        cursor: "pointer",
                        fontSize: `${fontSizeScale[key] * 14}px`,
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "var(--border)",
                margin: "12px 0",
              }}
            />

            {/* High contrast */}
            <label
              htmlFor="a11y-high-contrast"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 12,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "var(--fg)",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                }}
              >
                High contrast
              </span>
              <ToggleSwitch
                id="a11y-high-contrast"
                checked={state.highContrast}
                onChange={(val) => update({ highContrast: val })}
              />
            </label>

            {/* Reduce motion */}
            <label
              htmlFor="a11y-reduce-motion"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "var(--fg)",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                }}
              >
                Reduce motion
              </span>
              <ToggleSwitch
                id="a11y-reduce-motion"
                checked={state.reduceMotion}
                onChange={(val) => update({ reduceMotion: val })}
              />
            </label>
          </div>
        </div>
      )}

      {/* ── Trigger button ── */}
      <button
        aria-label={open ? "Close accessibility panel" : "Open accessibility panel"}
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen((v) => !v)}
        className="w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
        style={{
          background: open ? "var(--primary)" : "var(--surface)",
          color: open ? "var(--bg)" : "var(--fg)",
          border: "1.5px solid var(--border-strong)",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          transition: "background 0.2s, color 0.2s",
          flexShrink: 0,
        }}
      >
        <A11yIcon />
      </button>
    </div>
  );
}
