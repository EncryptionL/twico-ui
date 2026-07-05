import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, paletteAt, niceScale, shortNum, fmtNumber, ChartTable, ChartLegend,
  useChartTooltip, ChartTooltip,
} from "./_chart.js";

const SCATTER_CSS = `
.twc-chart--scatter__grid { stroke: var(--color-divider); stroke-width: 1; }
.twc-chart--scatter__axis { fill: var(--color-text-subtle); font-size: 11px; }
.twc-chart--scatter__title { fill: var(--color-text-muted); font-size: 11px; font-weight: 500; }
.twc-chart--scatter__dot { transform-box: fill-box; transform-origin: center; transition: transform var(--duration-fast) var(--ease-standard), opacity var(--duration-fast) var(--ease-standard); stroke: var(--color-surface); stroke-width: 1; }
.twc-chart--scatter__dot[data-bubble="true"] { fill-opacity: 0.55; }
.twc-chart__hit { fill: transparent; }
.twc-chart__hit:hover + .twc-chart--scatter__dot { transform: scale(1.18); }
`;

/**
 * Scatter / bubble chart — plots x/y points across two nice-scaled numeric axes,
 * one or many series. Pass a per-point `z` (or `bubble`) to size the dots by a
 * third dimension (a bubble chart). Adds a floating tooltip, a hoverable legend,
 * click (`onDataClick`) + selection, and an optional 2-D drag/wheel zoom + pan.
 * Dependency-free inline SVG; shares the grid, tooltip, legend and a11y-table
 * conventions of the chart family. Unlike the stretched cartesian charts this
 * keeps the SVG aspect ratio (default `preserveAspectRatio`) so the dots stay round.
 */
