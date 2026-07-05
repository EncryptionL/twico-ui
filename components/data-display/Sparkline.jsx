import React from "react";
import { useScopedStyles } from "../_styles.js";
import { CHART_BASE_CSS, fmtNumber, linePath, areaPath, ChartTable, useChartTooltip, ChartTooltip } from "./_chart.js";

// A Sparkline is intentionally tiny and inline, so it overrides the chart
// family's full-width block layout: it renders at its intrinsic W×H, sits on the
// text baseline, and carries no axes/grid/legend — only a stroke, an optional
// fill, and (when asked) a single emphasised trailing dot.
const SPARK_CSS = `
.twc-sparkline { width: auto; display: inline-block; line-height: 0; vertical-align: middle; }
.twc-sparkline svg { width: auto; height: auto; }
.twc-sparkline__line { fill: none; stroke: var(--color-primary); stroke-linecap: round; stroke-linejoin: round; }
.twc-sparkline__area { stroke: none; fill: var(--color-primary); opacity: 0.16; }
.twc-sparkline__bar { fill: var(--color-primary); }
.twc-sparkline__dot { fill: var(--color-primary); }
.twc-sparkline .twc-chart__hit { fill: transparent; }
`;

/**
 * Sparkline — a minimal, word-sized trend chart (line, area, or bars) with no
 * axes, grid, ticks, or legend. Dependency-free inline SVG; scales to fill its
 * vertical space (domain derived from the data unless `min`/`max` pin it). Click
 * (`onDataClick`) selects the clicked point/bar. For a full chart with axes and a
 * legend use `Chart`.
 */
