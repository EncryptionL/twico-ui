import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, CHART_PALETTE, paletteAt, niceScale, shortNum, fmtNumber,
  linePath, areaPath, ChartTable, ChartLegend,
} from "./_chart.js";

const CHART_CSS = `
.twc-chart__grid { stroke: var(--color-divider); stroke-width: 1; }
.twc-chart__axis { fill: var(--color-text-subtle); font-size: 11px; }
.twc-chart__bar { transition: opacity var(--duration-fast) var(--ease-standard); fill: var(--color-primary); }
.twc-chart__bar:hover { opacity: 0.82; }
.twc-chart__line { fill: none; stroke: var(--color-primary); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.twc-chart__area { stroke: none; opacity: 0.16; }
.twc-chart__dot { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 2.5; }
`;

/**
 * Cartesian chart — vertical/horizontal bars (grouped or stacked), line, and
 * area (straight / smooth / stepped), single or multi-series. Dependency-free
 * inline SVG; for pie/scatter/radar/heatmap/etc. use the dedicated components.
 */
export function Chart({
  type = "bar",
  data,
  series,
  height = 220,
  stacked = false,
  horizontal = false,
  curve = "straight",
  smooth = false,
  showDots = true,
  showGrid = true,
  showAxis = true,
  showLegend = false,
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
  const styles = useScopedStyles("twc-chart-styles", CHART_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;

  const isBar = type === "bar" || type === "column";
  const isArea = type === "area";
  const isLine = type === "line";
  const crv = smooth ? "smooth" : curve; // "straight" | "smooth" | "stepped"
  const pathOpts = { smooth: crv === "smooth", step: crv === "stepped" ? "after" : null };
  const canStack = stacked && (isBar || isArea);

  const keys = series && series.length ? series : ["value"];
  const rows = data || [];
  const fmt = valueFormat || fmtNumber;
  const multi = keys.length > 1;

  const W = 600, H = height;
  const padL = showAxis ? (horizontal ? 84 : 44) : 8;
  const padR = 10;
  const padT = 12;
  const padB = showAxis ? 26 : 8;
  const innerW = W - padL - padR, innerH = H - padT - padB;

  // Value scale: stacked charts scale to the largest per-category stack sum.
  const stackSum = (d) => keys.reduce((a, k) => a + (Number(d[k]) || 0), 0);
  const rawMax = canStack
    ? Math.max(0, ...rows.map(stackSum))
    : Math.max(0, ...rows.flatMap((d) => keys.map((k) => Number(d[k]) || 0)));
  const scale = niceScale(0, rawMax || 1, 4);
  const niceMax = scale.max || 1;
  const ticks = scale.ticks;

  // Coordinate mappers (value axis vs. category axis differ by orientation).
  const vPix = (v) => (v / niceMax) * (horizontal ? innerW : innerH);
  const vPos = (v) => (horizontal ? padL + vPix(v) : padT + innerH - vPix(v));
  const catBand = innerW / Math.max(1, rows.length); // used for bars along the category axis
  const catBandH = innerH / Math.max(1, rows.length);
  const lineX = (i) => padL + (innerW / Math.max(1, rows.length - 1)) * i;

  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? `${type} chart`;

  // ---- bars -------------------------------------------------------------
  const renderBars = () => {
    const band = horizontal ? catBandH : catBand;
    const gap = 0.28;
    const slot = band * (1 - gap);
    return rows.map((d, gi) => {
      const gStart = (horizontal ? padT : padL) + band * gi + (band * gap) / 2;
      if (canStack) {
        let acc = 0;
        return keys.map((k, si) => {
          const v = Number(d[k]) || 0;
          const p0 = vPix(acc), p1 = vPix(acc + v);
          acc += v;
          const color = paletteAt(colors, si);
          if (horizontal) {
            return (
              <rect key={`${gi}-${si}`} className="twc-chart__bar" style={{ fill: color }}
                x={padL + p0} y={gStart} width={Math.max(0, p1 - p0)} height={Math.max(1, slot)} rx="2">
                <title>{`${labelText(d.label)} · ${k}: ${fmt(v)}`}</title>
              </rect>
            );
          }
          return (
            <rect key={`${gi}-${si}`} className="twc-chart__bar" style={{ fill: color }}
              x={gStart} y={padT + innerH - p1} width={Math.max(1, slot)} height={Math.max(0, p1 - p0)} rx="2">
              <title>{`${labelText(d.label)} · ${k}: ${fmt(v)}`}</title>
            </rect>
          );
        });
      }
      const bw = slot / keys.length;
      return keys.map((k, si) => {
        const v = Number(d[k]) || 0;
        const len = vPix(v);
        const color = multi || (colors && colors.length) ? paletteAt(colors, si) : "var(--color-primary)";
        if (horizontal) {
          return (
            <rect key={`${gi}-${si}`} className="twc-chart__bar" style={{ fill: color }}
              x={padL} y={gStart + si * bw + 0.5} width={Math.max(0, len)} height={Math.max(1, bw - 1)} rx="2">
              <title>{`${labelText(d.label)}${multi ? " · " + k : ""}: ${fmt(v)}`}</title>
            </rect>
          );
        }
        return (
          <rect key={`${gi}-${si}`} className="twc-chart__bar" style={{ fill: color }}
            x={gStart + si * bw + 0.5} y={padT + innerH - len} width={Math.max(1, bw - 1)} height={Math.max(0, len)} rx="2">
            <title>{`${labelText(d.label)}${multi ? " · " + k : ""}: ${fmt(v)}`}</title>
          </rect>
        );
      });
    });
  };

  // ---- lines / areas ----------------------------------------------------
  const renderLines = () => {
    // Stacked areas accumulate on the value axis per category index.
    const stackAcc = canStack ? rows.map(() => 0) : null;
    return keys.map((k, si) => {
      const color = paletteAt(colors, si);
      const pts = rows.map((d, i) => {
        const v = Number(d[k]) || 0;
        const val = canStack ? (stackAcc[i] += v) : v;
        return [lineX(i), vPos(val)];
      });
      const base = canStack ? rows.map((d, i) => vPos(stackAcc[i] - (Number(d[k]) || 0))) : null;
      return (
        <g key={k}>
          {isArea ? (
            canStack
              ? <path className="twc-chart__area" style={{ fill: color, opacity: 0.22 }}
                  d={`${linePath(pts, pathOpts)} ${pts.map((p, i) => `L${p[0]} ${base[i]}`).reverse().join(" ")} Z`} />
              : <path className="twc-chart__area" style={{ fill: color }} d={areaPath(pts, padT + innerH, pathOpts)} />
          ) : null}
          <path className="twc-chart__line" style={{ stroke: color }} d={linePath(pts, pathOpts)} />
          {showDots && !isArea ? pts.map((p, i) => (
            <circle key={i} className="twc-chart__dot" style={{ stroke: color }} cx={p[0]} cy={p[1]} r="3.5">
              <title>{`${labelText(rows[i].label)}${multi ? " · " + k : ""}: ${fmt(Number(rows[i][k]) || 0)}`}</title>
            </circle>
          )) : null}
        </g>
      );
    });
  };

  return (
    <div className={`twc-chart twc-chart--${type} ${className}`.trim()} {...rest}>
      {baseStyles}
      {styles}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId} preserveAspectRatio="none">
        {/* value grid + axis */}
        {showGrid ? ticks.map((t, i) => {
          const p = vPos(t);
          return horizontal
            ? <line key={i} className="twc-chart__grid" x1={p} y1={padT} x2={p} y2={padT + innerH} />
            : <line key={i} className="twc-chart__grid" x1={padL} y1={p} x2={W - padR} y2={p} />;
        }) : null}
        {showAxis ? ticks.map((t, i) => {
          const p = vPos(t);
          return horizontal
            ? <text key={i} className="twc-chart__axis" x={p} y={H - 8} textAnchor="middle">{shortNum(t)}</text>
            : <text key={i} className="twc-chart__axis" x={padL - 8} y={p + 4} textAnchor="end">{shortNum(t)}</text>;
        }) : null}

        {isBar ? renderBars() : renderLines()}

        {/* category labels */}
        {showAxis ? rows.map((d, i) => {
          if (horizontal) {
            const cy = padT + catBandH * i + catBandH / 2;
            return <text key={i} className="twc-chart__axis" x={padL - 8} y={cy + 4} textAnchor="end">{d.label}</text>;
          }
          const cx = isBar ? padL + catBand * i + catBand / 2 : lineX(i);
          return <text key={i} className="twc-chart__axis" x={cx} y={H - 8} textAnchor="middle">{d.label}</text>;
        }) : null}
      </svg>

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={keys}
          rows={rows.map((d) => ({ label: d.label, values: keys.map((k) => fmt(Number(d[k]) || 0)) }))}
        />
      ) : null}

      {showLegend && multi ? (
        <ChartLegend items={keys.map((k, si) => ({ label: k, color: paletteAt(colors, si) }))} />
      ) : null}
    </div>
  );
}

function labelText(label) {
  return typeof label === "string" || typeof label === "number" ? String(label) : "";
}
