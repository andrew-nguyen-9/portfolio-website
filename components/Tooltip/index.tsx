"use client";

import { useId } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  /** Sentence-length descriptions: wraps, normal case, wider, left-aligned. */
  rich?: boolean;
  /** Make the wrapper keyboard-focusable + tap-revealable when the child isn't
   *  itself an interactive (focusable) element. */
  tabbable?: boolean;
}

export default function Tooltip({ content, children, rich, tabbable }: TooltipProps) {
  const id = useId();
  return (
    <span
      className="tooltip-wrapper"
      aria-describedby={id}
      {...(tabbable ? { tabIndex: 0 } : {})}
    >
      {children}
      <span id={id} className={`tooltip${rich ? " tooltip-rich" : ""}`} role="tooltip">
        {content}
      </span>
    </span>
  );
}
