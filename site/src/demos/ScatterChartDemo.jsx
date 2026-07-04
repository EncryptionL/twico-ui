import React from "react";
import { ScatterChart } from "twico-ui";

const groups = [
  {
    name: "Control",
    points: [
      { x: 12, y: 30 },
      { x: 20, y: 45 },
      { x: 28, y: 38 },
      { x: 34, y: 55, label: "outlier" },
      { x: 41, y: 49 },
    ],
  },
  {
    name: "Treatment",
    points: [
      { x: 15, y: 22 },
      { x: 24, y: 28 },
      { x: 30, y: 34 },
      { x: 38, y: 31 },
      { x: 46, y: 40 },
    ],
  },
];

const markets = [
  {
    name: "Markets",
    points: [
      { x: 40, y: 12, z: 900, label: "US" },
      { x: 22, y: 30, z: 400, label: "EU" },
      { x: 55, y: 20, z: 650, label: "APAC" },
      { x: 30, y: 42, z: 250, label: "LATAM" },
    ],
  },
];

export default function ScatterChartDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ maxWidth: 520 }}>
        <ScatterChart series={groups} xLabel="Weight (kg)" yLabel="Score" />
      </div>
      <div style={{ maxWidth: 520 }}>
        <ScatterChart
          series={markets}
          maxBubble={32}
          xLabel="Reach"
          yLabel="Growth"
          valueFormat={(v) => v.toLocaleString()}
        />
      </div>
    </div>
  );
}
