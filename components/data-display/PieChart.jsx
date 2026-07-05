import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, paletteAt, arcPath, polarDeg, sum, fmtNumber,
  ChartTable, ChartLegend, useChartTooltip, ChartTooltip,
} from "./_chart.js";

const CHART_CSS = `
.twc-chart--pie svg { overflow: visible; }
.twc-chart__slice { transition: opacity var(--duration-fast) var(--ease-standard); stroke: var(--color-surface); stroke-width: 1.5; }
.twc-chart__slice:hover { opacity: 0.85; }
.twc-chart__slice-label { fill: var(--color-surface); font-size: 11px; font-weight: 600; }
.twc-chart__center { fill: var(--color-text); font-weight: 700; }
.twc-chart__center-sub { fill: var(--color-text-subtle); }
.twc-chart__empty { fill: var(--color-text-subtle); font-size: var(--text-sm); }
`;

/**
 * Pie / donut chart — proportional slices of a whole from a single value series,
 * with a floating tooltip, click (`onDataClick`) + selection, and a legend whose
 * entries highlight their slice on hover. Dependency-free inline SVG; set `donut`
 * (or `innerRadius`) for a ring with an optional center label. For other shapes use
 * the dedicated sibling components.
 */
export function PieChart({
  data,
  donut = false,
  innerRadius,
  startAngle = 0,
  padAngle = 0,
  showLabels = false,
  showLegend = true,
  centerLabel,
  valueFormat,
  height = 260,
  colors,
  onDataClick,
  ariaLabel,
  "aria-label": ariaLabelProp,
  tableFallback = true,
  caption,
  className = "",
  ...rest
}) {
  const baseStyles = useScopedStyles("twc-chart-base", CHART_BASE_CSS);
  const styles = useScopedStyles("twc-piechart-styles", CHART_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [active, setActive] = React.useState(null); // slice hovered directly
  const [focus, setFocus] = React.useState(null); // slice focused via the legend
  const [selected, setSelected] = React.useState(null); // slice toggled by a click
  const clickable = !!onDataClick;

  const rows = data || [];
  const fmt = valueFormat || fmtNumber;
  // Only positive values contribute a slice (negatives can't be part of a whole).
  const values = rows.map((d) => Math.max(0, Number(d.value) || 0));
  const total = sum(values);

  // Geometry: a square viewBox sized to `height`, chart centered with a little breathing room.
  const H = height;
  const cx = H / 2, cy = H / 2;
  const rOuter = H / 2 - 8;
  const innerFrac = donut ? (innerRadius != null ? innerRadius : 0.6) : (innerRadius != null ? innerRadius : 0);
  const rInner = Math.max(0, Math.min(0.95, innerFrac)) * rOuter;
  const isDonut = rInner > 0;

  const svgAriaLabel =
    ariaLabelProp ?? ariaLabel ?? (isDonut ? "donut chart" : "pie chart");

  // Default donut center = formatted total.
  const center = centerLabel != null ? centerLabel : (isDonut ? fmt(total) : null);

  // Build slices, accumulating the clockwise sweep from `startAngle` (0 = top).
  let acc = startAngle;
  const slices = rows.map((d, i) => {
    const v = values[i];
    const frac = total > 0 ? v / total : 0;
    const span = frac * 360;
    const s0 = acc, s1 = acc + span;
    acc = s1;
    const pct = total > 0 ? Math.round(frac * 1000) / 10 : 0;
    const color = d.color || paletteAt(colors, i);
    return { d, i, v, frac, s0, s1, span, pct, color };
  });

  // ---- interaction handlers --------------------------------------------
  const clickDatum = (d, i, v, pct) => {
    if (!onDataClick) return;
    onDataClick({ label: d.label, value: v, index: i, percent: pct });
  };
  const selectMark = (i) => setSelected((s) => (s === i ? null : i));
  // Legend focus wins over direct hover; either one drives the shared dim.
  const emph = focus != null ? focus : active;
  const multi = rows.length > 1;

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--pie ${className}`.trim()} data-donut={isDonut ? "true" : undefined} data-has-selection={selected != null || undefined} data-hovering={emph != null ? "true" : undefined} data-clickable={clickable || undefined} {...rest}>
      {baseStyles}
      {styles}
      <svg viewBox={`0 0 ${H} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId}>
        {total <= 0 ? (
          <text className="twc-chart__empty" x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">No data</text>
        ) : (
          <>
            {slices.map(({ d, i, v, s0, s1, span, pct, color }) => {
              // Inset each slice by half the pad gap so equal gaps sit between neighbors.
              const pad = span > padAngle ? padAngle / 2 : 0;
              const items = [{ color, label: fmt(v), value: `${pct}%` }];
              // Explode: pop the selected slice outward along its mid-angle so it
              // reads as focused. The shared [data-mark] transform transition eases it.
              let explode;
              if (selected === i) {
                const mid = (s0 + s1) / 2;
                const a = ((mid - 90) * Math.PI) / 180;
                const dx = Math.cos(a) * 8, dy = Math.sin(a) * 8;
                if (Number.isFinite(dx) && Number.isFinite(dy)) {
                  explode = `translate(${dx}px, ${dy}px)`;
                }
              }
              return (
                <path
                  key={i}
                  className="twc-chart__slice twc-chart__anim-arc"
                  style={{ fill: color, transform: explode }}
                  data-mark=""
                  data-active={emph === i ? "true" : undefined}
                  data-selected={selected === i ? "true" : undefined}
                  d={arcPath(cx, cy, rOuter, rInner, s0 + pad, s1 - pad)}
                  onMouseMove={(e) => { setActive(i); show({ title: d.label, items }, e); }}
                  onMouseLeave={() => { setActive(null); hide(); }}
                  onClick={() => { clickDatum(d, i, v, pct); selectMark(i); }}
                />
              );
            })}

            {/* Percentage labels at each slice's mid-angle / mid-radius. */}
            {showLabels ? slices.map(({ i, span, s0, s1, pct }) => {
              if (span < 8) return null; // skip labels on hairline slices
              const mid = (s0 + s1) / 2;
              const rLabel = isDonut ? (rOuter + rInner) / 2 : rOuter * 0.62;
              const [lx, ly] = polarDeg(cx, cy, rLabel, mid);
              return (
                <text key={i} className="twc-chart__slice-label" x={lx} y={ly} textAnchor="middle" dominantBaseline="middle">
                  {`${pct}%`}
                </text>
              );
            }) : null}

            {/* Donut center content. */}
            {isDonut && center != null ? (
              <text className="twc-chart__center" x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize: "var(--text-lg)" }}>
                {center}
              </text>
            ) : null}
          </>
        )}
      </svg>

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={["value", "share"]}
          rows={slices.map(({ d, v, pct }) => ({ label: d.label, values: [fmt(v), `${pct}%`] }))}
        />
      ) : null}

      {showLegend && rows.length ? (
        <ChartLegend
          items={slices.map(({ d, color }) => ({ label: d.label, color }))}
          onFocus={multi ? (it, i) => setFocus(i) : undefined}
          onBlur={multi ? () => setFocus(null) : undefined}
        />
      ) : null}
    </div>
  );
}
