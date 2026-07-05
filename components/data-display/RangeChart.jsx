import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, paletteAt, niceScale, shortNum, fmtNumber, r, linePath, ChartTable,
  useChartTooltip, ChartTooltip,
} from "./_chart.js";

const RANGE_CSS = `
.twc-chart--range .twc-rangechart__grid { stroke: var(--color-divider); stroke-width: 1; }
.twc-chart--range .twc-rangechart__axis { fill: var(--color-text-subtle); font-size: 11px; }
.twc-chart--range .twc-rangechart__bar { transition: opacity var(--duration-fast) var(--ease-standard); }
.twc-chart--range .twc-rangechart__bar:hover { opacity: 0.82; }
.twc-chart--range .twc-rangechart__band { transition: opacity var(--duration-fast) var(--ease-standard); opacity: 0.18; }
.twc-chart--range .twc-rangechart__band:hover { opacity: 0.26; }
.twc-chart--range .twc-rangechart__edge { fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
`;

/**
 * Range chart — either horizontal range bars (a timeline / Gantt: one min→max
 * band per row) or a range area (a shaded band between a per-category min line
 * and max line). Covers rangeBar + rangeArea, with a floating tooltip, click
 * (`onDataClick`) + selection, and optional drag/wheel zoom over the category
 * axis. Dependency-free inline SVG; shares the value axis, grid, tooltip and
 * a11y-table conventions of the chart family.
 */
