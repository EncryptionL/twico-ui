import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, niceScale, shortNum, fmtNumber, ChartTable,
  useChartTooltip, ChartTooltip,
} from "./_chart.js";

const CHART_CSS = `
.twc-boxplot__grid { stroke: var(--color-divider); stroke-width: 1; }
.twc-boxplot__axis { fill: var(--color-text-subtle); font-size: 11px; }
.twc-boxplot__whisker { stroke: var(--color-primary); stroke-width: 1.5; stroke-linecap: round; }
.twc-boxplot__box { fill: var(--color-primary); fill-opacity: 0.18; stroke: var(--color-primary); stroke-width: 1.5; transition: fill-opacity var(--duration-fast) var(--ease-standard); }
.twc-boxplot__box:hover { fill-opacity: 0.3; }
.twc-boxplot__median { stroke: var(--color-primary); stroke-width: 2.5; stroke-linecap: round; }
.twc-boxplot__outlier { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 1.5; }
`;

/**
 * Box-and-whisker chart — one box per category summarising a five-number
 * distribution (min, Q1, median, Q3, max) with whiskers and optional outlier
 * points, with click (`onDataClick`) + selection. Dependency-free inline SVG;
 * for bar/line/area use `Chart`.
 */
export function Boxplot({
  data,
  color = "var(--color-primary)",
  height = 300,
  showGrid = true,
  showAxis = true,
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
  const styles = useScopedStyles("twc-boxplot-styles", CHART_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [selected, setSelected] = React.useState(null);

  const rows = data || [];
  const fmt = valueFormat || fmtNumber;
  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? "box plot";
  const clickable = !!onDataClick;

  // Click a box: emit the five-number summary + index, and toggle its selection outline.
  const clickBox = (d, i) => {
    if (onDataClick) onDataClick({
      label: d.label,
      min: Number(d.min), q1: Number(d.q1), median: Number(d.median),
      q3: Number(d.q3), max: Number(d.max), index: i,
    });
    setSelected((s) => (s === i ? null : i));
  };

  // Shared tooltip: the five-number summary for the hovered category (top → bottom).
  const tipFor = (d) => ({
    title: labelText(d.label),
    items: [
      { color, label: "Max", value: fmt(Number(d.max)) },
      { label: "Q3", value: fmt(Number(d.q3)) },
      { label: "Median", value: fmt(Number(d.median)) },
      { label: "Q1", value: fmt(Number(d.q1)) },
      { label: "Min", value: fmt(Number(d.min)) },
    ],
  });

  const W = 600, H = height;
  const padL = showAxis ? 44 : 8;
  const padR = 10;
  const padT = 12;
  const padB = showAxis ? 26 : 8;
  const innerW = W - padL - padR, innerH = H - padT - padB;

  // Value scale spans every summary stat + outlier across all boxes, so the
  // whiskers and outlier dots always sit inside the plotted area.
  const allValues = rows.flatMap((d) => [
    Number(d.min), Number(d.q1), Number(d.median), Number(d.q3), Number(d.max),
    ...(Array.isArray(d.outliers) ? d.outliers.map(Number) : []),
  ].filter((v) => isFinite(v)));
  const dataMin = allValues.length ? Math.min(...allValues) : 0;
  const dataMax = allValues.length ? Math.max(...allValues) : 1;
  const scale = niceScale(dataMin, dataMax, 5);
  const span = scale.max - scale.min || 1; // niceScale guards min===max, but stay divide-safe

  // Map a value to its y pixel (top = scale.max, bottom = scale.min).
  const vPos = (v) => padT + innerH - ((Number(v) - scale.min) / span) * innerH;

  // Category band along the x axis; each box is centred in its band.
  const band = innerW / Math.max(1, rows.length);
  const bandX = (i) => padL + band * i;
  const boxW = Math.min(band * 0.5, 46);

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--boxplot ${className}`.trim()}
      data-clickable={clickable || undefined} {...rest}>
      {baseStyles}
      {styles}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId} preserveAspectRatio="none">
        {/* value grid + axis */}
        {showGrid ? scale.ticks.map((t, i) => {
          const p = vPos(t);
          return <line key={i} className="twc-boxplot__grid" x1={padL} y1={p} x2={W - padR} y2={p} />;
        }) : null}
        {showAxis ? scale.ticks.map((t, i) => {
          const p = vPos(t);
          return <text key={i} className="twc-boxplot__axis" x={padL - 8} y={p + 4} textAnchor="end">{shortNum(t)}</text>;
        }) : null}

        {/* one box + whisker per category */}
        {rows.map((d, i) => {
          const cx = bandX(i) + band / 2;
          const x = cx - boxW / 2;
          const yMin = vPos(d.min), yMax = vPos(d.max);
          const yQ1 = vPos(d.q1), yQ3 = vPos(d.q3), yMed = vPos(d.median);
          const boxTop = Math.min(yQ1, yQ3), boxBot = Math.max(yQ1, yQ3);
          const cap = boxW / 3; // half-width of the min/max whisker caps
          const hoverProps = {
            onMouseMove: (e) => show(tipFor(d), e),
            onMouseLeave: hide,
          };
          return (
            <g key={i} className="twc-chart__anim-fade" style={{ color }}>
              {/* whisker: min → max through the box, with end caps */}
              <line className="twc-boxplot__whisker" style={{ stroke: color }} x1={cx} y1={yMax} x2={cx} y2={boxTop} />
              <line className="twc-boxplot__whisker" style={{ stroke: color }} x1={cx} y1={boxBot} x2={cx} y2={yMin} />
              <line className="twc-boxplot__whisker" style={{ stroke: color }} x1={cx - cap} y1={yMax} x2={cx + cap} y2={yMax} />
              <line className="twc-boxplot__whisker" style={{ stroke: color }} x1={cx - cap} y1={yMin} x2={cx + cap} y2={yMin} />
              {/* interquartile box + median — the box is the click/selection target.
                  When selected, drop the inline stroke so the token selection outline
                  ([data-mark][data-selected] → stroke: var(--color-text)) can win. */}
              <rect className="twc-boxplot__box"
                data-mark data-selected={selected === i || undefined}
                style={selected === i ? { fill: color } : { fill: color, stroke: color }}
                x={x} y={boxTop} width={boxW} height={Math.max(1, boxBot - boxTop)} rx="2"
                {...hoverProps} onClick={() => clickBox(d, i)} />
              <line className="twc-boxplot__median" style={{ stroke: color }} x1={x} y1={yMed} x2={x + boxW} y2={yMed} />
              {/* outliers */}
              {(Array.isArray(d.outliers) ? d.outliers : []).map((o, oi) =>
                isFinite(Number(o)) ? (
                  <circle key={oi} className="twc-boxplot__outlier" style={{ stroke: color }} cx={cx} cy={vPos(o)} r="2.5" {...hoverProps} />
                ) : null,
              )}
            </g>
          );
        })}

        {/* category labels */}
        {showAxis ? rows.map((d, i) => (
          <text key={i} className="twc-boxplot__axis" x={bandX(i) + band / 2} y={H - 8} textAnchor="middle">{d.label}</text>
        )) : null}
      </svg>

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={["min", "q1", "median", "q3", "max"]}
          rows={rows.map((d) => ({
            label: d.label,
            values: [d.min, d.q1, d.median, d.q3, d.max].map((v) => fmt(Number(v))),
          }))}
        />
      ) : null}
    </div>
  );
}

function labelText(label) {
  return typeof label === "string" || typeof label === "number" ? String(label) : "";
}
