import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, paletteAt, niceScale, shortNum, fmtNumber, ChartTable, ChartLegend,
  useChartTooltip, ChartTooltip,
} from "./_chart.js";

const SCATTER_CSS = `
.twc-chart--scatter__grid { stroke: var(--color-divider); stroke-width: 1; }
.twc-chart--scatter__axis { fill: var(--color-text-subtle); font-size: 11px; }
.twc-chart--scatter__title { fill: var(--color-text-muted); font-size: 11px; font-weight: 500; }
.twc-chart--scatter__dot { transform-box: fill-box; transform-origin: center; transition: transform var(--duration-fast) var(--ease-standard), opacity var(--duration-fast) var(--ease-standard); stroke: var(--color-surface); stroke-width: 1; }
.twc-chart--scatter__dot[data-bubble="true"] { fill-opacity: 0.55; }
.twc-chart__hit { fill: transparent; }
.twc-chart__hit:hover + .twc-chart--scatter__dot { transform: scale(1.18); }
`;

/**
 * Scatter / bubble chart — plots x/y points across two nice-scaled numeric axes,
 * one or many series. Pass a per-point `z` (or `bubble`) to size the dots by a
 * third dimension (a bubble chart). Dependency-free inline SVG; shares the grid,
 * tooltip, legend and a11y-table conventions of the chart family. Unlike the
 * stretched cartesian charts this keeps the SVG aspect ratio (default
 * `preserveAspectRatio`) so the dots stay round.
 */
