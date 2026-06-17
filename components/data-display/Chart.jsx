import React from "react";

const CHART_CSS = `
.twc-chart { font-family: var(--font-sans); width: 100%; }
.twc-chart svg { display: block; width: 100%; overflow: visible; }
.twc-chart__grid { stroke: var(--color-divider); stroke-width: 1; }
.twc-chart__axis { fill: var(--color-text-subtle); font-size: 11px; }
.twc-chart__bar { fill: var(--color-primary); transition: fill var(--duration-fast) var(--ease-standard); }
.twc-chart__bar:hover { fill: var(--color-primary-hover); }
.twc-chart__line { fill: none; stroke: var(--color-primary); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.twc-chart__dot { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 2.5; }
.twc-chart__legend { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-3); font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-chart__leg { display: inline-flex; align-items: center; gap: 6px; }
.twc-chart__leg-sw { width: 10px; height: 10px; border-radius: 3px; }
@keyframes twc-chart-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
`;

const SERIES_COLORS = ["var(--brand-500)", "var(--sky-500)", "var(--emerald-500)", "var(--amber-500)", "var(--rose-500)"];

export function Chart({
  type = "bar",
  data,
  series,
  height = 220,
  showGrid = true,
  showAxis = true,
  showLegend = false,
  colors,
  valueFormat,
  ariaLabel,
  "aria-label": ariaLabelProp,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-chart-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-chart-styles";
    el.textContent = CHART_CSS;
    document.head.appendChild(el);
  }, []);

  const keys = series || ["value"];
  const palette = colors && colors.length ? colors : SERIES_COLORS;
  const W = 600, H = height, padL = showAxis ? 40 : 8, padR = 8, padT = 12, padB = showAxis ? 26 : 8;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const max = Math.max(1, ...data.flatMap((d) => keys.map((k) => Number(d[k]) || 0)));
  const niceMax = niceCeil(max);
  const y = (v) => padT + innerH - (v / niceMax) * innerH;
  const fmt = valueFormat || ((v) => v.toLocaleString());
  const ticks = 4;
  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? `${type} chart`;

  return (
    <div className={`twc-chart ${className}`} {...rest}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} preserveAspectRatio="none">
        {showGrid ? Array.from({ length: ticks + 1 }).map((_, i) => {
          const gy = padT + (innerH / ticks) * i;
          return <line key={i} className="twc-chart__grid" x1={padL} y1={gy} x2={W - padR} y2={gy} />;
        }) : null}
        {showAxis ? Array.from({ length: ticks + 1 }).map((_, i) => {
          const val = niceMax - (niceMax / ticks) * i;
          const gy = padT + (innerH / ticks) * i;
          return <text key={i} className="twc-chart__axis" x={padL - 8} y={gy + 4} textAnchor="end">{shortNum(val)}</text>;
        }) : null}

        {type === "bar" ? (() => {
          const groups = data.length;
          const groupW = innerW / groups;
          const barGap = 0.28;
          const bw = (groupW * (1 - barGap)) / keys.length;
          return data.map((d, gi) => keys.map((k, si) => {
            const v = Number(d[k]) || 0;
            const x = padL + groupW * gi + (groupW * barGap) / 2 + si * bw;
            const by = y(v);
            return <rect key={`${gi}-${si}`} className="twc-chart__bar" x={x + 1} y={by} width={Math.max(1, bw - 2)} height={padT + innerH - by}
              rx="3" style={{ fill: keys.length > 1 || (colors && colors.length) ? palette[si % palette.length] : undefined }}>
              <title>{`${d.label ?? gi}: ${fmt(v)}`}</title>
            </rect>;
          }));
        })() : null}

        {type === "line" ? keys.map((k, si) => {
          const pts = data.map((d, i) => [padL + (innerW / Math.max(1, data.length - 1)) * i, y(Number(d[k]) || 0)]);
          const dPath = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
          const color = palette[si % palette.length];
          return (
            <g key={k}>
              <path className="twc-chart__line" d={dPath} style={{ stroke: color }} />
              {pts.map((p, i) => <circle key={i} className="twc-chart__dot" cx={p[0]} cy={p[1]} r="3.5" style={{ stroke: color }}><title>{`${data[i].label ?? i}: ${fmt(Number(data[i][k]) || 0)}`}</title></circle>)}
            </g>
          );
        }) : null}

        {showAxis ? data.map((d, i) => {
          const groupW = innerW / data.length;
          const cx = type === "line" ? padL + (innerW / Math.max(1, data.length - 1)) * i : padL + groupW * i + groupW / 2;
          return <text key={i} className="twc-chart__axis" x={cx} y={H - 8} textAnchor="middle">{d.label}</text>;
        }) : null}
      </svg>
      {showLegend && keys.length > 1 ? (
        <div className="twc-chart__legend">
          {keys.map((k, si) => <span key={k} className="twc-chart__leg"><span className="twc-chart__leg-sw" style={{ background: palette[si % palette.length] }} />{k}</span>)}
        </div>
      ) : null}
    </div>
  );
}

function niceCeil(v) {
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}
function shortNum(v) {
  if (v >= 1000000) return (v / 1000000).toFixed(v % 1000000 ? 1 : 0) + "M";
  if (v >= 1000) return (v / 1000).toFixed(v % 1000 ? 1 : 0) + "k";
  return String(Math.round(v));
}
