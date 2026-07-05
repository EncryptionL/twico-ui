import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, paletteAt, polygonPath, fmtNumber, ChartTable,
  useChartTooltip, ChartTooltip,
} from "./_chart.js";

const FUNNEL_CSS = `
.twc-chart--funnel svg { overflow: visible; }
.twc-funnel__label { fill: var(--color-text-inverted); font-family: var(--font-sans); pointer-events: none; }
.twc-funnel__name { font-size: 12px; font-weight: 600; }
.twc-funnel__value { font-size: 11px; fill-opacity: 0.82; }
`;

/**
 * Funnel chart — descending stages drawn as centered trapezoids that taper from
 * each stage's value to the next, ideal for conversion / drop-off flows. Each
 * band's width (vertical) or height (horizontal) is scaled to the largest stage.
 * Dependency-free inline SVG; for bars/lines use `Chart`, for shares use `PieChart`.
 * Clicking a stage fires `onDataClick` and toggles a selection outline.
 */
export function FunnelChart({
  data,
  showValues = true,
  showPercent = true,
  horizontal = false,
  gap = 2,
  height = 300,
  colors,
  valueFormat,
  onDataClick,
  ariaLabel,
  "aria-label": ariaLabelProp,
  tableFallback = true,
  caption,
  className = "",
  ...rest
}) {
  const baseStyles = useScopedStyles("twc-chart-base", CHART_BASE_CSS);
  const styles = useScopedStyles("twc-funnel-styles", FUNNEL_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [active, setActive] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const clickable = !!onDataClick;

  const rows = data || [];
  const n = rows.length;
  const fmt = valueFormat || fmtNumber;

  const W = 600, H = height;
  const pad = 8;
  const innerW = W - pad * 2, innerH = H - pad * 2;

  // Widths/heights scale to the largest stage; the top stage is the 100% baseline.
  const values = rows.map((d) => Number(d.value) || 0);
  const maxValue = Math.max(0, ...values);
  const denom = maxValue > 0 ? maxValue : 1; // never divide by zero on empty/degenerate data
  const top = values[0] || 0;
  const extent = (v) => (v / denom) * (horizontal ? innerH : innerW); // full span of a stage
  const pct = (v) => (top > 0 ? (v / top) * 100 : 0);
  const pctText = (v) => { const p = pct(v); return `${p % 1 ? p.toFixed(1) : p}%`; };

  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? "funnel chart";

  // One trapezoid per stage: it spans this stage's value at its leading edge and
  // the next stage's value at its trailing edge (last stage keeps its own width).
  const renderStages = () =>
    rows.map((d, i) => {
      const v = values[i];
      const nextV = i < n - 1 ? values[i + 1] : v;
      const lead = extent(v) / 2, trail = extent(nextV) / 2;
      const color = d.color || paletteAt(colors, i);

      let points, tx, ty;
      if (horizontal) {
        // Bands flow left→right; trapezoid tapers along the vertical (centered on cy).
        const bandW = innerW / Math.max(1, n);
        const x0 = pad + bandW * i + gap / 2;
        const x1 = pad + bandW * (i + 1) - gap / 2;
        const cy = H / 2;
        points = [[x0, cy - lead], [x1, cy - trail], [x1, cy + trail], [x0, cy + lead]];
        tx = (x0 + x1) / 2;
        ty = cy;
      } else {
        // Bands stack top→bottom; trapezoid tapers along the horizontal (centered on cx).
        const bandH = innerH / Math.max(1, n);
        const y0 = pad + bandH * i + gap / 2;
        const y1 = pad + bandH * (i + 1) - gap / 2;
        const cx = W / 2;
        points = [[cx - lead, y0], [cx + lead, y0], [cx + trail, y1], [cx - trail, y1]];
        tx = cx;
        ty = (y0 + y1) / 2;
      }

      // Centered caption: stage name on the first line, value/percent on the second.
      const valueLine = [showValues ? fmt(v) : null, showPercent ? pctText(v) : null]
        .filter(Boolean).join(" · ");
      const lines = [d.label, valueLine].filter((l) => l != null && l !== "");
      const firstDy = -((lines.length - 1) * 0.6);

      return (
        <g key={i} className="twc-funnel__stage twc-chart__anim-fade" style={{ animationDelay: `${i * 45}ms` }}>
          <path
            d={polygonPath(points)}
            fill={color}
            data-mark
            data-active={active === i ? "true" : undefined}
            data-selected={selected === i ? "true" : undefined}
            onMouseMove={(e) => {
              setActive(i);
              show({ title: d.label, items: [{ color, label: fmt(v), value: pctText(v) }] }, e);
            }}
            onMouseLeave={() => { setActive(null); hide(); }}
            onClick={onDataClick ? () => {
              onDataClick({ label: d.label, value: v, index: i, percent: pct(v) });
              setSelected((s) => (s === i ? null : i));
            } : undefined}
          />
          {lines.length ? (
            <text className="twc-funnel__label" x={tx} y={ty} textAnchor="middle" dominantBaseline="middle">
              {lines.map((line, li) => (
                <tspan
                  key={li}
                  x={tx}
                  dy={li === 0 ? `${firstDy}em` : "1.25em"}
                  className={li === 0 && lines.length > 1 ? "twc-funnel__name" : "twc-funnel__value"}
                >
                  {line}
                </tspan>
              ))}
            </text>
          ) : null}
        </g>
      );
    });

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--funnel ${className}`.trim()} data-orientation={horizontal ? "horizontal" : "vertical"} data-hovering={active != null ? "true" : undefined} data-clickable={clickable || undefined} {...rest}>
      {baseStyles}
      {styles}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId} preserveAspectRatio="none">
        {renderStages()}
      </svg>

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={["value", "% of top"]}
          rows={rows.map((d) => ({ label: d.label, values: [fmt(Number(d.value) || 0), pctText(Number(d.value) || 0)] }))}
        />
      ) : null}
    </div>
  );
}
