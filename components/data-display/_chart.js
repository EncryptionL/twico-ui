import React from "react";

// ---------------------------------------------------------------------------
// Shared, dependency-free helpers for the chart family (Chart, PieChart, Gauge,
// Sparkline, ScatterChart, BubbleChart, RadarChart, PolarAreaChart, Heatmap,
// FunnelChart, Treemap, Candlestick, Boxplot, RangeChart).
//
// Internal only — NOT exported from the public barrel. Every chart component is
// still self-contained: it imports these pure helpers (+ the shared base CSS and
// the a11y table / legend renderers) and renders its own inline SVG + scoped CSS.
// See docs/charts.md.
// ---------------------------------------------------------------------------

/** Theme-aware series palette (token colors), cycled for multi-series charts. */
export const CHART_PALETTE = [
  "var(--brand-500)",
  "var(--sky-500)",
  "var(--emerald-500)",
  "var(--amber-500)",
  "var(--rose-500)",
  "var(--indigo-500)",
  "var(--slate-500)",
];

/** Pick series color `i` from a custom palette (falls back to CHART_PALETTE, cycled). */
export function paletteAt(colors, i) {
  const p = colors && colors.length ? colors : CHART_PALETTE;
  return p[((i % p.length) + p.length) % p.length];
}

// ---- number helpers -------------------------------------------------------

/** Round to at most 2 decimals and drop trailing zeros — keeps SVG path data terse. */
export function r(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

/** Round a value up to the nearest 1/2/5 × 10ⁿ (a "nice" axis maximum). */
export function niceCeil(v) {
  if (!(v > 0)) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

function niceNum(range, round) {
  const exp = Math.floor(Math.log10(range || 1));
  const frac = (range || 1) / Math.pow(10, exp);
  let nf;
  if (round) nf = frac < 1.5 ? 1 : frac < 3 ? 2 : frac < 7 ? 5 : 10;
  else nf = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return nf * Math.pow(10, exp);
}

/** A "nice" axis scale: rounded min/max, a round step, and the tick values. */
export function niceScale(min, max, maxTicks = 5) {
  if (!isFinite(min) || !isFinite(max)) return { min: 0, max: 1, step: 1, ticks: [0, 1] };
  if (min === max) { max = min + 1; }
  const range = niceNum(max - min, false);
  const step = niceNum(range / Math.max(1, maxTicks - 1), true);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = niceMin; v <= niceMax + step / 2; v += step) ticks.push(Number(v.toFixed(10)));
  return { min: niceMin, max: niceMax, step, ticks };
}

/** Compact number: 1.2k, 3.4M, 5B — for dense axis labels. */
export function shortNum(v) {
  const n = Number(v) || 0;
  const abs = Math.abs(n), sign = n < 0 ? "-" : "";
  if (abs >= 1e9) return sign + (abs / 1e9).toFixed(abs % 1e9 ? 1 : 0) + "B";
  if (abs >= 1e6) return sign + (abs / 1e6).toFixed(abs % 1e6 ? 1 : 0) + "M";
  if (abs >= 1e3) return sign + (abs / 1e3).toFixed(abs % 1e3 ? 1 : 0) + "k";
  return String(Math.round(n * 100) / 100);
}

/** Default value formatter (locale-grouped). */
export function fmtNumber(v) {
  return (Number(v) || 0).toLocaleString();
}

/** Sum of an array of numbers. */
export const sum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);

// ---- geometry -------------------------------------------------------------

export const TAU = Math.PI * 2;

/**
 * Point on a circle. `deg` is measured clockwise with 0° at 12 o'clock (top),
 * matching how pies/gauges/radars are laid out.
 */
export function polarDeg(cx, cy, radius, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
}

/**
 * SVG path for a pie wedge (`rInner <= 0`) or donut segment, swept clockwise
 * from `startDeg` to `endDeg`. Near-full circles are clamped just under 360° so
 * the single arc still renders (SVG can't draw a 360° arc in one command).
 */
export function arcPath(cx, cy, rOuter, rInner, startDeg, endDeg) {
  let span = endDeg - startDeg;
  if (span >= 360) { endDeg = startDeg + 359.999; span = 359.999; }
  const large = Math.abs(span) > 180 ? 1 : 0;
  const [ox0, oy0] = polarDeg(cx, cy, rOuter, startDeg);
  const [ox1, oy1] = polarDeg(cx, cy, rOuter, endDeg);
  if (!(rInner > 0)) {
    return `M${r(cx)} ${r(cy)} L${r(ox0)} ${r(oy0)} A${r(rOuter)} ${r(rOuter)} 0 ${large} 1 ${r(ox1)} ${r(oy1)} Z`;
  }
  const [ix1, iy1] = polarDeg(cx, cy, rInner, endDeg);
  const [ix0, iy0] = polarDeg(cx, cy, rInner, startDeg);
  return (
    `M${r(ox0)} ${r(oy0)} A${r(rOuter)} ${r(rOuter)} 0 ${large} 1 ${r(ox1)} ${r(oy1)} ` +
    `L${r(ix1)} ${r(iy1)} A${r(rInner)} ${r(rInner)} 0 ${large} 0 ${r(ix0)} ${r(iy0)} Z`
  );
}

