import React from "react";
import { Boxplot } from "twico-ui";

const latencyData = [
  { label: "API", min: 12, q1: 24, median: 33, q3: 42, max: 58, outliers: [72] },
  { label: "Web", min: 18, q1: 30, median: 41, q3: 52, max: 66 },
  { label: "Cache", min: 8, q1: 20, median: 27, q3: 38, max: 49, outliers: [2, 63] },
  { label: "Queue", min: 22, q1: 34, median: 45, q3: 58, max: 74, outliers: [90] },
];

export default function BoxplotDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ maxWidth: 520 }}>
        <Boxplot
          data={latencyData}
          zoomable
          valueFormat={(v) => `${v}ms`}
          onDataClick={(p) => setPicked(p)}
          ariaLabel="Interactive box plot of request latency"
        />
      </div>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        {picked ? (
          <>
            Clicked{" "}
            <strong style={{ color: "var(--color-text)" }}>{String(picked.label)}</strong>{" "}
            — median {picked.median}ms (Q1 {picked.q1}ms · Q3 {picked.q3}ms)
          </>
        ) : (
          "Hover a box for details · click to select · drag to zoom"
        )}
      </div>
    </div>
  );
}
