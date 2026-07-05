import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, paletteAt, polygonPath, polarDeg, niceCeil, fmtNumber,
  ChartTable, ChartLegend, useChartTooltip, ChartTooltip,
} from "./_chart.js";

const CHART_CSS = `
.twc-chart--radar svg { overflow: visible; }
.twc-chart__ring { fill: none; stroke: var(--color-divider); stroke-width: 1; }
.twc-chart__spoke { stroke: var(--color-divider); stroke-width: 1; }
.twc-chart__radar-axis { fill: var(--color-text-subtle); font-size: 11px; }
.twc-chart__radar-area { transition: opacity var(--duration-fast) var(--ease-standard); }
.twc-chart__radar-area:hover { opacity: 0.9; }
.twc-chart__radar-line { fill: none; stroke-width: 2; stroke-linejoin: round; }
.twc-chart__radar-dot { stroke: var(--color-surface); stroke-width: 1.5; transition: r var(--duration-fast) var(--ease-standard); }
.twc-chart__hit { fill: transparent; }
.twc-chart__hit:hover + .twc-chart__radar-dot { r: 5; }
.twc-chart__empty { fill: var(--color-text-subtle); font-size: var(--text-sm); }
`;

/**
 * Radar / spider chart — one or more series plotted as closed polygons over a
 * shared set of categorical axes radiating from a center, with a floating tooltip,
 * vertex click (`onDataClick`) + selection, and a hoverable legend that focuses its
 * series and dims the rest. Dependency-free inline SVG; good for comparing a handful
 * of multi-attribute profiles. For other shapes use the dedicated sibling components.
 */
export function RadarChart({
  data,
  series,
  max,
  levels = 4,
  fill = true,
  showLegend,
  showDots = true,
  colors,
  valueFormat,
  height = 300,
  onDataClick,
  ariaLabel,
  "aria-label": ariaLabelProp,
  tableFallback = true,
  caption,
  className = "",
  ...rest
}) {
  const baseStyles = useScopedStyles("twc-chart-base", CHART_BASE_CSS);
  const styles = useScopedStyles("twc-radarchart-styles", CHART_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [focus, setFocus] = React.useState(null); // hovered legend series key
  const [selected, setSelected] = React.useState(null); // "<axisIdx>:<seriesKey>"

  const rows = data || [];
  const keys = series && series.length ? series : ["value"];
  const fmt = valueFormat || fmtNumber;
  const multi = keys.length > 1;
  const clickable = !!onDataClick;
  // Legend defaults on for multi-series, off for a single polygon.
  const legend = showLegend != null ? showLegend : multi;
  // Legend-focus emphasis: active when nothing focused, or this is the hovered series.
  const focusActive = (k) => (focus == null ? undefined : k === focus || undefined);
  const selectMark = (key) => setSelected((s) => (s === key ? null : key));

  // Square viewBox sized to `height`; the radar sits centered with a margin that
  // leaves room for the axis labels sitting just outside the outermost ring.
  const H = height;
  const cx = H / 2, cy = H / 2;
  const R = Math.max(0, H / 2 - 40);
  const n = rows.length;

  // Radial max: the outer ring's value. Defaults to a "nice" ceiling of the
  // largest datum across every series (guarded to stay positive).
  const rawMax = Math.max(0, ...rows.flatMap((d) => keys.map((k) => Number(d[k]) || 0)));
  const radialMax = (max != null ? max : niceCeil(rawMax)) || 1;
  const rings = Math.max(1, Math.floor(levels));

  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? "radar chart";

  // Angle (deg, clockwise from 12 o'clock) of axis `i`.
  const angleOf = (i) => (i / Math.max(1, n)) * 360;
  // Vertex for value `v` on axis `i`: radius scaled by the value's share of max.
  const vertex = (v, i) => {
    const frac = Math.max(0, Math.min(1, (Number(v) || 0) / radialMax));
    return polarDeg(cx, cy, frac * R, angleOf(i));
  };

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--radar ${className}`.trim()}
      data-hovering={focus != null || undefined} data-clickable={clickable || undefined}
      data-has-selection={selected != null || undefined} {...rest}>
      {baseStyles}
      {styles}
      <svg
        viewBox={`0 0 ${H} ${H}`}
        role="img"
        aria-label={svgAriaLabel}
        aria-describedby={tableId}
        style={{ maxWidth: H, margin: "0 auto" }}
      >
        {n === 0 ? (
          <text className="twc-chart__empty" x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">No data</text>
        ) : (
          <>
            {/* Concentric grid rings, from outer to inner. */}
            {Array.from({ length: rings }, (_, li) => {
              const rr = (R * (li + 1)) / rings;
              const pts = rows.map((_, i) => polarDeg(cx, cy, rr, angleOf(i)));
              return <path key={li} className="twc-chart__ring" d={polygonPath(pts)} />;
            })}

            {/* Spokes + axis labels, one per category. */}
            {rows.map((d, i) => {
              const [ex, ey] = polarDeg(cx, cy, R, angleOf(i));
              const [lx, ly] = polarDeg(cx, cy, R + 16, angleOf(i));
              // Anchor the label away from the center so it never overlaps the ring.
              const anchor = lx > cx + 1 ? "start" : lx < cx - 1 ? "end" : "middle";
              return (
                <g key={i}>
                  <line className="twc-chart__spoke" x1={cx} y1={cy} x2={ex} y2={ey} />
                  <text className="twc-chart__radar-axis" x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle">
                    {d.label}
                  </text>
                </g>
              );
            })}

            {/* One polygon per series (drawn back-to-front so earlier series stay legible). */}
            {keys.map((k, si) => {
              const color = paletteAt(colors, si);
              const pts = rows.map((d, i) => vertex(d[k], i));
              return (
                <g key={k} data-mark data-active={focusActive(k)}>
                  {fill ? (
                    <path className="twc-chart__radar-area twc-chart__anim-fade" style={{ fill: color, opacity: 0.18 }} d={polygonPath(pts)} />
                  ) : null}
                  <path className="twc-chart__radar-line twc-chart__anim-fade" style={{ stroke: color }} d={polygonPath(pts)} />
                  {showDots ? pts.map((p, i) => {
                    const key = `${i}:${k}`;
                    return (
                      <g key={i} className="twc-chart__anim-fade">
                        <circle className="twc-chart__hit" cx={p[0]} cy={p[1]} r="14"
                          onMouseMove={(e) => show({ title: rows[i].label, items: [{ color, label: k, value: fmt(Number(rows[i][k]) || 0) }] }, e)}
                          onMouseLeave={hide}
                          onClick={() => {
                            if (onDataClick) onDataClick({ label: rows[i].label, series: k, value: Number(rows[i][k]) || 0, index: i });
                            selectMark(key);
                          }} />
                        <circle className="twc-chart__radar-dot" style={{ fill: color }} cx={p[0]} cy={p[1]} r="3"
                          data-mark data-active={focusActive(k)} data-selected={selected === key || undefined} />
                      </g>
                    );
                  }) : null}
                </g>
              );
            })}
          </>
        )}
      </svg>

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={keys}
          rows={rows.map((d) => ({ label: d.label, values: keys.map((k) => fmt(Number(d[k]) || 0)) }))}
        />
      ) : null}

      {legend && multi ? (
        <ChartLegend
          items={keys.map((k, si) => ({ label: k, color: paletteAt(colors, si) }))}
          onFocus={(it) => setFocus(it.label)}
          onBlur={() => setFocus(null)}
        />
      ) : null}
    </div>
  );
}
