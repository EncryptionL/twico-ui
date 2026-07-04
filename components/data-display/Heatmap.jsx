import React from "react";
import { useScopedStyles } from "../_styles.js";
import { CHART_BASE_CSS, fmtNumber, ChartTable } from "./_chart.js";

const HEATMAP_CSS = `
.twc-chart--heatmap svg { overflow: visible; }
.twc-chart__hm-cell { transition: opacity var(--duration-fast) var(--ease-standard); }
.twc-chart__hm-cell:hover { opacity: 0.82; }
.twc-chart__hm-empty { fill: var(--color-surface-sunken); }
.twc-chart__hm-val { fill: var(--color-text); font-size: 10px; font-weight: 500; pointer-events: none; }
.twc-chart__hm-tick { fill: var(--color-text-subtle); font-size: 11px; }
.twc-chart__hm-title { fill: var(--color-text-muted); font-size: 11px; font-weight: 500; }
.twc-chart__hm-scale { display: flex; align-items: center; gap: var(--space-2); margin-top: var(--space-3); font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-chart__hm-bar { flex: none; width: 96px; height: 10px; border-radius: var(--radius-sm); border: 1px solid var(--color-divider); }
`;

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

/**
 * Heatmap — a matrix of colored cells keyed by (x, y), each shaded by a
 * single-hue intensity scale from `min` to `max`. Ordered X columns / Y rows
 * are derived from the data in first-seen order. Dependency-free inline SVG;
 * dark mode flips automatically through the tokens the color-mix resolves.
 */
export function Heatmap({
  data,
  min,
  max,
  colorScale = "var(--brand-500)",
  showValues = false,
  cellGap = 2,
  radius = 2,
  xLabel,
  yLabel,
  showLegend = true,
  valueFormat,
  height = 300,
  ariaLabel,
  "aria-label": ariaLabelProp,
  tableFallback = true,
  caption,
  className = "",
  ...rest
}) {
  const baseStyles = useScopedStyles("twc-chart-base", CHART_BASE_CSS);
  const styles = useScopedStyles("twc-heatmap-styles", HEATMAP_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;

  const rows = Array.isArray(data) ? data : [];
  const fmt = valueFormat || fmtNumber;

  // Ordered, de-duplicated axis values preserving first-seen order.
  const xs = [];
  const ys = [];
  const seenX = new Set();
  const seenY = new Set();
  const lookup = new Map(); // "x\u0000y" -> value
  for (const d of rows) {
    const kx = String(d.x);
    const ky = String(d.y);
    if (!seenX.has(kx)) { seenX.add(kx); xs.push(d.x); }
    if (!seenY.has(ky)) { seenY.add(ky); ys.push(d.y); }
    lookup.set(`${kx}\u0000${ky}`, Number(d.value) || 0);
  }
  const cellOf = (x, y) => lookup.get(`${String(x)}\u0000${String(y)}`);

  // Color-scale bounds: default to the data range, degenerate-safe.
  const values = rows.map((d) => Number(d.value) || 0);
  const dataMin = values.length ? Math.min(...values) : 0;
  const dataMax = values.length ? Math.max(...values) : 1;
  const lo = min != null ? min : dataMin;
  const hi = max != null ? max : dataMax;
  const span = hi - lo;
  // Percent of `colorScale` mixed over transparent; flat data reads mid-tone.
  const pctOf = (v) => (span > 0 ? clamp(((v - lo) / span) * 100, 0, 100) : 60);
  const fillOf = (v) => `color-mix(in srgb, ${colorScale} ${pctOf(v)}%, transparent)`;

  const cols = xs.length;
  const rowN = ys.length;

  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? "heatmap";

  // ---- geometry ---------------------------------------------------------
  const W = 600;
  const H = height;
  const padT = 8;
  const padR = 8;
  const yTickW = 64; // room for Y category labels
  const xTickH = 22; // room for X category labels
  const yTitleW = yLabel != null ? 16 : 0;
  const xTitleH = xLabel != null ? 16 : 0;
  const padL = yTitleW + yTickW;
  const padB = xTitleH + xTickH;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const cw = innerW / Math.max(1, cols);
  const chh = innerH / Math.max(1, rowN);
  const gap = clamp(cellGap, 0, Math.min(cw, chh) - 1) || 0;

  return (
    <div className={`twc-chart twc-chart--heatmap ${className}`.trim()} {...rest}>
      {baseStyles}
      {styles}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId} preserveAspectRatio="none">
        {/* cells */}
        {ys.map((y, ri) =>
          xs.map((x, ci) => {
            const v = cellOf(x, y);
            const has = v !== undefined;
            const cx = padL + cw * ci + gap / 2;
            const cy = padT + chh * ri + gap / 2;
            const cwPx = Math.max(0, cw - gap);
            const chPx = Math.max(0, chh - gap);
            return (
              <g key={`${ci}-${ri}`}>
                <rect
                  className={has ? "twc-chart__hm-cell" : "twc-chart__hm-cell twc-chart__hm-empty"}
                  x={cx} y={cy} width={cwPx} height={chPx} rx={radius}
                  style={has ? { fill: fillOf(v) } : undefined}
                >
                  <title>{`${labelText(y)} / ${labelText(x)}: ${has ? fmt(v) : "—"}`}</title>
                </rect>
                {showValues && has ? (
                  <text className="twc-chart__hm-val" x={cx + cwPx / 2} y={cy + chPx / 2 + 3.5} textAnchor="middle">
                    {fmt(v)}
                  </text>
                ) : null}
              </g>
            );
          })
        )}

        {/* Y category labels */}
        {ys.map((y, ri) => (
          <text key={ri} className="twc-chart__hm-tick" x={padL - 8} y={padT + chh * ri + chh / 2 + 4} textAnchor="end">
            {labelText(y)}
          </text>
        ))}

        {/* X category labels */}
        {xs.map((x, ci) => (
          <text key={ci} className="twc-chart__hm-tick" x={padL + cw * ci + cw / 2} y={padT + innerH + 15} textAnchor="middle">
            {labelText(x)}
          </text>
        ))}

        {/* axis titles */}
        {yLabel != null ? (
          <text className="twc-chart__hm-title" transform={`translate(11 ${padT + innerH / 2}) rotate(-90)`} textAnchor="middle">
            {labelText(yLabel)}
          </text>
        ) : null}
        {xLabel != null ? (
          <text className="twc-chart__hm-title" x={padL + innerW / 2} y={H - 3} textAnchor="middle">
            {labelText(xLabel)}
          </text>
        ) : null}
      </svg>

      {showLegend && span > 0 ? (
        <div className="twc-chart__hm-scale" aria-hidden="true">
          <span>{fmt(lo)}</span>
          <span
            className="twc-chart__hm-bar"
            style={{ background: `linear-gradient(to right, color-mix(in srgb, ${colorScale} 0%, transparent), ${colorScale})` }}
          />
          <span>{fmt(hi)}</span>
        </div>
      ) : null}

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={xs.map(labelText)}
          rows={ys.map((y) => ({
            label: labelText(y),
            values: xs.map((x) => {
              const v = cellOf(x, y);
              return v === undefined ? "—" : fmt(v);
            }),
          }))}
        />
      ) : null}
    </div>
  );
}

function labelText(label) {
  return typeof label === "string" || typeof label === "number" ? String(label) : "";
}
