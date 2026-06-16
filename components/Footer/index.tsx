import { ANLogo } from "@/components/Logo";

const SOCIAL = [
  { label: "GitHub",   href: "https://github.com/andrew-nguyen-9",           external: true  },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/andrew-t-nguyen/",         external: true  },
  { label: "Email",    href: "mailto:andrewng9999@gmail.com",                 external: false },
];

const NAV = [
  { label: "About",    href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact",  href: "#contact" },
];

export default function Footer() {
  return (
    <footer
      className="section pt-0"
      style={{ borderTop: "1px solid var(--border)", paddingLeft: "20px", paddingRight: "20px" }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10 pt-14 pb-10">
        {/* Monogram + tagline */}
        <div className="col-span-2 sm:col-span-1">
          <ANLogo size={96} className="mb-4" />
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            Forensic data analyst.
            <br />Pipeline architect.
            <br />Chicago builder.
          </p>
        </div>

        {/* Nav links */}
        <div>
          <p
            className="text-[0.6rem] tracking-[0.2em] uppercase mb-4 opacity-50"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            Pages
          </p>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {NAV.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-sm hover:text-[var(--primary)] transition-colors"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social links */}
        <div>
          <p
            className="text-[0.6rem] tracking-[0.2em] uppercase mb-4 opacity-50"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            Find me
          </p>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {SOCIAL.map(({ label, href, external }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex items-center gap-1.5 text-sm hover:text-[var(--primary)] transition-colors"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {label}
                  {external && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                      <path d="M1 9L9 1M6 1h3v3" />
                    </svg>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-3 pt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span
          className="text-xs opacity-35"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          © {new Date().getFullYear()} Andrew Nguyen
        </span>
        <span
          className="text-xs opacity-35"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          an9.dev
        </span>
      </div>
    </footer>
  );
}
