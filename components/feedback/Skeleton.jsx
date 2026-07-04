import React from "react";
import { useScopedStyles } from "../_styles.js";

export function Skeleton({
  variant = "text",
  width,
  height,
  lines = 1,
  label,
  className = "",
  style,
  ...rest
}) {
  // Decorative by default (aria-hidden). With a label it becomes a polite loading status.
  const a11y = label != null
    ? { role: "status", "aria-live": "polite", "aria-busy": true }
    : { "aria-hidden": true };
  const __twcStyles = useScopedStyles("twc-skeleton-styles", `
.twc-skeleton {
  position: relative; overflow: hidden;
  background: var(--color-surface-sunken); border-radius: var(--radius-md);
}
.twc-skeleton::after {
  content: ""; position: absolute; inset: 0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-text) 8%, transparent), transparent);
  animation: twico-shimmer 1.4s infinite;
}
.twc-skeleton[data-variant="text"] { height: 0.9em; border-radius: var(--radius-sm); }
.twc-skeleton[data-variant="circle"] { aspect-ratio: 1; border-radius: var(--radius-full); }
.twc-skeleton[data-variant="rect"] { border-radius: var(--radius-md); }
.twc-skeleton__group { display: flex; flex-direction: column; gap: 8px; }
.twc-skeleton__group .twc-skeleton:last-child { width: 70%; }
.twc-skeleton__sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
/* The shimmer signals loading — keep it animating even under reduced motion. */
@media (prefers-reduced-motion: reduce) {
  .twc-skeleton::after { animation-duration: 1.4s !important; animation-iteration-count: infinite !important; }
}
`);

  if (variant === "text" && lines > 1) {
    // `height` and consumer `style` apply to the group wrapper; `width` applies per line.
    return (
      <div className={`twc-skeleton__group ${className}`} style={{ height, ...style }} {...a11y} {...rest}>
        {__twcStyles}
        {label != null ? <span className="twc-skeleton__sr">{label}</span> : null}
        {Array.from({ length: lines }).map((_, i) => (
          <span key={i} className="twc-skeleton" data-variant="text" style={{ width: width || "100%" }} />
        ))}
      </div>
    );
  }

  return (
    <span
      className={`twc-skeleton ${className}`}
      data-variant={variant}
      style={{ width, height, ...style }}
      {...a11y}
      {...rest}
    >
      {__twcStyles}
      {label != null ? <span className="twc-skeleton__sr">{label}</span> : null}
    </span>
  );
}
