import React from "react";
import { useScopedStyles } from "../_styles.js";
import { CHART_BASE_CSS, r, polarDeg, paletteAt, ChartTable, ChartLegend, useChartTooltip, ChartTooltip } from "./_chart.js";

const GAUGE_CSS = `
.twc-gauge svg { overflow: visible; }
.twc-gauge__track { fill: none; }
.twc-gauge__arc { fill: none; stroke-linecap: round; transition: stroke-dashoffset var(--duration-slow) var(--ease-standard); }
.twc-gauge__value { fill: var(--color-text); font-weight: 700; }
.twc-gauge__label { fill: var(--color-text-subtle); }
.twc-gauge__arc[data-selected="true"] { filter: drop-shadow(0 0 2px var(--color-text)); }
`;

/**
 * Radial gauge / radial-bar — a single value as a thick arc sweeping between two
 * angles, with the value + an optional caption in the center. Pass `series` for
 * concentric radial bars (one ring per entry). Supports click (`onDataClick`) +
 * ring selection and legend hover-focus. Dependency-free inline SVG; every
 * color/size is a design token, so dark mode is automatic.
 */
export function Gauge({
  value = 0,
  min = 0,
  max = 100,
  startAngle = -110,
  endAngle = 110,
  thickness = 0.16,
  showValue = true,
  label,
  valueFormat,
  color = "var(--color-primary)",
  trackColor = "var(--color-surface-sunken)",
  size = 200,
  series,
  showLegend = true,
  onDataClick,
  ariaLabel,
  "aria-label": ariaLabelProp,
  tableFallback = true,
  caption,
  className = "",
  ...rest
}) {
  const baseStyles = useScopedStyles("twc-chart-base", CHART_BASE_CSS);
  const styles = useScopedStyles("twc-gauge-styles", GAUGE_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [selected, setSelected] = React.useState(null);
  const [focus, setFocus] = React.useState(null);

  const fmt = valueFormat || ((n) => String(Math.round(Number(n) || 0)));
  const cx = size / 2, cy = size / 2;
  const span = endAngle - startAngle; // total sweep (deg); may be negative

  // Fraction of the sweep filled for a value, clamped to the [min,max] domain.
  const frac = (v) => {
    const range = max - min;
    if (!range) return 0; // degenerate domain — never divide by zero
    return Math.max(0, Math.min(1, ((Number(v) || 0) - min) / range));
  };

  // Multiple concentric rings (radial-bar) — the single `value` is ignored.
  const isMulti = Array.isArray(series) && series.length > 0;
  const items = isMulti
    ? series
    : [{ value: Number(value) || 0, label, color }];

  // Ring geometry: each stroke is `strokeW` wide; concentric rings step inward
  // by one stroke plus a small gap, clamped so they never collapse past center.
  const rOuter = size / 2 - 2;
  const strokeW = Math.max(2, thickness * rOuter);
  const gap = strokeW * 0.5;
  const band = strokeW + gap;
  const ringRadius = (i) => Math.max(strokeW, rOuter - strokeW / 2 - i * band);

  // Open arc centerline path (rounded caps via CSS stroke-linecap).
  const arc = (radius, a0, a1) => {
    const [x0, y0] = polarDeg(cx, cy, radius, a0);
    const [x1, y1] = polarDeg(cx, cy, radius, a1);
    const sweepSpan = a1 - a0;
    const large = Math.abs(sweepSpan) > 180 ? 1 : 0;
    const sweep = sweepSpan >= 0 ? 1 : 0; // 1 = clockwise (matches polarDeg's direction)
    return `M${r(x0)} ${r(y0)} A${r(radius)} ${r(radius)} 0 ${large} ${sweep} ${r(x1)} ${r(y1)}`;
  };

  const single = items[0];

  // ---- interaction: click-to-select + legend hover-focus ----------------
  const clickable = !!onDataClick;
  const activeFor = (i) => (focus == null ? undefined : i === focus || undefined);
  const clickRing = (it, i) => {
    if (onDataClick) onDataClick({ value: Number(it.value) || 0, label: it.label, index: i });
  };
  const selectRing = (i) => setSelected((s) => (s === i ? null : i));

  const svgAriaLabel =
    ariaLabelProp ??
    ariaLabel ??
    (isMulti
      ? `Gauge with ${items.length} values`
      : `${labelText(label) || "Gauge"}: ${fmt(single.value)} of ${fmt(max)}`);

  const valueFont = Math.round(size * (isMulti ? 0.11 : 0.17));
  const labelFont = Math.round(size * 0.072);

  return (
    <div ref={containerRef} className={`twc-gauge twc-chart twc-chart--gauge ${className}`.trim()}
      data-multi={isMulti || undefined}
      data-hovering={focus != null || undefined}
      data-clickable={clickable || undefined}
      data-has-selection={selected != null || undefined}
      {...rest}>
      {baseStyles}
      {styles}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-label={svgAriaLabel}
        aria-describedby={tableId}
      >
        {items.map((it, i) => {
          const radius = ringRadius(i);
          const f = frac(it.value);
          const c = it.color || paletteAt(undefined, i);
          const valEnd = startAngle + f * span;
          return (
            <g key={i}>
              {/* full-sweep background track */}
              <path
                className="twc-gauge__track"
                d={arc(radius, startAngle, endAngle)}
                style={{ stroke: trackColor, strokeWidth: strokeW }}
              />
              {/* value arc — only when it has a positive sweep, so a 0 value draws nothing */}
              {f > 0 ? (
                <path
                  className="twc-gauge__arc twc-chart__anim-fade"
                  data-mark
                  data-active={activeFor(i)}
                  data-selected={selected === i || undefined}
                  d={arc(radius, startAngle, valEnd)}
                  style={{ stroke: c, strokeWidth: strokeW }}
                  onMouseMove={(e) => show({
                    title: labelText(it.label) || "Value",
                    items: [{ color: c, label: "", value: fmt(it.value) }],
                  }, e)}
                  onMouseLeave={hide}
                  onClick={() => { clickRing(it, i); selectRing(i); }}
                />
              ) : null}
            </g>
          );
        })}

        {/* center readout — single gauge only */}
        {!isMulti && showValue ? (
          <text className="twc-gauge__value" x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: valueFont }}>
            {fmt(single.value)}
          </text>
        ) : null}
        {!isMulti && label != null ? (
          <text className="twc-gauge__label" x={cx} y={cy + valueFont * 0.78} textAnchor="middle" style={{ fontSize: labelFont }}>
            {labelText(label)}
          </text>
        ) : null}
      </svg>

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={["Value"]}
          rows={items.map((it, i) => ({
            label: labelText(it.label) || (isMulti ? `Series ${i + 1}` : "Value"),
            values: [fmt(it.value)],
          }))}
        />
      ) : null}

      {isMulti && showLegend ? (
        <ChartLegend
          items={items.map((it, i) => ({
            label: labelText(it.label) || `Series ${i + 1}`,
            color: it.color || paletteAt(undefined, i),
          }))}
          onFocus={items.length > 1 ? (it, i) => setFocus(i) : undefined}
          onBlur={items.length > 1 ? () => setFocus(null) : undefined}
        />
      ) : null}
    </div>
  );
}

/** Coerce a ReactNode label to a plain string (only string/number render safely as text). */
function labelText(label) {
  return typeof label === "string" || typeof label === "number" ? String(label) : "";
}
