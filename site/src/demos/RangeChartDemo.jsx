import React from "react";
import { RangeChart } from "twico-ui";

const timeline = [
  { label: "Design", min: 0, max: 4 },
  { label: "Build", min: 3, max: 9, color: "var(--sky-500)" },
  { label: "QA", min: 8, max: 11 },
  { label: "Launch", min: 10, max: 12 },
];

const tempBand = [
  { label: "Mon", min: 12, max: 20 },
  { label: "Tue", min: 14, max: 24 },
  { label: "Wed", min: 11, max: 19 },
  { label: "Thu", min: 13, max: 22 },
  { label: "Fri", min: 15, max: 26 },
];

export default function RangeChartDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ maxWidth: 520 }}>
        <RangeChart
          type="bar"
          data={timeline}
          valueFormat={(v) => `wk ${v}`}
        />
      </div>
      <div style={{ maxWidth: 520 }}>
        <RangeChart
          type="area"
          data={tempBand}
          valueFormat={(v) => `${v}°`}
        />
      </div>
    </div>
  );
}
