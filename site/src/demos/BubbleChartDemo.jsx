import React from "react";
import { BubbleChart } from "twico-ui";

const plans = [
  {
    name: "Plans",
    points: [
      { x: 12, y: 40, z: 800, label: "Starter" },
      { x: 26, y: 65, z: 2400, label: "Team" },
      { x: 48, y: 82, z: 5200, label: "Business" },
      { x: 72, y: 91, z: 9600, label: "Enterprise" },
    ],
  },
];

export default function BubbleChartDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ maxWidth: 520 }}>
        <BubbleChart
          series={plans}
          xLabel="Seats"
          yLabel="Satisfaction"
          valueFormat={(v) => v.toLocaleString()}
        />
      </div>
    </div>
  );
}
