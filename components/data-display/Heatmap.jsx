import React from "react";
import { useScopedStyles } from "../_styles.js";
import { CHART_BASE_CSS, fmtNumber, ChartTable, useChartTooltip, ChartTooltip } from "./_chart.js";

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
 * are derived from the data in first-seen order. Click (`onDataClick`) +
 * selection, an optional 2-D drag/wheel zoom + pan over the cell grid, and a
 * focus-dim that fades the other cells when one is selected. Dependency-free
 * inline SVG; dark mode flips automatically through the tokens the color-mix
 * resolves.
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
  zoomable = false,
  valueFormat,
  height = 300,
  onDataClick,
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
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [hovered, setHovered] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [zoom, setZoom] = React.useState(null); // {c0,c1,r0,r1} inclusive column/row index window
  const [drag, setDrag] = React.useState(null); // {x0,y0,x1,y1,pan,z0} in viewBox px
  const svgRef = React.useRef(null);
  const movedRef = React.useRef(false);

  const clickable = !!onDataClick;
  const selectMark = (key) => setSelected((s) => (s === key ? null : key));

  const rows = Array.isArray(data) ? data : [];
  const fmt = valueFormat || fmtNumber;

  // Ordered, de-duplicated axis values preserving first-seen order.
  const fullXs = [];
  const fullYs = [];
  const seenX = new Set();
  const seenY = new Set();
  const lookup = new Map(); // "x\u0000y" -> value
  for (const d of rows) {
    const kx = String(d.x);
    const ky = String(d.y);
    if (!seenX.has(kx)) { seenX.add(kx); fullXs.push(d.x); }
    if (!seenY.has(ky)) { seenY.add(ky); fullYs.push(d.y); }
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

  // ---- zoom window (opt-in, a sub-range of the ordered columns/rows) -----
  const nX = fullXs.length;
  const nY = fullYs.length;
  // 2-D zoom needs at least two columns and two rows to sub-range; guards
  // single-row / single-column / empty data.
  const canZoom = zoomable && nX > 1 && nY > 1;
  const vc0 = canZoom && zoom ? clamp(zoom.c0, 0, nX - 1) : 0;
  const vc1 = canZoom && zoom ? clamp(zoom.c1, 0, nX - 1) : Math.max(0, nX - 1);
  const vr0 = canZoom && zoom ? clamp(zoom.r0, 0, nY - 1) : 0;
  const vr1 = canZoom && zoom ? clamp(zoom.r1, 0, nY - 1) : Math.max(0, nY - 1);
  // Windowed value lists actually rendered (labels, cells, geometry).
  const xs = fullXs.slice(vc0, vc1 + 1);
  const ys = fullYs.slice(vr0, vr1 + 1);

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

  // ---- pointer → cell / index mapping (all layout-derived, guarded) ------
  // Screen → viewBox coordinates via the SVG CTM (correct under
  // preserveAspectRatio="none"; getBoundingClientRect can't account for the
  // non-uniform scaling). SSR-safe: only called from client event handlers.
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
  const colAtPx = (px) => (cw > 0 ? clamp(Math.floor((clamp(px, padL, padL + innerW) - padL) / cw), 0, cols - 1) : 0);
  const rowAtPx = (py) => (chh > 0 ? clamp(Math.floor((clamp(py, padT, padT + innerH) - padT) / chh), 0, rowN - 1) : 0);
  const cellAtPx = (px, py) => {
    if (!(cols > 0) || !(rowN > 0)) return null;
    if (px < padL || px > padL + innerW || py < padT || py > padT + innerH) return null;
    const ci = colAtPx(px);
    const ri = rowAtPx(py);
    const x = xs[ci], y = ys[ri];
    const v = cellOf(x, y);
    const has = v !== undefined;
    return { x, y, v, has, key: `${vc0 + ci}-${vr0 + ri}`, fill: has ? fillOf(v) : undefined };
  };

  // ---- zoom + pan over the index window ---------------------------------
  const applyZoom = (win) => {
    const c0 = clamp(Math.min(win.c0, win.c1), 0, nX - 1);
    const c1 = clamp(Math.max(win.c0, win.c1), 0, nX - 1);
    const r0 = clamp(Math.min(win.r0, win.r1), 0, nY - 1);
    const r1 = clamp(Math.max(win.r0, win.r1), 0, nY - 1);
    if (!(c1 >= c0) || !(r1 >= r0)) return; // degenerate / empty
    if (c0 === 0 && c1 === nX - 1 && r0 === 0 && r1 === nY - 1) { setZoom(null); return; }
    setZoom({ c0, c1, r0, r1 });
  };
  const panTo = (z0, dCols, dRows) => {
    const wc = z0.c1 - z0.c0, wr = z0.r1 - z0.r0;
    const c0 = clamp(z0.c0 + dCols, 0, Math.max(0, nX - 1 - wc));
    const r0 = clamp(z0.r0 + dRows, 0, Math.max(0, nY - 1 - wr));
    setZoom({ c0, c1: c0 + wc, r0, r1: r0 + wr });
  };

  const onOverlayDown = (e) => {
    const pt = svgPoint(e); if (!pt) return;
    movedRef.current = false;
    setDrag({ x0: pt.px, y0: pt.py, x1: pt.px, y1: pt.py, pan: e.shiftKey, z0: zoom || { c0: 0, c1: nX - 1, r0: 0, r1: nY - 1 } });
  };
  const onOverlayMove = (e) => {
    const pt = svgPoint(e); if (!pt) return;
    if (drag) {
      if (Math.abs(pt.px - drag.x0) > 4 || Math.abs(pt.py - drag.y0) > 4) movedRef.current = true;
      if (drag.pan) {
        if (zoom) {
          const dCols = cw > 0 ? -Math.round((pt.px - drag.x0) / cw) : 0;
          const dRows = chh > 0 ? -Math.round((pt.py - drag.y0) / chh) : 0;
          panTo(drag.z0, dCols, dRows);
        }
      } else {
        setDrag({ ...drag, x1: pt.px, y1: pt.py });
      }
      setHovered(null);
      hide();
      return;
    }
    const cell = cellAtPx(pt.px, pt.py);
    if (cell) {
      setHovered(cell.key);
      show({ title: `${labelText(cell.y)} / ${labelText(cell.x)}`, items: [{ color: cell.fill, label: "", value: cell.has ? fmt(cell.v) : "—" }] }, e);
    } else { setHovered(null); hide(); }
  };
  const onOverlayUp = () => {
    if (drag && !drag.pan && movedRef.current) {
      applyZoom({
        c0: vc0 + colAtPx(drag.x0), c1: vc0 + colAtPx(drag.x1),
        r0: vr0 + rowAtPx(drag.y0), r1: vr0 + rowAtPx(drag.y1),
      });
    }
    setDrag(null);
  };
  const onOverlayLeave = () => { setHovered(null); hide(); setDrag(null); };
  const onOverlayClick = (e) => {
    if (movedRef.current) { movedRef.current = false; return; } // a drag, not a click
    const pt = svgPoint(e); if (!pt) return;
    const cell = cellAtPx(pt.px, pt.py);
    if (cell && cell.has) { if (onDataClick) onDataClick({ x: cell.x, y: cell.y, value: cell.v }); selectMark(cell.key); }
  };

  // Mouse-wheel zoom about the cursor via a non-passive native listener
  // (React's onWheel is passive). Zooms the visible column/row counts.
  React.useEffect(() => {
    if (!canZoom) return undefined;
    const svg = svgRef.current; if (!svg) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const pt = svgPoint(e);
      const fx = pt && innerW > 0 ? clamp((pt.px - padL) / innerW, 0, 1) : 0.5;
      const fy = pt && innerH > 0 ? clamp((pt.py - padT) / innerH, 0, 1) : 0.5;
      const factor = e.deltaY < 0 ? 0.7 : 1.4;
      const wc = vc1 - vc0 + 1, wr = vr1 - vr0 + 1;
      const newWc = clamp(Math.round(wc * factor), 1, nX);
      const newWr = clamp(Math.round(wr * factor), 1, nY);
      const curCol = vc0 + clamp(Math.floor(fx * cols), 0, cols - 1);
      const curRow = vr0 + clamp(Math.floor(fy * rowN), 0, rowN - 1);
      const nc0 = clamp(Math.round(curCol - fx * (newWc - 1)), 0, nX - newWc);
      const nr0 = clamp(Math.round(curRow - fy * (newWr - 1)), 0, nY - newWr);
      applyZoom({ c0: nc0, c1: nc0 + newWc - 1, r0: nr0, r1: nr0 + newWr - 1 });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [canZoom, vc0, vc1, vr0, vr1]); // eslint-disable-line react-hooks/exhaustive-deps

  const dragBand = canZoom && drag && !drag.pan && Math.abs(drag.x1 - drag.x0) > 2 && Math.abs(drag.y1 - drag.y0) > 2;

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--heatmap ${className}`.trim()} data-hovering={hovered != null || undefined} data-has-selection={selected != null || undefined} data-clickable={clickable || undefined} {...rest}>
      {baseStyles}
      {styles}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId} preserveAspectRatio="none">
        {/* cells */}
        {ys.map((y, ri) =>
          xs.map((x, ci) => {
            const v = cellOf(x, y);
            const has = v !== undefined;
            const cx = padL + cw * ci + gap / 2;
            const cy = padT + chh * ri + gap / 2;
            const cwPx = Math.max(0, cw - gap);
            const chPx = Math.max(0, chh - gap);
            const cellKey = `${vc0 + ci}-${vr0 + ri}`;
            const fill = has ? fillOf(v) : undefined;
            return (
              <g key={cellKey}>
                <rect
                  className={`${has ? "twc-chart__hm-cell" : "twc-chart__hm-cell twc-chart__hm-empty"} twc-chart__anim-fade`}
                  x={cx} y={cy} width={cwPx} height={chPx} rx={radius}
                  style={has ? { fill } : undefined}
                  data-mark
                  data-active={hovered === cellKey || undefined}
                  data-selected={selected === cellKey || undefined}
                  onMouseMove={(e) => { setHovered(cellKey); show({ title: `${labelText(y)} / ${labelText(x)}`, items: [{ color: fill, label: "", value: has ? fmt(v) : "—" }] }, e); }}
                  onMouseLeave={() => { setHovered(null); hide(); }}
                  onClick={has ? () => { if (onDataClick) onDataClick({ x, y, value: v }); selectMark(cellKey); } : undefined}
                />
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

        {dragBand ? (
          <rect className="twc-chart__zoomband"
            x={Math.min(drag.x0, drag.x1)} y={Math.min(drag.y0, drag.y1)}
            width={Math.abs(drag.x1 - drag.x0)} height={Math.abs(drag.y1 - drag.y0)} />
        ) : null}

        {canZoom ? (
          <rect className="twc-chart__overlay" data-zoom="true" data-clickable={clickable || undefined}
            data-panning={(drag && drag.pan) || undefined}
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
          columns={fullXs.map(labelText)}
          rows={fullYs.map((y) => ({
            label: labelText(y),
            values: fullXs.map((x) => {
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
