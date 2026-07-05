import React from "react";
import { ScatterChart } from "twico-ui";

// A couple of denser series so drag-to-zoom has something to zoom into.
const groups = [
  {
    name: "Control",
    points: [
      { x: 12, y: 30 },
      { x: 16, y: 34 },
      { x: 20, y: 45 },
      { x: 24, y: 41 },
      { x: 28, y: 38 },
      { x: 31, y: 47 },
      { x: 34, y: 55, label: "outlier" },
      { x: 38, y: 44 },
      { x: 41, y: 49 },
      { x: 45, y: 52 },
    ],
  },
  {
    name: "Treatment",
    points: [
      { x: 15, y: 22 },
      { x: 19, y: 25 },
      { x: 24, y: 28 },
      { x: 27, y: 32 },
      { x: 30, y: 34 },
      { x: 34, y: 30 },
      { x: 38, y: 31 },
      { x: 42, y: 37 },
      { x: 46, y: 40 },
      { x: 50, y: 43 },
    ],
  },
];

export default function ScatterChartDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ maxWidth: 520 }}>
        <ScatterChart
          series={groups}
          zoomable
          xLabel="Weight (kg)"
          yLabel="Score"
          onDataClick={(p) => setPicked(p)}
        />
      </div>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        {picked ? (
          <>
            Clicked{" "}
            <strong style={{ color: "var(--color-text)" }}>
              {String(picked.point.label ?? picked.series)}
            </strong>{" "}
            = ({picked.x}, {picked.y})
          </>
        ) : (
          "Hover for details · click a point to select · drag to zoom"
        )}
      </div>
    </div>
  );
}
