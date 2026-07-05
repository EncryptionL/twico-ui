import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, paletteAt, niceScale, shortNum, fmtNumber,
  linePath, areaPath, ChartTable, ChartLegend, useChartTooltip, ChartTooltip,
} from "./_chart.js";

const CHART_CSS = `
.twc-chart__grid { stroke: var(--color-divider); stroke-width: 1; }
.twc-chart__axisline { stroke: var(--color-border); stroke-width: 1; }
.twc-chart__axis { fill: var(--color-text-subtle); font-size: 11px; }
.twc-chart__bar { fill: var(--color-primary); }
.twc-chart__bar:hover { filter: brightness(1.06); }
.twc-chart__line { fill: none; stroke: var(--color-primary); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.twc-chart__area { stroke: none; }
.twc-chart__dot { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 2.5; transition: r var(--duration-fast) var(--ease-standard); }
.twc-chart__hit { fill: transparent; }
.twc-chart__hit:hover + .twc-chart__dot, .twc-chart__dot:hover { r: 5; }
.twc-chart__label { fill: var(--color-text-muted); font-size: 10px; font-weight: var(--font-semibold); }
`;

/**
 * Cartesian chart — vertical/horizontal bars (grouped or stacked), line, and area,
 * with a floating tooltip + crosshair, a toggleable/hoverable legend, click
 * (`onDataClick`) + selection, optional drag/wheel zoom + pan, and entrance
 * animation. Dependency-free inline SVG.
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
  crosshair = true,
  zoomable = false,
  animate = true,
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
  const styles = useScopedStyles("twc-chart-styles", CHART_CSS);
  const uid = React.useId();
  const gid = uid.replace(/[^a-zA-Z0-9]/g, "");
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [hidden, setHidden] = React.useState(() => new Set());
  const [focusSeries, setFocusSeries] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const [zoom, setZoom] = React.useState(null); // {s,e} indices into the full data
  const [drag, setDrag] = React.useState(null); // {start,end,pan,z0}
  const svgRef = React.useRef(null);

  const isBar = type === "bar" || type === "column";
  const isArea = type === "area";
  const crv = smooth ? "smooth" : curve;
  const pathOpts = { smooth: crv === "smooth", step: crv === "stepped" ? "after" : null };
  const canStack = stacked && (isBar || isArea);
  const clickable = !!onDataClick;

  const allKeys = series && series.length ? series : ["value"];
  const keys = allKeys.filter((k) => !hidden.has(k));
  const allRows = data || [];
  const baseIdx = zoom ? zoom.s : 0;
  const rows = zoom ? allRows.slice(zoom.s, zoom.e + 1) : allRows;
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
  const catX = (i) => (isBar ? padL + catBand * i + catBand / 2 : lineX(i));

  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? `${type} chart`;

  function colorFor(k) {
    const idx = allKeys.indexOf(k);
    return multi || (colors && colors.length) ? paletteAt(colors, idx) : "var(--color-primary)";
  }
  const tipFor = (d) => ({
    title: d.label,
    items: keys.map((k) => ({ color: colorFor(k), label: k, value: fmt(Number(d[k]) || 0) })),
  });
  const focusActive = (k) => (focusSeries == null ? undefined : k === focusSeries || undefined);

  // ---- interaction handlers --------------------------------------------
  const onMarkMove = (d, localIdx, e) => { show(tipFor(d), e); setHoverIdx(localIdx); };
  const onMarkLeave = () => { hide(); setHoverIdx(null); };
  const clickDatum = (d, k, localIdx) => {
    if (!onDataClick) return;
    onDataClick({ label: d.label, series: k, seriesIndex: allKeys.indexOf(k), value: Number(d[k]) || 0, index: baseIdx + localIdx, row: d });
  };
  const selectMark = (key) => setSelected((s) => (s === key ? null : key));

  // ---- zoom + pan (opt-in, categorical windowing) ----------------------
  const applyZoom = (s, e) => {
    const n = allRows.length;
    if (e - s >= n - 1) { setZoom(null); return; }
    setZoom({ s: Math.max(0, s), e: Math.min(n - 1, e) });
  };
  const catFromEvent = (e) => {
    const svg = svgRef.current; if (!svg) return null;
    const r = svg.getBoundingClientRect();
    if (!(r.width > 0)) return null;
    const frac = Math.min(1, Math.max(0, ((e.clientX - r.left) / r.width * W - padL) / innerW));
    const idx = isBar ? Math.floor(frac * rows.length) : Math.round(frac * Math.max(1, rows.length - 1));
    return Math.min(rows.length - 1, Math.max(0, idx));
  };
  const onOverlayMove = (e) => {
    const idx = catFromEvent(e);
    if (idx == null) return;
    setHoverIdx(idx); show(tipFor(rows[idx]), e);
    if (drag) {
      if (drag.pan) {
        const span = drag.z0.e - drag.z0.s;
        const s = Math.min(allRows.length - 1 - span, Math.max(0, drag.z0.s + (drag.start - idx)));
        applyZoom(s, s + span);
      } else {
        setDrag({ ...drag, end: idx });
      }
    }
  };
  const onOverlayDown = (e) => {
    const idx = catFromEvent(e);
    if (idx == null) return;
    setDrag({ start: idx, end: idx, pan: e.shiftKey, z0: zoom || { s: 0, e: allRows.length - 1 } });
  };
  const onOverlayUp = () => {
    if (drag && !drag.pan) {
      const lo = Math.min(drag.start, drag.end), hi = Math.max(drag.start, drag.end);
      if (hi - lo >= 1) applyZoom(baseIdx + lo, baseIdx + hi);
    }
    setDrag(null);
  };
  const onOverlayClick = (e) => {
    if (!onDataClick) return;
    const idx = catFromEvent(e);
    if (idx == null) return;
    const d = rows[idx];
    onDataClick({ label: d.label, series: null, seriesIndex: -1, value: undefined, index: baseIdx + idx, row: d });
    selectMark(`${idx}:*`);
  };
  // Mouse-wheel zoom via a non-passive native listener (React's onWheel is passive).
  React.useEffect(() => {
    if (!zoomable) return undefined;
    const svg = svgRef.current; if (!svg) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const n = allRows.length;
      const cur = zoom || { s: 0, e: n - 1 };
      const span = cur.e - cur.s;
      const r = svg.getBoundingClientRect();
      const frac = r.width > 0 ? Math.min(1, Math.max(0, ((e.clientX - r.left) / r.width * W - padL) / innerW)) : 0.5;
      const center = cur.s + Math.round(frac * span);
      const newSpan = Math.min(n - 1, Math.max(1, Math.round(span * (e.deltaY < 0 ? 0.8 : 1.25))));
      const s = Math.min(n - 1 - newSpan, Math.max(0, center - Math.round(newSpan * frac)));
      applyZoom(s, s + newSpan);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [zoomable, zoom, allRows.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- render bars / lines ---------------------------------------------
  const renderBars = () => {
    const band = horizontal ? catBandH : catBand;
    const slot = band * 0.72;
    return rows.map((d, gi) => {
      const gStart = (horizontal ? padT : padL) + band * gi + (band * 0.28) / 2;
      const handlers = { onMouseMove: (e) => onMarkMove(d, gi, e), onMouseLeave: onMarkLeave };
      const barCommon = (k, key) => ({
        className: `twc-chart__bar ${animate ? "twc-chart__anim-bar" : ""}`.trim(),
        "data-mark": true, "data-horizontal": horizontal || undefined,
        "data-active": focusActive(k), "data-selected": selected === key || undefined,
        style: { fill: colorFor(k) }, rx: 2, ...handlers,
        onClick: () => { clickDatum(d, k, gi); selectMark(key); },
      });
      if (canStack) {
        let acc = 0;
        return keys.map((k) => {
          const v = Number(d[k]) || 0;
          const p0 = vPix(acc), p1 = vPix(acc + v);
          acc += v;
          const key = `${gi}:${k}`;
          return horizontal
            ? <rect key={key} {...barCommon(k, key)} x={padL + p0} y={gStart} width={Math.max(0, p1 - p0)} height={Math.max(1, slot)} />
            : <rect key={key} {...barCommon(k, key)} x={gStart} y={padT + innerH - p1} width={Math.max(1, slot)} height={Math.max(0, p1 - p0)} />;
        });
      }
      const bw = slot / Math.max(1, keys.length);
      return keys.map((k, si) => {
        const v = Number(d[k]) || 0;
        const len = vPix(v);
        const key = `${gi}:${k}`;
        return horizontal
          ? <rect key={key} {...barCommon(k, key)} x={padL} y={gStart + si * bw + 0.5} width={Math.max(0, len)} height={Math.max(1, bw - 1)} />
          : <rect key={key} {...barCommon(k, key)} x={gStart + si * bw + 0.5} y={padT + innerH - len} width={Math.max(1, bw - 1)} height={Math.max(0, len)} />;
      });
    });
  };

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
        <g key={k} data-mark data-active={focusActive(k)}>
          {isArea ? (
            <>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.34" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path className={`twc-chart__area ${animate ? "twc-chart__anim-fade" : ""}`.trim()} style={{ fill: `url(#${gradId})` }}
                d={canStack
                  ? `${linePath(pts, pathOpts)} ${pts.map((p, i) => `L${p[0]} ${base[i]}`).reverse().join(" ")} Z`
                  : areaPath(pts, padT + innerH, pathOpts)} />
            </>
          ) : null}
          <path className={`twc-chart__line ${animate ? "twc-chart__anim-line" : ""}`.trim()} style={{ stroke: color }} pathLength="1" d={linePath(pts, pathOpts)} />
          {(showDots || !isArea) ? pts.map((p, i) => (
            <g key={i} className={animate ? "twc-chart__anim-fade" : undefined}>
              <circle className="twc-chart__hit" cx={p[0]} cy={p[1]} r="14"
                onMouseMove={(e) => onMarkMove(rows[i], i, e)} onMouseLeave={onMarkLeave}
                onClick={() => { clickDatum(rows[i], k, i); selectMark(`${i}:${k}`); }} />
              <circle className="twc-chart__dot" style={{ stroke: color }} cx={p[0]} cy={p[1]} r="3.5"
                data-selected={selected === `${i}:${k}` || undefined} />
            </g>
          )) : null}
        </g>
      );
    });
  };

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
    else if (allKeys.length - next.size > 1) next.add(it.label);
    return next;
  });

  const showCrosshair = crosshair && !horizontal && hoverIdx != null && rows[hoverIdx];
  const dragBand = zoomable && drag && !drag.pan && drag.end !== drag.start;

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--${type} ${className}`.trim()}
      data-hovering={focusSeries != null || undefined} data-clickable={clickable || undefined} {...rest}>
      {baseStyles}
      {styles}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId} preserveAspectRatio="none">
        {showGrid ? ticks.map((t, i) => {
          const p = vPos(t);
          return horizontal
            ? <line key={i} className="twc-chart__grid" x1={p} y1={padT} x2={p} y2={padT + innerH} />
            : <line key={i} className="twc-chart__grid" x1={padL} y1={p} x2={W - padR} y2={p} />;
        }) : null}

        {showAxis ? <line className="twc-chart__axisline" x1={padL} y1={padT} x2={padL} y2={padT + innerH} /> : null}
        {showAxis ? <line className="twc-chart__axisline" x1={padL} y1={padT + innerH} x2={W - padR} y2={padT + innerH} /> : null}

        {showAxis ? ticks.map((t, i) => {
          const p = vPos(t);
          return horizontal
            ? <text key={i} className="twc-chart__axis" x={p} y={H - 8} textAnchor="middle">{shortNum(t)}</text>
            : <text key={i} className="twc-chart__axis" x={padL - 8} y={p + 4} textAnchor="end">{shortNum(t)}</text>;
        }) : null}

        {showCrosshair ? <line className="twc-chart__crosshair" x1={catX(hoverIdx)} y1={padT} x2={catX(hoverIdx)} y2={padT + innerH} /> : null}

        {isBar ? renderBars() : renderLines()}
        {renderValues()}

        {showAxis ? rows.map((d, i) => {
          if (horizontal) {
            const cy = padT + catBandH * i + catBandH / 2;
            return <text key={i} className="twc-chart__axis" x={padL - 8} y={cy + 4} textAnchor="end">{d.label}</text>;
          }
          return <text key={i} className="twc-chart__axis" x={catX(i)} y={H - 8} textAnchor="middle">{d.label}</text>;
        }) : null}

        {dragBand ? (() => {
          const lo = Math.min(drag.start, drag.end), hi = Math.max(drag.start, drag.end);
          const x0 = isBar ? padL + catBand * lo : lineX(lo);
          const x1 = isBar ? padL + catBand * (hi + 1) : lineX(hi);
          return <rect className="twc-chart__zoomband" x={x0} y={padT} width={Math.max(0, x1 - x0)} height={innerH} />;
        })() : null}

        {zoomable ? (
          <rect className="twc-chart__overlay" data-clickable={clickable || undefined}
            x={padL} y={padT} width={innerW} height={innerH}
            onMouseMove={onOverlayMove} onMouseLeave={() => { onMarkLeave(); setDrag(null); }}
            onMouseDown={onOverlayDown} onMouseUp={onOverlayUp} onClick={onOverlayClick} />
        ) : null}
      </svg>

      {zoomable && zoom ? (
        <button type="button" className="twc-chart__zoom-reset" onClick={() => setZoom(null)} aria-label="Reset zoom">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
          Reset
        </button>
      ) : null}

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable id={tableId} caption={caption ?? svgAriaLabel} columns={allKeys}
          rows={allRows.map((d) => ({ label: d.label, values: allKeys.map((k) => fmt(Number(d[k]) || 0)) }))} />
      ) : null}

      {showLegend && multi ? (
        <ChartLegend
          items={allKeys.map((k) => ({ label: k, color: colorFor(k) }))}
          onToggle={toggle}
          hidden={(it) => hidden.has(it.label)}
          onFocus={(it) => setFocusSeries(it.label)}
          onBlur={() => setFocusSeries(null)}
        />
      ) : null}
    </div>
  );
}
