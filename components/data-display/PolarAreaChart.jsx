import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, paletteAt, niceCeil, shortNum, fmtNumber,
  polarDeg, arcPath, r, ChartTable, ChartLegend, useChartTooltip, ChartTooltip,
} from "./_chart.js";

const CHART_CSS = `
.twc-chart--polar svg { margin-inline: auto; }
.twc-chart__ring { fill: none; stroke: var(--color-divider); stroke-width: 1; }
.twc-chart__spoke { stroke: var(--color-divider); stroke-width: 1; opacity: 0.55; }
.twc-chart__slice { transition: opacity var(--duration-fast) var(--ease-standard); stroke: var(--color-surface); stroke-width: 1; }
.twc-chart__slice:hover { opacity: 0.85; }
.twc-chart__axis { fill: var(--color-text-subtle); font-size: 11px; }
`;

/**
 * Polar-area (Coxcomb / Nightingale rose) chart — equal-angle slices whose
 * *radius* encodes each value, over concentric value rings. Radius scales with
 * the square root of the value so a slice's **area** is proportional to its
 * value (the statistically honest encoding; pass a pre-scaled `max` for a plain
 * radial read). Dependency-free inline SVG.
 */
export function PolarAreaChart({
  data,
  max,
  levels = 4,
  startAngle = 0,
  showLegend = true,
  valueFormat,
  height = 280,
  colors,
  ariaLabel,
  "aria-label": ariaLabelProp,
  tableFallback = true,
  caption,
  className = "",
  ...rest
}) {
  const baseStyles = useScopedStyles("twc-chart-base", CHART_BASE_CSS);
  const styles = useScopedStyles("twc-polar-styles", CHART_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [active, setActive] = React.useState(null);

  const rows = data || [];
  const n = rows.length;
  const fmt = valueFormat || fmtNumber;

  // Square canvas so slices/rings stay circular under `xMidYMid meet`.
  const S = Math.max(80, height);
  const cx = S / 2, cy = S / 2;
  const Rmax = S / 2 - 18; // leave room for the top-edge value labels

  // Radial domain: default to a "nice" ceiling of the largest value. Guard a
  // zero/negative domain so we never divide by (or sqrt) something invalid.
  const dataMax = Math.max(0, ...rows.map((d) => Number(d.value) || 0));
  const domain = Math.max(1e-9, max != null ? max : niceCeil(dataMax) || 1);

  // Area-proportional radius: r ∝ √value. Values are clamped to [0, domain] so
  // negatives collapse to the center and over-max slices cap at the outer ring.
  const radiusFor = (v) => {
    const t = Math.min(1, Math.max(0, (Number(v) || 0) / domain));
    return Math.sqrt(t) * Rmax;
  };

  const rings = Math.max(1, Math.floor(levels));
  const anglePer = 360 / Math.max(1, n);
  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? "polar area chart";

  const labelText = (label) =>
    typeof label === "string" || typeof label === "number" ? String(label) : "";

  return (
    <div
      ref={containerRef}
      className={`twc-chart twc-chart--polar ${className}`.trim()}
      data-hovering={active != null || undefined}
      {...rest}
    >
      {baseStyles}
      {styles}
      <svg
        viewBox={`0 0 ${S} ${S}`}
        style={{ height }}
        role="img"
        aria-label={svgAriaLabel}
        aria-describedby={tableId}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* concentric value rings — each at the radius of an evenly-spaced value */}
        {Array.from({ length: rings }, (_, i) => {
          const value = (domain * (i + 1)) / rings;
          const rr = radiusFor(value);
          return <circle key={`ring-${i}`} className="twc-chart__ring" cx={cx} cy={cy} r={r(rr)} />;
        })}

        {/* radial spokes at every slice boundary */}
        {n > 1 ? rows.map((_, i) => {
          const [x, y] = polarDeg(cx, cy, Rmax, startAngle + i * anglePer);
          return <line key={`spoke-${i}`} className="twc-chart__spoke" x1={cx} y1={cy} x2={r(x)} y2={r(y)} />;
        }) : null}

        {/* value slices — equal angle, radius encodes the value */}
        {rows.map((d, i) => {
          const v = Number(d.value) || 0;
          const start = startAngle + i * anglePer;
          const color = d.color || paletteAt(colors, i);
          const tipFor = { title: labelText(d.label), items: [{ color, label: "", value: fmt(v) }] };
          return (
            <path
              key={`slice-${i}`}
              className="twc-chart__slice twc-chart__anim-arc"
              data-mark
              data-active={active === i || undefined}
              style={{ fill: color, fillOpacity: 0.82 }}
              d={arcPath(cx, cy, radiusFor(v), 0, start, start + anglePer)}
              onMouseMove={(e) => { setActive(i); show(tipFor, e); }}
              onMouseLeave={() => { setActive(null); hide(); }}
            />
          );
        })}

        {/* value tick labels along the top edge of each ring */}
        {Array.from({ length: rings }, (_, i) => {
          const value = (domain * (i + 1)) / rings;
          const rr = radiusFor(value);
          return (
            <text key={`tick-${i}`} className="twc-chart__axis" x={cx} y={r(cy - rr - 3)} textAnchor="middle">
              {shortNum(value)}
            </text>
          );
        })}
      </svg>

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={["value"]}
          rows={rows.map((d) => ({ label: d.label, values: [fmt(Number(d.value) || 0)] }))}
        />
      ) : null}

      {showLegend && n ? (
        <ChartLegend items={rows.map((d, i) => ({ label: d.label, color: d.color || paletteAt(colors, i) }))} />
      ) : null}
    </div>
  );
}
