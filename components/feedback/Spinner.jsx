import React from "react";
import { useScopedStyles } from "../_styles.js";
import { warnOnce } from "../_warn.js";

export function Spinner({
  size = "md",
  color,
  tone,
  label = "Loading",
  className = "",
  ...rest
}) {
  if (process.env.NODE_ENV !== "production" && color !== undefined && tone === undefined) {
    warnOnce("Spinner.color", "Spinner: `color` is deprecated and will be removed in 2.0 — use `tone` (matches every other tone-driven component).");
  }
  // `tone` is the canonical name (matches Progress/Badge/Alert/…); `color` is a deprecated alias
  // kept until 2.0 for the components that adopted it. `tone` wins.
  const resolvedTone = tone ?? color ?? "current";
  const __twcStyles = useScopedStyles("twc-spinner-styles", `
.twc-spinner {
  --_sz: 24px; --_bw: 2.5px;
  display: inline-block; width: var(--_sz); height: var(--_sz);
  /* Default to currentColor so the spinner is visible in any context — including
     inside a solid button, where it inherits the button's (light) text color. */
  border: var(--_bw) solid var(--_track, color-mix(in srgb, currentColor 25%, transparent));
  border-top-color: var(--_c, currentColor);
  border-radius: var(--radius-full); animation: twico-spin 0.65s linear infinite;
}
.twc-spinner[data-size="sm"] { --_sz: 16px; --_bw: 2px; }
.twc-spinner[data-size="lg"] { --_sz: 36px; --_bw: 3.5px; }
.twc-spinner[data-size="xl"] { --_sz: 52px; --_bw: 4px; }
.twc-spinner[data-tone="primary"] { --_c: var(--color-primary); --_track: var(--color-border); }
.twc-spinner[data-tone="success"] { --_c: var(--color-success); --_track: var(--color-border); }
.twc-spinner[data-tone="warning"] { --_c: var(--color-warning); --_track: var(--color-border); }
.twc-spinner[data-tone="danger"]  { --_c: var(--color-danger); --_track: var(--color-border); }
.twc-spinner[data-tone="info"]    { --_c: var(--color-info); --_track: var(--color-border); }
.twc-spinner[data-tone="white"] { --_c: #fff; --_track: rgba(255,255,255,0.35); }
.twc-spinner[data-tone="neutral"] { --_c: var(--color-text); --_track: var(--color-border); }
/* A loading spinner conveys state — keep it spinning even under reduced motion. */
@media (prefers-reduced-motion: reduce) {
  .twc-spinner { animation-duration: 0.65s !important; animation-iteration-count: infinite !important; }
}
`);

  return <span className={`twc-spinner ${className}`} data-size={size} data-tone={resolvedTone} role="status" aria-label={label} {...rest}>{__twcStyles}</span>;
}
