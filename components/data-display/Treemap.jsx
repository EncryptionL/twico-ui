import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, paletteAt, fmtNumber, r, sum, ChartTable,
  useChartTooltip, ChartTooltip,
} from "./_chart.js";

const TREEMAP_CSS = `
.twc-chart__tile-label { fill: var(--color-text-inverted); font-size: var(--text-xs); font-weight: var(--font-semibold); pointer-events: none; }
.twc-chart__tile-value { fill: var(--color-text-inverted); font-size: 11px; opacity: 0.82; pointer-events: none; }
.twc-chart__empty { fill: var(--color-text-subtle); font-size: var(--text-sm); }
`;

/**
 * Treemap — a squarified partition of a rectangle into tiles sized in
 * proportion to a flat list of values (Bruls/Huizing/van Wijk, 1999). Tiles are
 * packed to keep their aspect ratios near 1:1. Dependency-free inline SVG; each
 * tile shows its label (and value, when it fits), animates in, and reveals a
 * floating tooltip with hover emphasis that dims the other tiles.
 */
export function Treemap({
  data,
  showValues = true,
  valueFormat,
  height = 300,
  colors,
  gap = 2,
  ariaLabel,
  "aria-label": ariaLabelProp,
  tableFallback = true,
  caption,
  className = "",
  ...rest
}) {
  const baseStyles = useScopedStyles("twc-chart-base", CHART_BASE_CSS);
  const styles = useScopedStyles("twc-treemap-styles", TREEMAP_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [hovered, setHovered] = React.useState(null);

  const rows = data || [];
  const fmt = valueFormat || fmtNumber;
  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? "treemap";

  const W = 600, H = height;

  // Non-negative weights (treemap areas can't be negative); total gates layout.
  const weights = rows.map((d) => Math.max(0, Number(d.value) || 0));
  const total = sum(weights);

  // Items carry their original index so color + table order stay stable no
  // matter how the squarify pass reorders them; sorted descending by weight,
  // which is what the algorithm assumes for a tight, low-aspect-ratio packing.
  const items =
    total > 0
      ? rows
          .map((d, i) => ({ i, w: weights[i] }))
          .sort((a, b) => b.w - a.w)
          .map((it) => ({ ...it, area: (it.w / total) * (W * H) }))
      : [];
  const tiles = squarify(items, { x: 0, y: 0, w: W, h: H });

  const g = Math.max(0, gap);

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--treemap ${className}`.trim()} data-hovering={hovered != null || undefined} {...rest}>
      {baseStyles}
      {styles}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId} preserveAspectRatio="none">
        {tiles.length === 0 ? (
          <text className="twc-chart__empty" x={W / 2} y={H / 2} textAnchor="middle" dominantBaseline="middle">No data</text>
        ) : (
          tiles.map((t) => {
            const d = rows[t.i];
            // Inset each tile by the gap so neighbours read as separate cells.
            const x = r(t.x + g / 2), y = r(t.y + g / 2);
            const w = r(Math.max(0, t.w - g)), h = r(Math.max(0, t.h - g));
            if (w <= 0 || h <= 0) return null;
            const color = d.color || paletteAt(colors, t.i);
            const label = labelText(d.label);
            // Only paint text when the tile is big enough to hold it legibly.
            const showText = w >= 40 && h >= 24;
            const showVal = showValues && h >= 42;
            const clipId = `${uid}-clip-${t.i}`;
            const share = total > 0 ? `${r((t.w / total) * 100)}%` : "0%";
            const tipItems = [{ color, label: fmt(t.w), value: share }];
            return (
              <g key={t.i}>
                <clipPath id={clipId}><rect x={x} y={y} width={w} height={h} rx="4" /></clipPath>
                <rect className="twc-chart__tile twc-chart__anim-fade" data-mark data-active={hovered === t.i || undefined}
                  x={x} y={y} width={w} height={h} rx="4" style={{ fill: color }}
                  onMouseMove={(e) => { setHovered(t.i); show({ title: label, items: tipItems }, e); }}
                  onMouseLeave={() => { setHovered(null); hide(); }} />
                {showText ? (
                  <g clipPath={`url(#${clipId})`} aria-hidden="true">
                    <text className="twc-chart__tile-label" x={x + 8} y={y + 17}>{label}</text>
                    {showVal ? <text className="twc-chart__tile-value" x={x + 8} y={y + 32}>{fmt(t.w)}</text> : null}
                  </g>
                ) : null}
              </g>
            );
          })
        )}
      </svg>

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={["value", "share"]}
          rows={rows.map((d, i) => ({
            label: d.label,
            values: [fmt(weights[i]), total > 0 ? `${r((weights[i] / total) * 100)}%` : "0%"],
          }))}
        />
      ) : null}
    </div>
  );
}

/**
 * Squarified treemap layout. Fills `rect` with tiles whose areas match each
 * item's `area` (their sum must equal `rect.w * rect.h`), greedily building rows
 * along the shorter side and only extending a row while doing so lowers the
 * row's worst (furthest-from-square) aspect ratio. Returns each input item with
 * `{ x, y, w, h }` added. Never divides by zero or throws on degenerate rects.
 */
function squarify(items, rect) {
  const out = [];
  if (rect.w <= 0 || rect.h <= 0) return out;
  let rem = items;
  let r0 = { ...rect };
  let start = 0;
  while (start < rem.length) {
    const short = Math.min(r0.w, r0.h);
    if (short <= 0) break;
    // Grow the row from `start` while the worst aspect ratio keeps improving.
    let rowSum = rem[start].area;
    let rowMin = rem[start].area, rowMax = rem[start].area;
    let count = 1;
    while (start + count < rem.length) {
      const a = rem[start + count].area;
      const nMin = Math.min(rowMin, a), nMax = Math.max(rowMax, a);
      const nSum = rowSum + a;
      if (worst(nMax, nMin, nSum, short) <= worst(rowMax, rowMin, rowSum, short)) {
        rowSum = nSum; rowMin = nMin; rowMax = nMax; count++;
      } else break;
    }
    // Lay the row across the shorter side, then shrink the free rectangle.
    if (r0.w >= r0.h) {
      const strip = rowSum / r0.h; // column on the left, `short` === r0.h
      let oy = r0.y;
      for (let k = 0; k < count; k++) {
        const it = rem[start + k];
        const th = rowSum > 0 ? (it.area / rowSum) * r0.h : 0;
        out.push({ ...it, x: r0.x, y: oy, w: strip, h: th });
        oy += th;
      }
      r0 = { x: r0.x + strip, y: r0.y, w: r0.w - strip, h: r0.h };
    } else {
      const strip = rowSum / r0.w; // row along the top, `short` === r0.w
      let ox = r0.x;
      for (let k = 0; k < count; k++) {
        const it = rem[start + k];
        const tw = rowSum > 0 ? (it.area / rowSum) * r0.w : 0;
        out.push({ ...it, x: ox, y: r0.y, w: tw, h: strip });
        ox += tw;
      }
      r0 = { x: r0.x, y: r0.y + strip, w: r0.w, h: r0.h - strip };
    }
    start += count;
  }
  return out;
}

/** Worst (largest) aspect ratio in a row of `[rmin..rmax]` areas summing to `s`, laid along a side of length `w`. */
function worst(rmax, rmin, s, w) {
  if (s <= 0 || w <= 0 || rmin <= 0) return Infinity;
  const w2 = w * w, s2 = s * s;
  return Math.max((w2 * rmax) / s2, s2 / (w2 * rmin));
}

function labelText(label) {
  return typeof label === "string" || typeof label === "number" ? String(label) : "";
}