export function ScatterChart({
  series,
  bubble = false,
  maxBubble = 26,
  dotRadius = 4.5,
  height = 300,
  xLabel,
  yLabel,
  showGrid = true,
  showLegend,
  zoomable = false,
  xFormat,
  yFormat,
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
  const styles = useScopedStyles("twc-scatter-styles", SCATTER_CSS);
  const uid = React.useId();
  const gid = uid.replace(/[^a-zA-Z0-9]/g, "");
  const clipId = `twc-sc-clip-${gid}`;
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [focus, setFocus] = React.useState(null); // hovered series index (legend focus)
  const [selected, setSelected] = React.useState(null); // selected point key
  const [zoom, setZoom] = React.useState(null); // {x0,x1,y0,y1} data-domain window
  const [drag, setDrag] = React.useState(null); // {x0,y0,x1,y1,pan,z0} in viewBox px
  const svgRef = React.useRef(null);
  const movedRef = React.useRef(false);

  const list = Array.isArray(series) ? series : [];
  const vFmt = valueFormat || fmtNumber;
  const xFmt = xFormat || vFmt;
  const yFmt = yFormat || vFmt;

  // Flatten every finite point (tagged with its series index + stable point index)
  // for scaling, z detection, selection keys and click payloads.
  const all = list.flatMap((s, si) => {
    const pts = s && Array.isArray(s.points) ? s.points : [];
    return pts
      .map((p, pi) => ({ p, pi }))
      .filter(({ p }) => p && Number.isFinite(Number(p.x)) && Number.isFinite(Number(p.y)))
      .map(({ p, pi }) => ({ si, pi, key: `${si}:${pi}`, x: Number(p.x), y: Number(p.y), z: p.z, label: p.label, point: p }));
  });

  // Bubble mode turns on explicitly, or automatically when any point carries a numeric z.
  const hasZ = all.some((p) => Number.isFinite(Number(p.z)));
  const useBubble = bubble || hasZ;
  const zMax = useBubble ? Math.max(0, ...all.map((p) => Number(p.z) || 0)) : 0;
  // Bubble area ∝ z, so radius ∝ √z; falls back to dotRadius when z is missing/≤0.
  const dotR = (z) => {
    if (!useBubble) return dotRadius;
    const zv = Number(z);
    if (!Number.isFinite(zv) || zv <= 0 || !(zMax > 0)) return Math.max(2, dotRadius);
    return Math.max(2, Math.sqrt(zv / zMax) * maxBubble);
  };

  // Full data domain (drives the un-zoomed scale + clamps the zoom window).
  const xs = all.map((p) => p.x), ys = all.map((p) => p.y);
  const base = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  const baseSpanX = base.x1 - base.x0, baseSpanY = base.y1 - base.y0;
  // Zoom needs data + a positive span on both axes; guards single/identical/empty points.
  const canZoom = zoomable && all.length > 0 && baseSpanX > 0 && baseSpanY > 0;

  // Nice-scaled domains recomputed from the active window; niceScale guards
  // min===max (single/identical points) and non-finite (empty data) inputs.
  const dom = canZoom && zoom ? zoom : base;
  const xScale = niceScale(dom.x0, dom.x1, 5);
  const yScale = niceScale(dom.y0, dom.y1, 5);
  const xSpan = xScale.max - xScale.min || 1; // guarded: niceScale never returns 0 span
  const ySpan = yScale.max - yScale.min || 1;

  const W = 600, H = height;
  const padL = 46 + (yLabel != null ? 16 : 0);
  const padR = 14;
  const padT = 14;
  const padB = 28 + (xLabel != null ? 18 : 0);
  const innerW = W - padL - padR, innerH = H - padT - padB;

  // Data → pixel mappers.
  const xPos = (x) => padL + ((x - xScale.min) / xSpan) * innerW;
  const yPos = (y) => padT + innerH - ((y - yScale.min) / ySpan) * innerH;

  const seriesColor = (s, i) => (s && s.color) || paletteAt(undefined, i);
  const seriesName = (s, i) => (s && s.name) || `Series ${i + 1}`;
  const multi = list.length > 1;
  const legend = showLegend ?? multi;
  const clickable = !!onDataClick;
  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? `${useBubble ? "bubble" : "scatter"} chart`;

  // Draw larger bubbles first so smaller dots stay clickable/visible on top.
  const dots = all
    .map((p) => ({ ...p, radius: dotR(p.z), fill: seriesColor(list[p.si], p.si) }))
    .sort((a, b) => b.radius - a.radius);

  const tipLabel = (p) => labelText(p.label) || seriesName(list[p.si], p.si);
  const tableColumns = hasZ ? ["x", "y", "z"] : ["x", "y"];

  // Per-point tooltip: series/point title + the point's x/y (and z when present).
  const tipFor = (p) => ({
    title: tipLabel(p),
    items: [
      { color: p.fill, label: "x", value: xFmt(p.x) },
      { label: "y", value: yFmt(p.y) },
      ...(Number.isFinite(Number(p.z)) ? [{ label: "z", value: vFmt(Number(p.z)) }] : []),
    ],
  });
  const focusActive = (si) => (focus == null ? undefined : si === focus || undefined);

  // ---- click + selection -----------------------------------------------
  const clickPoint = (p) => {
    if (!onDataClick) return;
    onDataClick({ x: p.x, y: p.y, z: p.point.z, series: seriesName(list[p.si], p.si), seriesIndex: p.si, index: p.pi, point: p.point });
  };
  const selectPoint = (key) => setSelected((s) => (s === key ? null : key));

  // ---- zoom + pan (opt-in, 2-D continuous window over the data domain) ---
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  // Screen → viewBox coordinates via the SVG CTM (correct under preserveAspectRatio;
  // getBoundingClientRect can't account for the letterboxing). SSR-safe: called only
  // from client event handlers, and every layout-derived value is guarded.
  const svgPoint = (e) => {
    const svg = svgRef.current;
    if (!svg || typeof svg.getScreenCTM !== "function" || typeof svg.createSVGPoint !== "function") return null;
    const ctm = svg.getScreenCTM();
    if (!ctm || !ctm.a || !ctm.d) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const loc = pt.matrixTransform(ctm.inverse());
    if (!Number.isFinite(loc.x) || !Number.isFinite(loc.y)) return null;
    return { px: loc.x, py: loc.y };
  };
  const dataFromPx = (px, py) => {
    const cx = clamp(px, padL, padL + innerW);
    const cy = clamp(py, padT, padT + innerH);
    return {
      x: xScale.min + ((cx - padL) / innerW) * (xScale.max - xScale.min),
      y: yScale.min + ((padT + innerH - cy) / innerH) * (yScale.max - yScale.min),
    };
  };
  const nearestDot = (px, py) => {
    let best = null, bestD = Infinity;
    for (const p of dots) {
      const dx = xPos(p.x) - px, dy = yPos(p.y) - py;
      const d = dx * dx + dy * dy;
      const rr = Math.max(14, p.radius);
      if (d <= rr * rr && d < bestD) { bestD = d; best = p; }
    }
    return best;
  };
  const applyZoom = (win) => {
    const x0 = Math.max(Math.min(win.x0, win.x1), base.x0), x1 = Math.min(Math.max(win.x0, win.x1), base.x1);
    const y0 = Math.max(Math.min(win.y0, win.y1), base.y0), y1 = Math.min(Math.max(win.y0, win.y1), base.y1);
    if (!(x1 - x0 > 0) || !(y1 - y0 > 0)) return; // ignore degenerate selections
    if (x1 - x0 >= baseSpanX && y1 - y0 >= baseSpanY) { setZoom(null); return; }
    setZoom({ x0, x1, y0, y1 });
  };
  const panTo = (win) => {
    const wSpan = win.x1 - win.x0, hSpan = win.y1 - win.y0;
    let { x0, x1, y0, y1 } = win;
    if (x0 < base.x0) { x0 = base.x0; x1 = base.x0 + wSpan; }
    else if (x1 > base.x1) { x1 = base.x1; x0 = base.x1 - wSpan; }
    if (y0 < base.y0) { y0 = base.y0; y1 = base.y0 + hSpan; }
    else if (y1 > base.y1) { y1 = base.y1; y0 = base.y1 - hSpan; }
    setZoom({ x0, x1, y0, y1 });
  };

  const onOverlayDown = (e) => {
    const pt = svgPoint(e); if (!pt) return;
    movedRef.current = false;
    setDrag({ x0: pt.px, y0: pt.py, x1: pt.px, y1: pt.py, pan: e.shiftKey, z0: zoom || base });
  };
  const onOverlayMove = (e) => {
    const pt = svgPoint(e); if (!pt) return;
    if (drag) {
      if (Math.abs(pt.px - drag.x0) > 4 || Math.abs(pt.py - drag.y0) > 4) movedRef.current = true;
      if (drag.pan) {
        if (zoom) {
          const z0 = drag.z0;
          const dxData = -((pt.px - drag.x0) / innerW) * (z0.x1 - z0.x0);
          const dyData = ((pt.py - drag.y0) / innerH) * (z0.y1 - z0.y0);
          panTo({ x0: z0.x0 + dxData, x1: z0.x1 + dxData, y0: z0.y0 + dyData, y1: z0.y1 + dyData });
        }
      } else {
        setDrag({ ...drag, x1: pt.px, y1: pt.py });
      }
      hide();
      return;
    }
    const hit = nearestDot(pt.px, pt.py);
    if (hit) show(tipFor(hit), e); else hide();
  };
  const onOverlayUp = () => {
    if (drag && !drag.pan) {
      const a = dataFromPx(drag.x0, drag.y0), b = dataFromPx(drag.x1, drag.y1);
      if (Math.abs(drag.x1 - drag.x0) > 4 && Math.abs(drag.y1 - drag.y0) > 4) applyZoom({ x0: a.x, x1: b.x, y0: a.y, y1: b.y });
    }
    setDrag(null);
  };
  const onOverlayLeave = () => { hide(); setDrag(null); };
  const onOverlayClick = (e) => {
    if (movedRef.current) { movedRef.current = false; return; } // a drag, not a click
    const pt = svgPoint(e); if (!pt) return;
    const hit = nearestDot(pt.px, pt.py);
    if (hit) { clickPoint(hit); selectPoint(hit.key); }
  };

  // Mouse-wheel zoom about the cursor via a non-passive native listener (React's onWheel is passive).
  React.useEffect(() => {
    if (!canZoom) return undefined;
    const svg = svgRef.current; if (!svg) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const pt = svgPoint(e);
      const fx = pt ? clamp((pt.px - padL) / innerW, 0, 1) : 0.5;
      const fy = pt ? clamp((padT + innerH - pt.py) / innerH, 0, 1) : 0.5;
      const factor = e.deltaY < 0 ? 0.8 : 1.25;
      const x0 = xScale.min, x1 = xScale.max, y0 = yScale.min, y1 = yScale.max;
      const cxv = x0 + fx * (x1 - x0), cyv = y0 + fy * (y1 - y0);
      const nw = (x1 - x0) * factor, nh = (y1 - y0) * factor;
      applyZoom({ x0: cxv - fx * nw, x1: cxv + (1 - fx) * nw, y0: cyv - fy * nh, y1: cyv + (1 - fy) * nh });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [canZoom, zoom, xScale.min, xScale.max, yScale.min, yScale.max]); // eslint-disable-line react-hooks/exhaustive-deps

  const dragBand = canZoom && drag && !drag.pan && Math.abs(drag.x1 - drag.x0) > 2 && Math.abs(drag.y1 - drag.y0) > 2;

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--scatter ${className}`.trim()}
      data-bubble={useBubble || undefined} data-hovering={focus != null || undefined}
      data-has-selection={selected != null || undefined}
      data-clickable={clickable || undefined} {...rest}>
      {baseStyles}
      {styles}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId}>
        <defs>
          <clipPath id={clipId}>
            <rect x={padL} y={padT} width={Math.max(0, innerW)} height={Math.max(0, innerH)} />
          </clipPath>
        </defs>

        {/* grid + y (value) axis */}
        {showGrid ? yScale.ticks.map((t, i) => {
          const p = yPos(t);
          return <line key={`y${i}`} className="twc-chart--scatter__grid" x1={padL} y1={p} x2={W - padR} y2={p} />;
        }) : null}
        {showGrid ? xScale.ticks.map((t, i) => {
          const p = xPos(t);
          return <line key={`x${i}`} className="twc-chart--scatter__grid" x1={p} y1={padT} x2={p} y2={padT + innerH} />;
        }) : null}

        {/* axis tick labels */}
        {yScale.ticks.map((t, i) => (
          <text key={`yt${i}`} className="twc-chart--scatter__axis" x={padL - 8} y={yPos(t) + 4} textAnchor="end">{shortNum(t)}</text>
        ))}
        {xScale.ticks.map((t, i) => (
          <text key={`xt${i}`} className="twc-chart--scatter__axis" x={xPos(t)} y={padT + innerH + 16} textAnchor="middle">{shortNum(t)}</text>
        ))}

        {/* axis titles */}
        {xLabel != null ? (
          <text className="twc-chart--scatter__title" x={padL + innerW / 2} y={H - 6} textAnchor="middle">{xLabel}</text>
        ) : null}
        {yLabel != null ? (
          <text className="twc-chart--scatter__title" x={16} y={padT + innerH / 2} textAnchor="middle"
            transform={`rotate(-90 16 ${padT + innerH / 2})`}>{yLabel}</text>
        ) : null}

        {/* points (clipped to the plot only while zoomed, so out-of-window dots don't overflow) */}
        <g clipPath={canZoom && zoom ? `url(#${clipId})` : undefined}>
          {dots.map((p) => (
            <g key={p.key} className="twc-chart__anim-fade">
              <circle className="twc-chart__hit" cx={xPos(p.x)} cy={yPos(p.y)} r={Math.max(14, p.radius)}
                onMouseMove={(e) => show(tipFor(p), e)} onMouseLeave={hide}
                onClick={() => { clickPoint(p); selectPoint(p.key); }} />
              <circle className="twc-chart--scatter__dot" data-mark
                data-active={focusActive(p.si)} data-selected={selected === p.key || undefined}
                data-bubble={useBubble || undefined}
                style={{ fill: p.fill }} cx={xPos(p.x)} cy={yPos(p.y)} r={p.radius} />
            </g>
          ))}
        </g>

        {dragBand ? (
          <rect className="twc-chart__zoomband"
            x={Math.min(drag.x0, drag.x1)} y={Math.min(drag.y0, drag.y1)}
            width={Math.abs(drag.x1 - drag.x0)} height={Math.abs(drag.y1 - drag.y0)} />
        ) : null}

        {canZoom ? (
          <rect className="twc-chart__overlay" data-clickable={clickable || undefined}
            x={padL} y={padT} width={Math.max(0, innerW)} height={Math.max(0, innerH)}
            onMouseDown={onOverlayDown} onMouseMove={onOverlayMove} onMouseUp={onOverlayUp}
            onMouseLeave={onOverlayLeave} onClick={onOverlayClick} />
        ) : null}
      </svg>

      {canZoom && zoom ? (
        <button type="button" className="twc-chart__zoom-reset" onClick={() => setZoom(null)} aria-label="Reset zoom">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
          Reset
        </button>
      ) : null}

      <ChartTooltip tip={tip} />

      {tableFallback ? (
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={tableColumns}
          rows={all.map((p) => ({
            label: seriesName(list[p.si], p.si),
            values: hasZ
              ? [xFmt(p.x), yFmt(p.y), Number.isFinite(Number(p.z)) ? vFmt(Number(p.z)) : ""]
              : [xFmt(p.x), yFmt(p.y)],
          }))}
        />
      ) : null}

      {legend && list.length ? (
        <ChartLegend
          items={list.map((s, i) => ({ label: seriesName(s, i), color: seriesColor(s, i) }))}
          onFocus={multi ? (it, i) => setFocus(i) : undefined}
          onBlur={multi ? () => setFocus(null) : undefined}
        />
      ) : null}
    </div>
  );
}

function labelText(label) {
  return typeof label === "string" || typeof label === "number" ? String(label) : "";
}
