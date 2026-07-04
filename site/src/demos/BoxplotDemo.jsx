import React from "react";
import { Boxplot } from "twico-ui";

const latencyData = [
  { label: "API", min: 12, q1: 24, median: 33, q3: 42, max: 58, outliers: [72] },
  { label: "Web", min: 18, q1: 30, median: 41, q3: 52, max: 66 },
  { label: "Cache", min: 8, q1: 20, median: 27, q3: 38, max: 49, outliers: [2, 63] },
];

export default function BoxplotDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ maxWidth: 520 }}>
        <Boxplot data={latencyData} valueFormat={(v) => `${v}ms`} />
      </div>
    </div>
  );
}