export function ScatterChart({
  series,
  bubble = false,
  maxBubble = 26,
  dotRadius = 4.5,
  height = 300,
  xLabel,
  yLabel,
  showGrid = true,
  showLegend,
  xFormat,
  yFormat,
  valueFormat,
  ariaLabel,
  "aria-label": ariaLabelProp,
  tableFallback = true,
  caption,
  className = "",
  ...rest
}) {
  const baseStyles = useScopedStyles("twc-chart-base", CHART_BASE_CSS);
  const styles = useScopedStyles("twc-scatter-styles", SCATTER_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();

  const list = Array.isArray(series) ? series : [];
  const vFmt = valueFormat || fmtNumber;
  const xFmt = xFormat || vFmt;
  const yFmt = yFormat || vFmt;

  // Flatten every finite point (tagged with its series index) for scaling + z detection.
  const all = list.flatMap((s, si) =>
    (s && Array.isArray(s.points) ? s.points : [])
      .filter((p) => p && Number.isFinite(Number(p.x)) && Number.isFinite(Number(p.y)))
      .map((p) => ({ si, x: Number(p.x), y: Number(p.y), z: p.z, label: p.label })),
  );

  // Bubble mode turns on explicitly, or automatically when any point carries a numeric z.
  const hasZ = all.some((p) => Number.isFinite(Number(p.z)));
  const useBubble = bubble || hasZ;
  const zMax = useBubble ? Math.max(0, ...all.map((p) => Number(p.z) || 0)) : 0;
  // Bubble area ∝ z, so radius ∝ √z; falls back to dotRadius when z is missing/≤0.
  const dotR = (z) => {
    if (!useBubble) return dotRadius;
    const zv = Number(z);
    if (!Number.isFinite(zv) || zv <= 0 || !(zMax > 0)) return Math.max(2, dotRadius);
    return Math.max(2, Math.sqrt(zv / zMax) * maxBubble);
  };

  // Nice-scaled domains; niceScale guards min===max (single/identical points) and empty data.
  const xs = all.map((p) => p.x), ys = all.map((p) => p.y);
  const xScale = niceScale(Math.min(...xs), Math.max(...xs), 5);
  const yScale = niceScale(Math.min(...ys), Math.max(...ys), 5);
  const xSpan = xScale.max - xScale.min || 1; // guarded: niceScale never returns 0 span
  const ySpan = yScale.max - yScale.min || 1;

  const W = 600, H = height;
  const padL = 46 + (yLabel != null ? 16 : 0);
  const padR = 14;
  const padT = 14;
  const padB = 28 + (xLabel != null ? 18 : 0);
  const innerW = W - padL - padR, innerH = H - padT - padB;

  // Data → pixel mappers.
  const xPos = (x) => padL + ((x - xScale.min) / xSpan) * innerW;
  const yPos = (y) => padT + innerH - ((y - yScale.min) / ySpan) * innerH;

  const seriesColor = (s, i) => (s && s.color) || paletteAt(undefined, i);
  const seriesName = (s, i) => (s && s.name) || `Series ${i + 1}`;
  const legend = showLegend ?? list.length > 1;
  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? `${useBubble ? "bubble" : "scatter"} chart`;

  // Draw larger bubbles first so smaller dots stay clickable/visible on top.
  const dots = all
    .map((p) => ({ ...p, radius: dotR(p.z), fill: seriesColor(list[p.si], p.si) }))
    .sort((a, b) => b.radius - a.radius);

  const tipLabel = (p) => labelText(p.label) || seriesName(list[p.si], p.si);
  const tableColumns = hasZ ? ["x", "y", "z"] : ["x", "y"];

  // Per-point tooltip: series/point title + the point's x/y (and z when present).
  const tipFor = (p) => ({
    title: tipLabel(p),
    items: [
      { color: p.fill, label: "x", value: xFmt(p.x) },
      { label: "y", value: yFmt(p.y) },
      ...(Number.isFinite(Number(p.z)) ? [{ label: "z", value: vFmt(Number(p.z)) }] : []),
    ],
  });

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--scatter ${className}`.trim()} data-bubble={useBubble || undefined} {...rest}>
      {baseStyles}
      {styles}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId}>
        {/* grid + y (value) axis */}
        {showGrid ? yScale.ticks.map((t, i) => {
          const p = yPos(t);
          return <line key={`y${i}`} className="twc-chart--scatter__grid" x1={padL} y1={p} x2={W - padR} y2={p} />;
        }) : null}
        {showGrid ? xScale.ticks.map((t, i) => {
          const p = xPos(t);
          return <line key={`x${i}`} className="twc-chart--scatter__grid" x1={p} y1={padT} x2={p} y2={padT + innerH} />;
        }) : null}

        {/* axis tick labels */}
        {yScale.ticks.map((t, i) => (
          <text key={`yt${i}`} className="twc-chart--scatter__axis" x={padL - 8} y={yPos(t) + 4} textAnchor="end">{shortNum(t)}</text>
        ))}
        {xScale.ticks.map((t, i) => (
          <text key={`xt${i}`} className="twc-chart--scatter__axis" x={xPos(t)} y={padT + innerH + 16} textAnchor="middle">{shortNum(t)}</text>
        ))}

        {/* axis titles */}
        {xLabel != null ? (
          <text className="twc-chart--scatter__title" x={padL + innerW / 2} y={H - 6} textAnchor="middle">{xLabel}</text>
        ) : null}
        {yLabel != null ? (
          <text className="twc-chart--scatter__title" x={16} y={padT + innerH / 2} textAnchor="middle"
            transform={`rotate(-90 16 ${padT + innerH / 2})`}>{yLabel}</text>
        ) : null}

        {/* points */}
        {dots.map((p, i) => (
          <g key={i} className="twc-chart__anim-fade">
            <circle className="twc-chart__hit" cx={xPos(p.x)} cy={yPos(p.y)} r={Math.max(14, p.radius)}
              onMouseMove={(e) => show(tipFor(p), e)} onMouseLeave={hide} />
            <circle className="twc-chart--scatter__dot" data-bubble={useBubble || undefined}
              style={{ fill: p.fill }} cx={xPos(p.x)} cy={yPos(p.y)} r={p.radius} />
          </g>
        ))}
      </svg>

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={tableColumns}
          rows={all.map((p) => ({
            label: seriesName(list[p.si], p.si),
            values: hasZ
              ? [xFmt(p.x), yFmt(p.y), Number.isFinite(Number(p.z)) ? vFmt(Number(p.z)) : ""]
              : [xFmt(p.x), yFmt(p.y)],
          }))}
        />
      ) : null}

      {legend && list.length ? (
        <ChartLegend items={list.map((s, i) => ({ label: seriesName(s, i), color: seriesColor(s, i) }))} />
      ) : null}
    </div>
  );
}

function labelText(label) {
  return typeof label === "string" || typeof label === "number" ? String(label) : "";
}