export function Sparkline({
  data,
  type = "line",
  area = false,
  color = "var(--color-primary)",
  width = 120,
  height = 40,
  strokeWidth = 2,
  curve = "smooth",
  showDots = false,
  min,
  max,
  valueFormat,
  onDataClick,
  ariaLabel,
  "aria-label": ariaLabelProp,
  tableFallback = false,
  caption,
  className = "",
  ...rest
}) {
  const baseStyles = useScopedStyles("twc-chart-base", CHART_BASE_CSS);
  const styles = useScopedStyles("twc-sparkline-styles", SPARK_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [hover, setHover] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const clickable = !!onDataClick;

  const kind = area ? "area" : type; // `area` prop is a shorthand for type="area"
  const isBar = kind === "bar";
  const isArea = kind === "area";
  const fmt = valueFormat || fmtNumber;

  // Normalize the loose input (bare numbers or `{ value, label }`) to parallel
  // number + label arrays; non-finite values collapse to 0 so we never NaN a path.
  const rowsIn = Array.isArray(data) ? data : [];
  const values = rowsIn.map((d) => {
    const v = typeof d === "number" ? d : Number(d && d.value);
    return Number.isFinite(v) ? v : 0;
  });
  const labels = rowsIn.map((d, i) =>
    typeof d === "number" ? i + 1 : d && d.label != null ? d.label : i + 1,
  );
  const n = values.length;

  // Geometry: pad enough that the stroke (and trailing dot) never clips the box.
  const W = width, H = height;
  const dotR = showDots ? Math.max(2, strokeWidth + 1) : 0;
  const pad = Math.max(strokeWidth / 2, dotR) + 1;
  const innerW = Math.max(1, W - pad * 2);
  const innerH = Math.max(1, H - pad * 2);

  // Value domain: pinned by `min`/`max` when given, else the data's own range.
  // A flat/degenerate range is widened by ±1 so every point lands mid-height
  // (ratio 0.5) instead of dividing by zero.
  const dMin = min != null ? min : n ? Math.min(...values) : 0;
  const dMax = max != null ? max : n ? Math.max(...values) : 1;
  let lo = dMin, hi = dMax;
  if (!(hi > lo)) { lo = lo - 1; hi = hi + 1; }
  const span = hi - lo;

  const x = (i) => (n <= 1 ? pad + innerW / 2 : pad + (innerW / (n - 1)) * i);
  const y = (v) => pad + innerH - ((v - lo) / span) * innerH;
  const baselineY = pad + innerH;
  const points = values.map((v, i) => [x(i), y(v)]);

  const crv = isBar ? "straight" : curve; // bars ignore interpolation
  const pathOpts = { smooth: crv === "smooth", step: crv === "stepped" ? "after" : null };

  // Per-point tooltip: the point's label (falls back to its 1-based index) and its
  // formatted value — a single unlabeled row, matching the sparkline's minimal look.
  const tipFor = (i) => ({ title: labels[i], items: [{ color, label: "", value: fmt(values[i]) }] });
  const onPointMove = (i) => (e) => { setHover(i); show(tipFor(i), e); };
  const onPointLeave = () => { setHover(null); hide(); };
  // Click a point/bar: emit the payload (if wired) and toggle its selection
  // outline; clicking the selected mark again clears it.
  const clickPoint = (i) => {
    if (onDataClick) onDataClick({ value: values[i], index: i, label: labels[i] });
    setSelected((s) => (s === i ? null : i));
  };

  // Summarizing aria-label. With no data table (the default), fold the salient
  // numbers — first/last/min/max — into the label so screen readers still get
  // the shape's gist; with a table present a terse "latest" line is enough.
  const last = n ? values[n - 1] : 0;
  const summary = !n
    ? "sparkline, no data"
    : tableFallback
      ? `sparkline, ${n} points, latest ${fmt(last)}`
      : `sparkline, ${n} points, first ${fmt(values[0])}, latest ${fmt(last)}, min ${fmt(Math.min(...values))}, max ${fmt(Math.max(...values))}`;
  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? summary;

  // ---- bars -------------------------------------------------------------
  const renderBars = () => {
    const band = innerW / Math.max(1, n);
    const slot = band * 0.7; // ~30% gap between thin bars
    return values.map((v, i) => {
      const h = ((v - lo) / span) * innerH;
      return (
        <rect
          key={i}
          className="twc-sparkline__bar twc-chart__anim-fade"
          data-mark
          data-selected={selected === i || undefined}
          style={{ fill: color }}
          x={pad + band * i + (band - slot) / 2}
          y={baselineY - h}
          width={Math.max(1, slot)}
          height={Math.max(1, h)}
          onMouseMove={(e) => show(tipFor(i), e)}
          onMouseLeave={hide}
          onClick={() => clickPoint(i)}
        />
      );
    });
  };

  return (
    <div ref={containerRef} className={`twc-chart twc-sparkline twc-chart--${kind} ${className}`.trim()}
      data-clickable={clickable || undefined} {...rest}>
      {baseStyles}
      {styles}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        role="img"
        aria-label={svgAriaLabel}
        aria-describedby={tableId}
      >
        {n === 0 ? null : isBar ? (
          renderBars()
        ) : (
          <>
            {isArea ? (
              <path className="twc-sparkline__area twc-chart__anim-fade" style={{ fill: color }} d={areaPath(points, baselineY, pathOpts)} />
            ) : null}
            <path
              className="twc-sparkline__line twc-chart__anim-line"
              style={{ stroke: color, strokeWidth }}
              pathLength="1"
              d={linePath(points, pathOpts)}
            />
            {showDots && n ? (
              <circle
                className="twc-sparkline__dot twc-chart__anim-fade"
                style={{ fill: color }}
                cx={points[n - 1][0]}
                cy={points[n - 1][1]}
                r={dotR}
              />
            ) : null}
            {/* Hover dot: emphasise the point under the pointer (matches the trailing dot's look). */}
            {hover != null ? (
              <circle
                className="twc-sparkline__dot"
                style={{ fill: color }}
                cx={points[hover][0]}
                cy={points[hover][1]}
                r={Math.max(2, strokeWidth + 1)}
              />
            ) : null}
            {/* Selection dot: the clicked point carries a data-selected outline. Non-interactive
                (pointer-events off) so the hit target beneath still handles clicks. */}
            {selected != null && points[selected] ? (
              <circle
                className="twc-sparkline__dot"
                data-mark
                data-selected="true"
                style={{ fill: color, pointerEvents: "none" }}
                cx={points[selected][0]}
                cy={points[selected][1]}
                r={Math.max(2, strokeWidth + 1)}
              />
            ) : null}
            {/* Invisible, generously sized hit targets so the tooltip is easy to trigger on tiny points. */}
            {points.map((p, i) => (
              <circle
                key={i}
                className="twc-chart__hit"
                cx={p[0]}
                cy={p[1]}
                r="14"
                onMouseMove={onPointMove(i)}
                onMouseLeave={onPointLeave}
                onClick={() => clickPoint(i)}
              />
            ))}
          </>
        )}
      </svg>

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={["value"]}
          rows={values.map((v, i) => ({ label: labels[i], values: [fmt(v)] }))}
        />
      ) : null}
    </div>
  );
}
