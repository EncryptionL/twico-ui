import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, paletteAt, niceScale, shortNum, fmtNumber, r,
  linePath, areaPath, ChartTable, ChartLegend, useChartTooltip, ChartTooltip,
} from "./_chart.js";

const CHART_CSS = `
.twc-chart__grid { stroke: var(--color-divider); stroke-width: 1; }
.twc-chart__axisline { stroke: var(--color-border); stroke-width: 1; }
.twc-chart__tick { stroke: var(--color-border); stroke-width: 1; }
.twc-chart__axis { fill: var(--color-text-subtle); font-size: 11px; }
.twc-chart__bar { fill: var(--color-primary); }
.twc-chart__bar:hover { filter: brightness(1.06); }
.twc-chart__line { fill: none; stroke: var(--color-primary); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.twc-chart__area { stroke: none; }
.twc-chart__dot { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 2.5; transition: r var(--duration-fast) var(--ease-standard); }
.twc-chart__hit { fill: transparent; }
.twc-chart__hit:hover + .twc-chart__dot, .twc-chart__dot:hover { r: 5; }
.twc-chart__vline { stroke: var(--color-border-strong); stroke-width: 1; stroke-dasharray: 3 3; opacity: 0.7; }
.twc-chart__label { fill: var(--color-text-muted); font-size: 10px; font-weight: var(--font-semibold); }
`;

