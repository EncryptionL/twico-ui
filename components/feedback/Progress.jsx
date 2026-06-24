import React from "react";
import { useScopedStyles } from "../_styles.js";

export function Progress({
  value = 0,
  max = 100,
  tone = "primary",
  size = "md",
  indeterminate = false,
  showLabel = false,
  className = "",
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-progress-styles", `
.twc-progress-wrap { display: flex; flex-direction: column; gap: 6px; font-family: var(--font-sans); }
.twc-progress {
  --_h: 8px;
  position: relative; width: 100%; height: var(--_h); overflow: hidden;
  background: var(--color-surface-sunken); border-radius: var(--radius-full);
}
.twc-progress[data-size="sm"] { --_h: 5px; }
.twc-progress[data-size="lg"] { --_h: 12px; }
.twc-progress__bar {
  height: 100%; border-radius: var(--radius-full);
  background: var(--_c, var(--color-primary));
  transition: width var(--duration-slow) var(--ease-out);
}
.twc-progress[data-tone="info"]    .twc-progress__bar { --_c: var(--color-info); }
.twc-progress[data-tone="success"] .twc-progress__bar { --_c: var(--color-success); }
.twc-progress[data-tone="warning"] .twc-progress__bar { --_c: var(--color-warning); }
.twc-progress[data-tone="danger"]  .twc-progress__bar { --_c: var(--color-danger); }
.twc-progress[data-indeterminate="true"] .twc-progress__bar {
  position: absolute; width: 40%; animation: twc-progress-indeterminate 1.3s var(--ease-standard) infinite;
}
/* Logical-property keyframe so the indeterminate bar follows document direction (RTL-safe). */
@keyframes twc-progress-indeterminate {
  0%   { inset-inline-start: -40%; inset-inline-end: 100%; }
  60%  { inset-inline-start: 100%; inset-inline-end: -90%; }
  100% { inset-inline-start: 100%; inset-inline-end: -90%; }
}
.twc-progress__meta { display: flex; justify-content: space-between; font-size: var(--text-xs); color: var(--color-text-muted); }
/* Indeterminate progress signals ongoing work — keep it animating under reduced motion. */
@media (prefers-reduced-motion: reduce) {
  .twc-progress[data-indeterminate="true"] .twc-progress__bar { animation-duration: 1.3s !important; animation-iteration-count: infinite !important; }
}
`);

  const v = Number.isFinite(value) ? value : 0;
  const pct = indeterminate ? 0 : (max > 0 ? Math.min(100, Math.max(0, (v / max) * 100)) : 0);

  return (
    // Single-root contract: className and ...rest (style, id, handlers, …) share the outer
    // wrapper; role="progressbar" + aria-value* stay on the inner track.
    <div className={`twc-progress-wrap ${className}`} {...rest}>
      {__twcStyles}
      {showLabel && !indeterminate ? (
        <div className="twc-progress__meta"><span>Progress</span><span>{Math.round(pct)}%</span></div>
      ) : null}
      <div className="twc-progress" data-tone={tone} data-size={size} data-indeterminate={indeterminate || undefined}
           role="progressbar" aria-valuenow={indeterminate ? undefined : Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div className="twc-progress__bar" style={indeterminate ? undefined : { width: `${pct}%` }} />
      </div>
    </div>
  );
}