/**
 * Polyline / smooth / stepped path from `[[x,y], …]`.
 *   - `smooth`: Catmull-Rom → cubic bézier (rounded curve, minimal overshoot);
 *   - `step`: `"before" | "after"` orthogonal staircase;
 *   - otherwise straight segments.
 */
export function linePath(points, { smooth = false, step = null } = {}) {
  const p = points.filter((pt) => pt && isFinite(pt[0]) && isFinite(pt[1]));
  if (!p.length) return "";
  if (step) {
    let d = `M${r(p[0][0])} ${r(p[0][1])}`;
    for (let i = 1; i < p.length; i++) {
      const [x, y] = p[i], [px, py] = p[i - 1];
      if (step === "before") d += ` L${r(px)} ${r(y)} L${r(x)} ${r(y)}`;
      else d += ` L${r(x)} ${r(py)} L${r(x)} ${r(y)}`;
    }
    return d;
  }
  if (!smooth || p.length < 3) {
    return p.map((pt, i) => `${i ? "L" : "M"}${r(pt[0])} ${r(pt[1])}`).join(" ");
  }
  let d = `M${r(p[0][0])} ${r(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${r(c1x)} ${r(c1y)} ${r(c2x)} ${r(c2y)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d;
}

/** Filled-area path: a line along `points`, dropped to `baselineY` and closed. */
export function areaPath(points, baselineY, opts = {}) {
  const p = points.filter((pt) => pt && isFinite(pt[0]) && isFinite(pt[1]));
  if (!p.length) return "";
  const top = linePath(p, opts);
  const last = p[p.length - 1], first = p[0];
  return `${top} L${r(last[0])} ${r(baselineY)} L${r(first[0])} ${r(baselineY)} Z`;
}

/** Closed polygon path from `[[x,y], …]` (radar / polar shapes). */
export function polygonPath(points) {
  const p = points.filter((pt) => pt && isFinite(pt[0]) && isFinite(pt[1]));
  if (!p.length) return "";
  return p.map((pt, i) => `${i ? "L" : "M"}${r(pt[0])} ${r(pt[1])}`).join(" ") + " Z";
}

// ---- shared CSS + a11y renderers -----------------------------------------

/**
 * Base styles shared by every chart (root wrapper, the visually-hidden data
 * table, and the legend). Injected once under a single id (`useScopedStyles`
 * dedupes by id), so all chart components stay visually consistent.
 */
export const CHART_BASE_CSS = `
.twc-chart { font-family: var(--font-sans); width: 100%; position: relative; color: var(--color-text); }
.twc-chart svg { display: block; width: 100%; }
.twc-chart svg text { fill: var(--color-text-subtle); }
.twc-chart__sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.twc-chart__legend { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-3); font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-chart__leg { display: inline-flex; align-items: center; gap: 6px; }
.twc-chart__leg[data-toggle="true"] { cursor: pointer; user-select: none; }
.twc-chart__leg[data-off="true"] { opacity: 0.4; }
.twc-chart__leg-sw { width: 10px; height: 10px; border-radius: 3px; flex: none; }
@media (prefers-reduced-motion: reduce) { .twc-chart *[style*="animation"], .twc-chart [class*="anim"] { animation: none !important; } }
`;

/**
 * Visually-hidden data table — the accessible text alternative for a chart
 * (WCAG 1.1.1). `columns` are the value-column headers; each `rows[i]` is
 * `{ label, values }`.
 */
export function ChartTable({ id, caption, columns, rows }) {
  const h = React.createElement;
  return h(
    "table",
    { className: "twc-chart__sr", id },
    caption != null ? h("caption", null, caption) : null,
    h(
      "thead",
      null,
      h(
        "tr",
        null,
        h("th", { scope: "col" }),
        columns.map((c, i) => h("th", { key: i, scope: "col" }, c)),
      ),
    ),
    h(
      "tbody",
      null,
      rows.map((row, i) =>
        h(
          "tr",
          { key: i },
          h("th", { scope: "row" }, row.label),
          row.values.map((v, j) => h("td", { key: j }, v)),
        ),
      ),
    ),
  );
}

/** Series legend. `items` are `{ label, color }`; pass `onToggle`/`hidden` to make it interactive. */
export function ChartLegend({ items, onToggle, hidden }) {
  const h = React.createElement;
  return h(
    "div",
    { className: "twc-chart__legend" },
    items.map((it, i) =>
      h(
        "span",
        {
          key: i,
          className: "twc-chart__leg",
          "data-toggle": onToggle ? "true" : undefined,
          "data-off": hidden && hidden(it, i) ? "true" : undefined,
          role: onToggle ? "button" : undefined,
          tabIndex: onToggle ? 0 : undefined,
          onClick: onToggle ? () => onToggle(it, i) : undefined,
          onKeyDown: onToggle
            ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(it, i); } }
            : undefined,
        },
        h("span", { className: "twc-chart__leg-sw", style: { background: it.color } }),
        it.label,
      ),
    ),
  );
}