/**
 * Cartesian chart — vertical/horizontal bars (grouped or stacked), line, and
 * area (straight / smooth / stepped), single or multi-series, with a floating
 * tooltip, hover crosshair, entrance animation, and a toggleable legend.
 * Dependency-free inline SVG.
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
  showValues = false,
  showGrid = true,
  showAxis = true,
  showLegend = false,
  animate = true,
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
  const gid = uid.replace(/[^a-zA-Z0-9]/g, "");
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [hidden, setHidden] = React.useState(() => new Set());

  const isBar = type === "bar" || type === "column";
  const isArea = type === "area";
  const crv = smooth ? "smooth" : curve;
  const pathOpts = { smooth: crv === "smooth", step: crv === "stepped" ? "after" : null };
  const canStack = stacked && (isBar || isArea);
  const anim = animate ? "" : null;

  const allKeys = series && series.length ? series : ["value"];
  const keys = allKeys.filter((k) => !hidden.has(k));
  const rows = data || [];
  const fmt = valueFormat || fmtNumber;
  const multi = allKeys.length > 1;

  const W = 600, H = height;
  const padL = showAxis ? (horizontal ? 84 : 44) : 8;
  const padR = 10, padT = 12;
  const padB = showAxis ? 26 : 8;
  const innerW = W - padL - padR, innerH = H - padT - padB;

  const stackSum = (d) => keys.reduce((a, k) => a + (Number(d[k]) || 0), 0);
  const rawMax = canStack
    ? Math.max(0, ...rows.map(stackSum))
    : Math.max(0, ...rows.flatMap((d) => keys.map((k) => Number(d[k]) || 0)));
  const scale = niceScale(0, rawMax || 1, 4);
  const niceMax = scale.max || 1;
  const ticks = scale.ticks;

  const vPix = (v) => (v / niceMax) * (horizontal ? innerW : innerH);
  const vPos = (v) => (horizontal ? padL + vPix(v) : padT + innerH - vPix(v));
  const catBand = innerW / Math.max(1, rows.length);
  const catBandH = innerH / Math.max(1, rows.length);
  const lineX = (i) => padL + (innerW / Math.max(1, rows.length - 1)) * i;

  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? `${type} chart`;

  // Shared tooltip: a whole-category breakdown across the visible series (ApexCharts style).
  const tipFor = (d) => ({
    title: d.label,
    items: keys.map((k) => ({ color: colorFor(k), label: k, value: fmt(Number(d[k]) || 0) })),
  });
  function colorFor(k) {
    const idx = allKeys.indexOf(k);
    return multi || (colors && colors.length) ? paletteAt(colors, idx) : "var(--color-primary)";
  }

  // ---- bars -------------------------------------------------------------
  const renderBars = () => {
    const band = horizontal ? catBandH : catBand;
    const gap = 0.28;
    const slot = band * (1 - gap);
    return rows.map((d, gi) => {
      const gStart = (horizontal ? padT : padL) + band * gi + (band * gap) / 2;
      const hoverProps = {
        onMouseMove: (e) => show(tipFor(d), e),
        onMouseLeave: hide,
      };
      if (canStack) {
        let acc = 0;
        return keys.map((k, si) => {
          const v = Number(d[k]) || 0;
          const p0 = vPix(acc), p1 = vPix(acc + v);
          acc += v;
          const color = colorFor(k);
          const common = { className: `twc-chart__bar ${anim === "" ? "twc-chart__anim-bar" : ""}`.trim(), "data-horizontal": horizontal || undefined, style: { fill: color }, rx: 2, ...hoverProps };
          return horizontal
            ? <rect key={`${gi}-${si}`} {...common} x={padL + p0} y={gStart} width={Math.max(0, p1 - p0)} height={Math.max(1, slot)} />
            : <rect key={`${gi}-${si}`} {...common} x={gStart} y={padT + innerH - p1} width={Math.max(1, slot)} height={Math.max(0, p1 - p0)} />;
        });
      }
      const bw = slot / Math.max(1, keys.length);
      return keys.map((k, si) => {
        const v = Number(d[k]) || 0;
        const len = vPix(v);
        const color = colorFor(k);
        const common = { className: `twc-chart__bar ${anim === "" ? "twc-chart__anim-bar" : ""}`.trim(), "data-horizontal": horizontal || undefined, style: { fill: color }, rx: 2, ...hoverProps };
        return horizontal
          ? <rect key={`${gi}-${si}`} {...common} x={padL} y={gStart + si * bw + 0.5} width={Math.max(0, len)} height={Math.max(1, bw - 1)} />
          : <rect key={`${gi}-${si}`} {...common} x={gStart + si * bw + 0.5} y={padT + innerH - len} width={Math.max(1, bw - 1)} height={Math.max(0, len)} />;
      });
    });
  };

  // ---- lines / areas ----------------------------------------------------
  const renderLines = () => {
    const stackAcc = canStack ? rows.map(() => 0) : null;
    return keys.map((k) => {
      const color = colorFor(k);
      const pts = rows.map((d, i) => {
        const v = Number(d[k]) || 0;
        const val = canStack ? (stackAcc[i] += v) : v;
        return [lineX(i), vPos(val)];
      });
      const base = canStack ? rows.map((d, i) => vPos(stackAcc[i] - (Number(d[k]) || 0))) : null;
      const gradId = `twc-grad-${gid}-${allKeys.indexOf(k)}`;
      return (
        <g key={k}>
          {isArea ? (
            <>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.34" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path className={`twc-chart__area ${anim === "" ? "twc-chart__anim-fade" : ""}`.trim()} style={{ fill: `url(#${gradId})` }}
                d={canStack
                  ? `${linePath(pts, pathOpts)} ${pts.map((p, i) => `L${p[0]} ${base[i]}`).reverse().join(" ")} Z`
                  : areaPath(pts, padT + innerH, pathOpts)} />
            </>
          ) : null}
          <path className={`twc-chart__line ${anim === "" ? "twc-chart__anim-line" : ""}`.trim()} style={{ stroke: color }} pathLength="1" d={linePath(pts, pathOpts)} />
          {(showDots || !isArea) ? pts.map((p, i) => (
            <g key={i} className={anim === "" ? "twc-chart__anim-fade" : undefined}>
              <circle className="twc-chart__hit" cx={p[0]} cy={p[1]} r="14"
                onMouseMove={(e) => show(tipFor(rows[i]), e)} onMouseLeave={hide} />
              <circle className="twc-chart__dot" style={{ stroke: color }} cx={p[0]} cy={p[1]} r="3.5" />
            </g>
          )) : null}
        </g>
      );
    });
  };

  // ---- optional data labels --------------------------------------------
  const renderValues = () => {
    if (!showValues) return null;
    if (isBar) {
      const band = horizontal ? catBandH : catBand;
      const slot = band * 0.72;
      return rows.flatMap((d, gi) => {
        const gStart = (horizontal ? padT : padL) + band * gi + (band * 0.28) / 2;
        if (canStack) return [];
        const bw = slot / Math.max(1, keys.length);
        return keys.map((k, si) => {
          const v = Number(d[k]) || 0;
          if (horizontal) return <text key={`${gi}-${si}`} className="twc-chart__label" x={padL + vPix(v) + 4} y={gStart + si * bw + bw / 2 + 3}>{shortNum(v)}</text>;
          return <text key={`${gi}-${si}`} className="twc-chart__label" x={gStart + si * bw + bw / 2} y={padT + innerH - vPix(v) - 5} textAnchor="middle">{shortNum(v)}</text>;
        });
      });
    }
    return keys.flatMap((k) => rows.map((d, i) => {
      const v = Number(d[k]) || 0;
      return <text key={`${k}-${i}`} className="twc-chart__label" x={lineX(i)} y={vPos(v) - 9} textAnchor="middle">{shortNum(v)}</text>;
    }));
  };

  const toggle = (it) => setHidden((prev) => {
    const next = new Set(prev);
    if (next.has(it.label)) next.delete(it.label);
    else if (allKeys.length - next.size > 1) next.add(it.label); // keep at least one series
    return next;
  });

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--${type} ${className}`.trim()} {...rest}>
      {baseStyles}
      {styles}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId} preserveAspectRatio="none">
        {showGrid ? ticks.map((t, i) => {
          const p = vPos(t);
          return horizontal
            ? <line key={i} className="twc-chart__grid" x1={p} y1={padT} x2={p} y2={padT + innerH} />
            : <line key={i} className="twc-chart__grid" x1={padL} y1={p} x2={W - padR} y2={p} />;
        }) : null}

        {/* axis lines */}
        {showAxis ? <line className="twc-chart__axisline" x1={padL} y1={padT} x2={padL} y2={padT + innerH} /> : null}
        {showAxis ? <line className="twc-chart__axisline" x1={padL} y1={padT + innerH} x2={W - padR} y2={padT + innerH} /> : null}

        {showAxis ? ticks.map((t, i) => {
          const p = vPos(t);
          return horizontal
            ? <text key={i} className="twc-chart__axis" x={p} y={H - 8} textAnchor="middle">{shortNum(t)}</text>
            : <text key={i} className="twc-chart__axis" x={padL - 8} y={p + 4} textAnchor="end">{shortNum(t)}</text>;
        }) : null}

        {isBar ? renderBars() : renderLines()}
        {renderValues()}

        {showAxis ? rows.map((d, i) => {
          if (horizontal) {
            const cy = padT + catBandH * i + catBandH / 2;
            return <text key={i} className="twc-chart__axis" x={padL - 8} y={cy + 4} textAnchor="end">{d.label}</text>;
          }
          const cx = isBar ? padL + catBand * i + catBand / 2 : lineX(i);
          return <text key={i} className="twc-chart__axis" x={cx} y={H - 8} textAnchor="middle">{d.label}</text>;
        }) : null}
      </svg>

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable id={tableId} caption={caption ?? svgAriaLabel} columns={allKeys}
          rows={rows.map((d) => ({ label: d.label, values: allKeys.map((k) => fmt(Number(d[k]) || 0)) }))} />
      ) : null}

      {showLegend && multi ? (
        <ChartLegend
          items={allKeys.map((k) => ({ label: k, color: colorFor(k) }))}
          onToggle={toggle}
          hidden={(it) => hidden.has(it.label)}
        />
      ) : null}
    </div>
  );
}