export function RangeChart({
  type = "bar",
  data,
  height = 300,
  showGrid = true,
  showAxis = true,
  zoomable = false,
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
  const styles = useScopedStyles("twc-rangechart-styles", RANGE_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [selected, setSelected] = React.useState(null);
  const [zoom, setZoom] = React.useState(null); // {s,e} indices into the full data
  const [drag, setDrag] = React.useState(null); // {start,end,pan,z0}
  const svgRef = React.useRef(null);

  const isArea = type === "area";
  const clickable = !!onDataClick;
  const fmt = valueFormat || fmtNumber;

  // Categorical windowing: the visible rows are a slice of the full data; the
  // full data still drives the a11y table + payload indices (via baseIdx).
  const allRows = data || [];
  const baseIdx = zoom ? zoom.s : 0;
  const rows = zoom ? allRows.slice(zoom.s, zoom.e + 1) : allRows;
  const n = rows.length;

  const W = 600, H = height;
  // Bars need a wide left gutter for category labels; the area only needs room
  // for the value axis on the left and category labels on the bottom.
  const padL = showAxis ? (isArea ? 44 : 84) : 8;
  const padR = 12;
  const padT = 12;
  const padB = showAxis ? 26 : 8;
  const innerW = W - padL - padR, innerH = H - padT - padB;

  // Value domain spans every min and max in the visible window (ranges rarely
  // start at 0, so the scale is not anchored there). niceScale guards min===max
  // and empty input.
  const vals = rows.flatMap((d) => [Number(d.min), Number(d.max)]).filter(Number.isFinite);
  const lo = vals.length ? Math.min(...vals) : 0;
  const hi = vals.length ? Math.max(...vals) : 1;
  const scale = niceScale(lo, hi, 5);
  const span = scale.max - scale.min || 1; // guarded: niceScale never returns 0 span
  const frac = (v) => (v - scale.min) / span;

  const svgAriaLabel = ariaLabelProp ?? ariaLabel ?? `range ${type} chart`;

  // ---- geometry ---------------------------------------------------------
  const xPos = (v) => padL + frac(v) * innerW; // bar value axis runs left→right
  const catBandH = innerH / Math.max(1, n);
  const lineX = (i) => (n > 1 ? padL + (innerW / (n - 1)) * i : padL + innerW / 2);
  const yPos = (v) => padT + innerH - frac(v) * innerH; // area: top = high values

  // ---- shared helpers ---------------------------------------------------
  const colorAt = (d, i) => (isArea ? paletteAt(colors, 0) : (d.color || paletteAt(colors, i)));
  const rangeVal = (d) => `${fmt(Number(d.min) || 0)} – ${fmt(Number(d.max) || 0)}`;
  const tipFor = (d, i) => ({ title: labelText(d.label), items: [{ color: colorAt(d, i), label: "", value: rangeVal(d) }] });

  // ---- interaction handlers ---------------------------------------------
  const clickDatum = (d, localIdx) => {
    if (!onDataClick) return;
    onDataClick({ label: d.label, min: Number(d.min) || 0, max: Number(d.max) || 0, index: baseIdx + localIdx });
  };
  const selectMark = (key) => setSelected((s) => (s === key ? null : key));
  const clickAt = (localIdx) => { clickDatum(rows[localIdx], localIdx); selectMark(baseIdx + localIdx); };

  // ---- zoom + pan (opt-in, categorical windowing) -----------------------
  const applyZoom = (s, e) => {
    const nAll = allRows.length;
    if (e - s >= nAll - 1) { setZoom(null); return; }
    setZoom({ s: Math.max(0, s), e: Math.min(nAll - 1, e) });
  };
  // Fraction (0→1) along the categorical axis: vertical for bars, horizontal for
  // the area. getBoundingClientRect can be 0 before layout — guard it.
  const fracFromEvent = (e) => {
    const svg = svgRef.current; if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (isArea) {
      if (!(rect.width > 0)) return null;
      return Math.min(1, Math.max(0, ((e.clientX - rect.left) / rect.width * W - padL) / innerW));
    }
    if (!(rect.height > 0)) return null;
    return Math.min(1, Math.max(0, ((e.clientY - rect.top) / rect.height * H - padT) / innerH));
  };
  const catFromEvent = (e) => {
    if (!rows.length) return null;
    const f = fracFromEvent(e);
    if (f == null) return null;
    const idx = isArea ? Math.round(f * Math.max(1, rows.length - 1)) : Math.floor(f * rows.length);
    return Math.min(rows.length - 1, Math.max(0, idx));
  };
  const onOverlayMove = (e) => {
    const idx = catFromEvent(e);
    if (idx == null) return;
    show(tipFor(rows[idx], idx), e);
    if (drag) {
      if (drag.pan) {
        const spanD = drag.z0.e - drag.z0.s;
        const s = Math.min(allRows.length - 1 - spanD, Math.max(0, drag.z0.s + (drag.start - idx)));
        applyZoom(s, s + spanD);
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
      const loI = Math.min(drag.start, drag.end), hiI = Math.max(drag.start, drag.end);
      if (hiI - loI >= 1) applyZoom(baseIdx + loI, baseIdx + hiI);
    }
    setDrag(null);
  };
  const onOverlayClick = (e) => {
    if (!onDataClick) return;
    const idx = catFromEvent(e);
    if (idx == null) return;
    clickAt(idx);
  };
  // Mouse-wheel zoom via a non-passive native listener (React's onWheel is passive).
  React.useEffect(() => {
    if (!zoomable) return undefined;
    const svg = svgRef.current; if (!svg) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const nAll = allRows.length;
      const cur = zoom || { s: 0, e: nAll - 1 };
      const spanC = cur.e - cur.s;
      const f = fracFromEvent(e);
      const frc = f == null ? 0.5 : f;
      const center = cur.s + Math.round(frc * spanC);
      const newSpan = Math.min(nAll - 1, Math.max(1, Math.round(spanC * (e.deltaY < 0 ? 0.8 : 1.25))));
      const s = Math.min(nAll - 1 - newSpan, Math.max(0, center - Math.round(newSpan * frc)));
      applyZoom(s, s + newSpan);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [zoomable, zoom, allRows.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- bar (horizontal timeline / Gantt) --------------------------------
  const renderBars = () => {
    const gap = 0.34;
    const slot = catBandH * (1 - gap);
    return rows.map((d, i) => {
      const min = Number(d.min) || 0, max = Number(d.max) || 0;
      // Negative-safe: draw from the smaller to the larger endpoint.
      const x0 = xPos(Math.min(min, max));
      const x1 = xPos(Math.max(min, max));
      const y = padT + catBandH * i + (catBandH * gap) / 2;
      const color = colorAt(d, i);
      const key = baseIdx + i;
      return (
        <rect key={i} className="twc-rangechart__bar twc-chart__anim-bar" data-mark data-horizontal="true"
          data-selected={selected === key || undefined} style={{ fill: color }}
          x={x0} y={y} width={Math.max(1, x1 - x0)} height={Math.max(1, slot)} rx="3"
          onMouseMove={(e) => show(tipFor(d, i), e)}
          onMouseLeave={hide}
          onClick={() => clickAt(i)} />
      );
    });
  };

  // ---- area (range band across categories) ------------------------------
  const renderBand = () => {
    const maxPts = rows.map((d, i) => [lineX(i), yPos(Number(d.max) || 0)]);
    const minPts = rows.map((d, i) => [lineX(i), yPos(Number(d.min) || 0)]);
    // Closed band: the max line forward, then the min line reversed, then Z.
    const rev = [...minPts].reverse().map((p) => `L${r(p[0])} ${r(p[1])}`).join(" ");
    const bandD = `${linePath(maxPts)} ${rev} Z`;
    const color = paletteAt(colors, 0);
    const hitW = n > 1 ? innerW / (n - 1) : innerW;
    return (
      <g>
        <path className="twc-rangechart__band twc-chart__anim-fade" style={{ fill: color }} d={bandD} />
        <path className="twc-rangechart__edge" style={{ stroke: color }} d={linePath(maxPts)} />
        <path className="twc-rangechart__edge" style={{ stroke: color }} d={linePath(minPts)} />
        {/* invisible per-category hit columns carry the range tooltips + click-to-select */}
        {rows.map((d, i) => (
          <rect key={i} data-mark data-selected={selected === baseIdx + i || undefined}
            fill="transparent" x={lineX(i) - hitW / 2} y={padT} width={hitW} height={innerH}
            onMouseMove={(e) => show(tipFor(d, i), e)}
            onMouseLeave={hide}
            onClick={() => clickAt(i)} />
        ))}
      </g>
    );
  };

  // Full-plot hover zones (one per category) so the shared tooltip tracks the cursor
  // ANYWHERE in the plot — not only when directly over a bar/band. Rendered behind the
  // marks (marks stay on top for precise per-row hover/click). Off when `zoomable` (the
  // zoom overlay owns hovering then). For bars the categories sit on the y-axis, so each
  // zone spans the full value width across that row's band; for the area they sit on the
  // x-axis, so each zone is a full-height x-band centred on the category (midpoint splits).
  const renderZones = () => rows.map((d, i) => {
    let x, y, w, hgt;
    if (isArea) {
      const x0 = i === 0 ? padL : (lineX(i - 1) + lineX(i)) / 2;
      const x1 = i === rows.length - 1 ? padL + innerW : (lineX(i) + lineX(i + 1)) / 2;
      x = x0; w = x1 - x0; y = padT; hgt = innerH;
    } else {
      x = padL; w = innerW; y = padT + catBandH * i; hgt = catBandH;
    }
    return (
      <rect key={i} className="twc-chart__zone" x={x} y={y} width={Math.max(0, w)} height={Math.max(0, hgt)}
        data-clickable={onDataClick ? true : undefined}
        onMouseMove={(e) => show(tipFor(d, i), e)}
        onMouseLeave={hide}
        onClick={() => clickDatum(d, i)} />
    );
  });

  const dragBand = zoomable && drag && !drag.pan && drag.end !== drag.start;

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--range ${className}`.trim()}
      data-type={type} data-clickable={clickable || undefined} {...rest}>
      {baseStyles}
      {styles}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId} preserveAspectRatio="none">
        {/* value grid (vertical for bars, horizontal for the area) */}
        {showGrid ? scale.ticks.map((t, i) =>
          isArea
            ? <line key={i} className="twc-rangechart__grid" x1={padL} y1={yPos(t)} x2={W - padR} y2={yPos(t)} />
            : <line key={i} className="twc-rangechart__grid" x1={xPos(t)} y1={padT} x2={xPos(t)} y2={padT + innerH} />,
        ) : null}
        {/* value axis labels */}
        {showAxis ? scale.ticks.map((t, i) =>
          isArea
            ? <text key={i} className="twc-rangechart__axis" x={padL - 8} y={yPos(t) + 4} textAnchor="end">{shortNum(t)}</text>
            : <text key={i} className="twc-rangechart__axis" x={xPos(t)} y={H - 8} textAnchor="middle">{shortNum(t)}</text>,
        ) : null}

        {!zoomable ? renderZones() : null}
        {isArea ? renderBand() : renderBars()}

        {/* category labels (left for bars, bottom for the area) */}
        {showAxis ? rows.map((d, i) =>
          isArea
            ? <text key={i} className="twc-rangechart__axis" x={lineX(i)} y={H - 8} textAnchor="middle">{d.label}</text>
            : <text key={i} className="twc-rangechart__axis" x={padL - 8} y={padT + catBandH * i + catBandH / 2 + 4} textAnchor="end">{d.label}</text>,
        ) : null}

        {dragBand ? (() => {
          const loI = Math.min(drag.start, drag.end), hiI = Math.max(drag.start, drag.end);
          if (isArea) {
            const x0 = lineX(loI), x1 = lineX(hiI);
            return <rect className="twc-chart__zoomband" x={x0} y={padT} width={Math.max(0, x1 - x0)} height={innerH} />;
          }
          const y0 = padT + catBandH * loI, y1 = padT + catBandH * (hiI + 1);
          return <rect className="twc-chart__zoomband" x={padL} y={y0} width={innerW} height={Math.max(0, y1 - y0)} />;
        })() : null}

        {zoomable ? (
          <rect className="twc-chart__overlay" data-clickable={clickable || undefined}
            x={padL} y={padT} width={innerW} height={innerH}
            onMouseMove={onOverlayMove} onMouseLeave={() => { hide(); setDrag(null); }}
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
        <ChartTable
          id={tableId}
          caption={caption ?? svgAriaLabel}
          columns={["min", "max"]}
          rows={allRows.map((d) => ({ label: d.label, values: [fmt(Number(d.min) || 0), fmt(Number(d.max) || 0)] }))}
        />
      ) : null}
    </div>
  );
}

function labelText(label) {
  return typeof label === "string" || typeof label === "number" ? String(label) : "";
}
