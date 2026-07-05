import React from "react";
import { RangeChart } from "twico-ui";

// A longer timeline so drag-to-zoom has something to zoom into.
const timeline = [
  { label: "Research", min: 0, max: 3 },
  { label: "Design", min: 2, max: 6 },
  { label: "Prototype", min: 5, max: 8 },
  { label: "Build API", min: 7, max: 13, color: "var(--sky-500)" },
  { label: "Build UI", min: 9, max: 15 },
  { label: "Integrate", min: 14, max: 18 },
  { label: "QA", min: 17, max: 21 },
  { label: "Beta", min: 20, max: 23 },
  { label: "Docs", min: 21, max: 24 },
  { label: "Launch", min: 23, max: 25 },
];

const tempBand = [
  { label: "Mon", min: 12, max: 20 },
  { label: "Tue", min: 14, max: 24 },
  { label: "Wed", min: 11, max: 19 },
  { label: "Thu", min: 13, max: 22 },
  { label: "Fri", min: 15, max: 26 },
];

export default function RangeChartDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ maxWidth: 520 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <RangeChart
            type="bar"
            data={timeline}
            height={320}
            zoomable
            valueFormat={(v) => `wk ${v}`}
            onDataClick={(p) => setPicked(p)}
            ariaLabel="Interactive project timeline with zoom and click"
          />
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            {picked ? (
              <>
                Clicked{" "}
                <strong style={{ color: "var(--color-text)" }}>{String(picked.label)}</strong> = wk{" "}
                {picked.min}–{picked.max}
              </>
            ) : (
              "Hover for details · click a bar to select · drag across to zoom"
            )}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 520 }}>
        <RangeChart type="area" data={tempBand} valueFormat={(v) => `${v}°`} />
      </div>
    </div>
  );
}
