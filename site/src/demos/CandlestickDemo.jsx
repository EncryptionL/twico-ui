import React from "react";
import { Candlestick } from "twico-ui";

// A longer OHLC series so drag-to-zoom has meaningful range to zoom into.
const ohlc = Array.from({ length: 24 }, (_, i) => {
  const base = 130 + 14 * Math.sin(i / 3) + (i % 4) * 3;
  const open = Math.round(base);
  const close = Math.round(base + 5 * Math.sin(i / 2 + 1));
  const high = Math.max(open, close) + Math.round(2 + (i % 3) * 2);
  const low = Math.min(open, close) - Math.round(2 + (i % 2) * 2);
  return { label: `D${i + 1}`, open, high, low, close };
});

export default function CandlestickDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ maxWidth: 520 }}>
        <Candlestick
          data={ohlc}
          zoomable
          valueFormat={(v) => `$${v}`}
          onDataClick={(p) => setPicked(p)}
          ariaLabel="Interactive candlestick chart with zoom and click"
        />
      </div>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        {picked ? (
          <>
            Clicked{" "}
            <strong style={{ color: "var(--color-text)" }}>{String(picked.label)}</strong> ·
            O ${picked.open} · H ${picked.high} · L ${picked.low} · C ${picked.close}
          </>
        ) : (
          "Hover a candle for details · click to select · drag across the plot to zoom"
        )}
      </div>
    </div>
  );
}
