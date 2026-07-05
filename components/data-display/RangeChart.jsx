import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, paletteAt, niceScale, shortNum, fmtNumber, r, linePath, ChartTable,
  useChartTooltip, ChartTooltip,
} from "./_chart.js";

const RANGE_CSS = `
.twc-chart--range .twc-rangechart__grid { stroke: var(--color-divider); stroke-width: 1; }
.twc-chart--range .twc-rangechart__axis { fill: var(--color-text-subtle); font-size: 11px; }
.twc-chart--range .twc-rangechart__bar { transition: opacity var(--duration-fast) var(--ease-standard); }
.twc-chart--range .twc-rangechart__bar:hover { opacity: 0.82; }
.twc-chart--range .twc-rangechart__band { transition: opacity var(--duration-fast) var(--ease-standard); opacity: 0.18; }
.twc-chart--range .twc-rangechart__band:hover { opacity: 0.26; }
.twc-chart--range .twc-rangechart__edge { fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
`;

/**
 * Range chart — either horizontal range bars (a timeline / Gantt: one min→max
 * band per row) or a range area (a shaded band between a per-category min line
 * and max line). Covers rangeBar + rangeArea. Dependency-free inline SVG; shares
 * the value axis, grid, tooltip and a11y-table conventions of the chart family.
 */
export function RangeChart({
  type = "bar",
  data,
  height = 300,
  showGrid = true,
  showAxis = true,
  colors,
  valueFormat,
  ariaLabel,
  "aria-label": ariaLabelProp,
  tableFallback = true,
  caption,
  className = "",
  ...rest
}) {
  const baseStyles = useScopedStyles("twc-chart-base", CHART_BASE_CSS);
  const styles = useScopedStyles("twc-rangechart-styles", RANGE_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();

  const isArea = type === "area";
  const rows = data || [];
  const n = rows.length;
  const fmt = valueFormat || fmtNumber;

  const W = 600, H = height;
  // Bars need a wide left gutter for category labels; the area only needs room
  // for the value axis on the left and category labels on the bottom.
  const padL = showAxis ? (isArea ? 44 : 84) : 8;
  const padR = 12;
  const padT = 12;
  const padB = showAxis ? 26 : 8;
  const innerW = W - padL - padR, innerH = H - padT - padB;

  // Value domain spans every min and max (ranges rarely start at 0, so the
  // scale is not anchored there). niceScale guards min===max and empty input.
  const vals = rows.flatMap((d) => [Number(d.min), Number(d.max)]).filter(Number.isFinite);
  const lo = vals.length ? Math.min(...vals) : 0;
  const hi = vals.length ? Math.max(...vals) : 1;
  const scale = niceScale(lo, hi, 5);
  const span = scale.max - scale.min || 1; // guarded: niceScale never returns 0 span
  const frac = (v) => (v - scale.min) / span;

  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? `range ${type} chart`;

  // ---- bar (horizontal timeline / Gantt) --------------------------------
  const xPos = (v) => padL + frac(v) * innerW; // value axis runs left→right
  const catBandH = innerH / Math.max(1, n);
  const renderBars = () => {
    const gap = 0.34;
    const slot = catBandH * (1 - gap);
    return rows.map((d, i) => {
      const min = Number(d.min) || 0, max = Number(d.max) || 0;
      // Negative-safe: draw from the smaller to the larger endpoint.
      const x0 = xPos(Math.min(min, max));
      const x1 = xPos(Math.max(min, max));
      const y = padT + catBandH * i + (catBandH * gap) / 2;
      const color = d.color || paletteAt(colors, i);
      return (
        <rect key={i} className="twc-rangechart__bar twc-chart__anim-bar" data-horizontal="true" style={{ fill: color }}
          x={x0} y={y} width={Math.max(1, x1 - x0)} height={Math.max(1, slot)} rx="3"
          onMouseMove={(e) => show({ title: labelText(d.label), items: [{ color, label: "", value: `${fmt(min)} – ${fmt(max)}` }] }, e)}
          onMouseLeave={hide} />
      );
    });
  };

  // ---- area (range band across categories) ------------------------------
  const lineX = (i) => (n > 1 ? padL + (innerW / (n - 1)) * i : padL + innerW / 2);
  const yPos = (v) => padT + innerH - frac(v) * innerH; // top = high values
  const renderBand = () => {
    const maxPts = rows.map((d, i) => [lineX(i), yPos(Number(d.max) || 0)]);
    const minPts = rows.map((d, i) => [lineX(i), yPos(Number(d.min) || 0)]);
    // Closed band: the max line forward, then the min line reversed, then Z.
    const rev = [...minPts].reverse().map((p) => `L${r(p[0])} ${r(p[1])}`).join(" ");
    const bandD = `${linePath(maxPts)} ${rev} Z`;
    const color = paletteAt(colors, 0);
    const hitW = n > 1 ? innerW / (n - 1) : innerW;
    return (
      <g>
        <path className="twc-rangechart__band twc-chart__anim-fade" style={{ fill: color }} d={bandD} />
        <path className="twc-rangechart__edge" style={{ stroke: color }} d={linePath(maxPts)} />
        <path className="twc-rangechart__edge" style={{ stroke: color }} d={linePath(minPts)} />
        {/* invisible per-category hit columns carry the range tooltips */}
        {rows.map((d, i) => (
          <rect key={i} fill="transparent" x={lineX(i) - hitW / 2} y={padT} width={hitW} height={innerH}
            onMouseMove={(e) => show({ title: labelText(d.label), items: [{ color, label: "", value: `${fmt(Number(d.min) || 0)} – ${fmt(Number(d.max) || 0)}` }] }, e)}
            onMouseLeave={hide} />
        ))}
      </g>
    );
  };

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--range ${className}`.trim()} data-type={type} {...rest}>
      {baseStyles}
      {styles}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId} preserveAspectRatio="none">
        {/* value grid (vertical for bars, horizontal for the area) */}
        {showGrid ? scale.ticks.map((t, i) =>
          isArea
            ? <line key={i} className="twc-rangechart__grid" x1={padL} y1={yPos(t)} x2={W - padR} y2={yPos(t)} />
            : <line key={i} className="twc-rangechart__grid" x1={xPos(t)} y1={padT} x2={xPos(t)} y2={padT + innerH} />,
        ) : null}
        {/* value axis labels */}
        {showAxis ? scale.ticks.map((t, i) =>
          isArea
            ? <text key={i} className="twc-rangechart__axis" x={padL - 8} y={yPos(t) + 4} textAnchor="end">{shortNum(t)}</text>
            : <text key={i} className="twc-rangechart__axis" x={xPos(t)} y={H - 8} textAnchor="middle">{shortNum(t)}</text>,
        ) : null}

        {isArea ? renderBand() : renderBars()}

        {/* category labels (left for bars, bottom for the area) */}
        {showAxis ? rows.map((d, i) =>
          isArea
            ? <text key={i} className="twc-rangechart__axis" x={lineX(i)} y={H - 8} textAnchor="middle">{d.label}</text>
            : <text key={i} className="twc-rangechart__axis" x={padL - 8} y={padT + catBandH * i + catBandH / 2 + 4} textAnchor="end">{d.label}</text>,
        ) : null}
      </svg>

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={["min", "max"]}
          rows={rows.map((d) => ({ label: d.label, values: [fmt(Number(d.min) || 0), fmt(Number(d.max) || 0)] }))}
        />
      ) : null}
    </div>
  );
}

function labelText(label) {
  return typeof label === "string" || typeof label === "number" ? String(label) : "";
}
