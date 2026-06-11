import React from "react";
import { Chart } from "twico-ui";

const barData = [
  { label: "Mon", value: 240 },
  { label: "Tue", value: 310 },
  { label: "Wed", value: 280 },
  { label: "Thu", value: 360 },
];

const lineData = [
  { label: "Jan", signups: 120, active: 80 },
  { label: "Feb", signups: 180, active: 140 },
  { label: "Mar", signups: 150, active: 120 },
];

export default function ChartDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Chart type="bar" data={barData} valueFormat={(v) => `$${v}`} />
      <Chart
        type="line"
        series={["signups", "active"]}
        showLegend
        data={lineData}
      />
    </div>
  );
}
