import React from "react";
import { useScopedStyles } from "../_styles.js";
import {
  CHART_BASE_CSS, niceScale, shortNum, fmtNumber, ChartTable,
  useChartTooltip, ChartTooltip,
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
 * shares the value axis, grid, tooltip, click (`onDataClick`) + selection,
 * optional drag/wheel zoom + pan, and a11y-table conventions of the chart family.
 */
export function Candlestick({
  data,
  upColor = "var(--color-success)",
  downColor = "var(--color-danger)",
  height = 300,
  showGrid = true,
  showAxis = true,
  zoomable = false,
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
  const styles = useScopedStyles("twc-candlestick-styles", CANDLE_CSS);
  const uid = React.useId();
  const tableId = tableFallback ? `${uid}-table` : undefined;
  const { containerRef, tip, show, hide } = useChartTooltip();
  const [selected, setSelected] = React.useState(null);
  const [zoom, setZoom] = React.useState(null); // {s,e} indices into the full data
  const [drag, setDrag] = React.useState(null); // {start,end,pan,z0}
  const svgRef = React.useRef(null);

  const fmt = valueFormat || fmtNumber;
  const clickable = !!onDataClick;

  const allRows = data || [];
  const baseIdx = zoom ? zoom.s : 0;
  const rows = zoom ? allRows.slice(zoom.s, zoom.e + 1) : allRows;

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

  const tipFor = (d) => {
    const open = Number(d.open) || 0, high = Number(d.high) || 0;
    const low = Number(d.low) || 0, close = Number(d.close) || 0;
    const color = close >= open ? upColor : downColor;
    return {
      title: labelText(d.label),
      items: [
        { color, label: "Open", value: fmt(open) },
        { label: "High", value: fmt(high) },
        { label: "Low", value: fmt(low) },
        { label: "Close", value: fmt(close) },
      ],
    };
  };

  // ---- interaction handlers --------------------------------------------
  const selectMark = (key) => setSelected((s) => (s === key ? null : key));
  const clickCandle = (d, index) => {
    if (!onDataClick) return;
    onDataClick({
      label: d.label,
      open: Number(d.open) || 0,
      high: Number(d.high) || 0,
      low: Number(d.low) || 0,
      close: Number(d.close) || 0,
      index,
    });
  };

  // ---- zoom + pan (opt-in, categorical windowing) ----------------------
  const applyZoom = (s, e) => {
    const n = allRows.length;
    if (e - s >= n - 1) { setZoom(null); return; }
    setZoom({ s: Math.max(0, s), e: Math.min(n - 1, e) });
  };
  const catFromEvent = (e) => {
    const svg = svgRef.current; if (!svg) return null;
    if (!rows.length) return null;
    const r = svg.getBoundingClientRect();
    if (!(r.width > 0)) return null;
    const frac = Math.min(1, Math.max(0, ((e.clientX - r.left) / r.width * W - padL) / innerW));
    const idx = Math.floor(frac * rows.length);
    return Math.min(rows.length - 1, Math.max(0, idx));
  };
  const onOverlayMove = (e) => {
    const idx = catFromEvent(e);
    if (idx == null || !rows[idx]) return;
    show(tipFor(rows[idx]), e);
    if (drag) {
      if (drag.pan) {
        const spanZ = drag.z0.e - drag.z0.s;
        const s = Math.min(allRows.length - 1 - spanZ, Math.max(0, drag.z0.s + (drag.start - idx)));
        applyZoom(s, s + spanZ);
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
    if (idx == null || !rows[idx]) return;
    clickCandle(rows[idx], baseIdx + idx);
    selectMark(baseIdx + idx);
  };
  // Mouse-wheel zoom via a non-passive native listener (React's onWheel is passive).
  React.useEffect(() => {
    if (!zoomable) return undefined;
    const svg = svgRef.current; if (!svg) return undefined;
    const onWheel = (e) => {
      const n = allRows.length;
      if (!n) return;
      e.preventDefault();
      const cur = zoom || { s: 0, e: n - 1 };
      const spanZ = cur.e - cur.s;
      const r = svg.getBoundingClientRect();
      const frac = r.width > 0 ? Math.min(1, Math.max(0, ((e.clientX - r.left) / r.width * W - padL) / innerW)) : 0.5;
      const center = cur.s + Math.round(frac * spanZ);
      const newSpan = Math.min(n - 1, Math.max(1, Math.round(spanZ * (e.deltaY < 0 ? 0.8 : 1.25))));
      const s = Math.min(n - 1 - newSpan, Math.max(0, center - Math.round(newSpan * frac)));
      applyZoom(s, s + newSpan);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [zoomable, zoom, allRows.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const dragBand = zoomable && drag && !drag.pan && drag.end !== drag.start;

  return (
    <div ref={containerRef} className={`twc-chart twc-chart--candlestick ${className}`.trim()}
      data-clickable={clickable || undefined} {...rest}>
      {baseStyles}
      {styles}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={svgAriaLabel} aria-describedby={tableId} preserveAspectRatio="none">
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
          const gi = baseIdx + i;
          const yTop = vPos(Math.max(open, close));
          const yBot = vPos(Math.min(open, close));
          const bh = Math.max(1, yBot - yTop); // min 1px so a doji stays visible
          return (
            <g key={i} className="twc-chart__anim-fade" data-dir={up ? "up" : "down"}
              onMouseMove={(e) => show(tipFor(d), e)} onMouseLeave={hide}
              onClick={() => { clickCandle(d, gi); selectMark(gi); }}>
              {/* transparent hit target spanning the full band for easy hovering */}
              <rect x={padL + catBand * i} y={padT} width={catBand} height={innerH} fill="transparent"
                style={{ cursor: clickable ? "pointer" : "default" }} />
              <line className="twc-candlestick__wick" style={{ stroke: color }}
                x1={x} y1={vPos(high)} x2={x} y2={vPos(low)} />
              <rect className="twc-candlestick__body" style={{ fill: color }} data-mark
                data-selected={selected === gi || undefined}
                x={x - bodyW / 2} y={yTop} width={bodyW} height={bh} rx="1" />
            </g>
          );
        })}

        {/* category labels (thinned when dense) */}
        {showAxis ? rows.map((d, i) =>
          i % labelStep === 0
            ? <text key={i} className="twc-candlestick__axis" x={cx(i)} y={H - 8} textAnchor="middle">{d.label}</text>
            : null,
        ) : null}

        {dragBand ? (() => {
          const lo = Math.min(drag.start, drag.end), hi = Math.max(drag.start, drag.end);
          const x0 = padL + catBand * lo;
          const x1 = padL + catBand * (hi + 1);
          return <rect className="twc-chart__zoomband" x={x0} y={padT} width={Math.max(0, x1 - x0)} height={innerH} />;
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
          columns={["open", "high", "low", "close"]}
          rows={allRows.map((d) => ({
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
