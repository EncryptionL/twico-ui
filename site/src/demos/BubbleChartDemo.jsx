import React from "react";
import { BubbleChart } from "twico-ui";

const plans = [
  {
    name: "Plans",
    points: [
      { x: 12, y: 40, z: 800, label: "Starter" },
      { x: 20, y: 52, z: 1500, label: "Basic" },
      { x: 26, y: 65, z: 2400, label: "Team" },
      { x: 34, y: 58, z: 3100, label: "Growth" },
      { x: 48, y: 82, z: 5200, label: "Business" },
      { x: 60, y: 74, z: 7000, label: "Scale" },
      { x: 72, y: 91, z: 9600, label: "Enterprise" },
      { x: 88, y: 86, z: 12800, label: "Enterprise+" },
    ],
  },
];

export default function BubbleChartDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ maxWidth: 520 }}>
        <BubbleChart
          series={plans}
          xLabel="Seats"
          yLabel="Satisfaction"
          zoomable
          valueFormat={(v) => v.toLocaleString()}
          onDataClick={(p) => setPicked(p)}
          ariaLabel="Interactive bubble chart with zoom and click"
        />
      </div>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        {picked ? (
          <>
            Clicked{" "}
            <strong style={{ color: "var(--color-text)" }}>
              {String(picked.point?.label ?? picked.series)}
            </strong>{" "}
            — {picked.z?.toLocaleString()} users at {picked.y}% satisfaction
          </>
        ) : (
          "Hover for details · click a bubble to select · drag to zoom"
        )}
      </div>
    </div>
  );
}
