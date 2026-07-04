import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, niceScale, shortNum, fmtNumber, ChartTable,
} from "./_chart.js";

const CANDLE_CSS = `
.twc-candlestick__grid { stroke: var(--color-divider); stroke-width: 1; }
.twc-candlestick__axis { fill: var(--color-text-subtle); font-size: 11px; }
.twc-candlestick__wick { stroke-width: 1; }
.twc-candlestick__body { transition: opacity var(--duration-fast) var(--ease-standard); }
.twc-candlestick__body:hover { opacity: 0.82; }
`;

/**
 * Candlestick (OHLC) chart — one candle per period with a high→low wick and an
 * open→close body, colored green/red by direction. Dependency-free inline SVG;
 * shares the value axis, grid, tooltip and a11y-table conventions of the chart
 * family.
 */
export function Candlestick({
  data,
  upColor = "var(--color-success)",
  downColor = "var(--color-danger)",
  height = 300,
  showGrid = true,
  showAxis = true,
  valueFormat,
  ariaLabel,
  "aria-label": ariaLabelProp,
  tableFallback = true,
  caption,
  className = "",
  ...rest
}) {
  const baseStyles = useScopedStyles("twc-chart-base", CHART_BASE_CSS);
  const styles = useScopedStyles("twc-candlestick-styles", CANDLE_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;

  const rows = data || [];
  const fmt = valueFormat || fmtNumber;

  const W = 600, H = height;
  const padL = showAxis ? 44 : 8;
  const padR = 10;
  const padT = 12;
  const padB = showAxis ? 26 : 8;
  const innerW = W - padL - padR, innerH = H - padT - padB;

  // Value domain spans the full low→high range (candlesticks don't start at 0).
  const lows = rows.map((d) => Number(d.low)).filter(Number.isFinite);
  const highs = rows.map((d) => Number(d.high)).filter(Number.isFinite);
  const minLow = lows.length ? Math.min(...lows) : 0;
  const maxHigh = highs.length ? Math.max(...highs) : 1;
  const scale = niceScale(minLow, maxHigh, 5);
  const span = scale.max - scale.min || 1; // guarded: niceScale never returns 0 span

  // Map a value to its y pixel (top = high values).
  const vPos = (v) => padT + innerH - ((v - scale.min) / span) * innerH;
  // Category band + candle geometry along the x axis.
  const catBand = innerW / Math.max(1, rows.length);
  const cx = (i) => padL + catBand * i + catBand / 2;
  const bodyW = Math.max(1, Math.min(catBand * 0.7, 22));
  // Thin the x labels so they never collide (aim for ~12 across the axis).
  const labelStep = Math.max(1, Math.ceil(rows.length / 12));

  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? "candlestick chart";

  return (
    <div className={`twc-chart twc-chart--candlestick ${className}`.trim()} {...rest}>
      {baseStyles}
      {styles}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId} preserveAspectRatio="none">
        {/* value grid + axis */}
        {showGrid ? scale.ticks.map((t, i) => {
          const p = vPos(t);
          return <line key={i} className="twc-candlestick__grid" x1={padL} y1={p} x2={W - padR} y2={p} />;
        }) : null}
        {showAxis ? scale.ticks.map((t, i) => (
          <text key={i} className="twc-candlestick__axis" x={padL - 8} y={vPos(t) + 4} textAnchor="end">{shortNum(t)}</text>
        )) : null}

        {/* candles */}
        {rows.map((d, i) => {
          const open = Number(d.open) || 0;
          const high = Number(d.high) || 0;
          const low = Number(d.low) || 0;
          const close = Number(d.close) || 0;
          const up = close >= open;
          const color = up ? upColor : downColor;
          const x = cx(i);
          const yTop = vPos(Math.max(open, close));
          const yBot = vPos(Math.min(open, close));
          const bh = Math.max(1, yBot - yTop); // min 1px so a doji stays visible
          const title = `${labelText(d.label)}: O ${fmt(open)} H ${fmt(high)} L ${fmt(low)} C ${fmt(close)}`;
          return (
            <g key={i} data-dir={up ? "up" : "down"}>
              <line className="twc-candlestick__wick" style={{ stroke: color }}
                x1={x} y1={vPos(high)} x2={x} y2={vPos(low)}>
                <title>{title}</title>
              </line>
              <rect className="twc-candlestick__body" style={{ fill: color }}
                x={x - bodyW / 2} y={yTop} width={bodyW} height={bh} rx="1">
                <title>{title}</title>
              </rect>
            </g>
          );
        })}

        {/* category labels (thinned when dense) */}
        {showAxis ? rows.map((d, i) =>
          i % labelStep === 0
            ? <text key={i} className="twc-candlestick__axis" x={cx(i)} y={H - 8} textAnchor="middle">{d.label}</text>
            : null,
        ) : null}
      </svg>

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={["open", "high", "low", "close"]}
          rows={rows.map((d) => ({
            label: d.label,
            values: [Number(d.open) || 0, Number(d.high) || 0, Number(d.low) || 0, Number(d.close) || 0].map(fmt),
          }))}
        />
      ) : null}
    </div>
  );
}

function labelText(label) {
  return typeof label === "string" || typeof label === "number" ? String(label) : "";
}
