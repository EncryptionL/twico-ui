import React from "react";
import { PieChart } from "twico-ui";

const trafficData = [
  { label: "Direct", value: 340 },
  { label: "Referral", value: 210 },
  { label: "Social", value: 120 },
  { label: "Email", value: 75 },
];

const statusData = [
  { label: "Done", value: 62, color: "var(--emerald-500)" },
  { label: "In progress", value: 28 },
  { label: "Blocked", value: 10 },
];

export default function PieChartDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ maxWidth: 520 }}>
        <PieChart data={trafficData} />
      </div>
      <div style={{ maxWidth: 520 }}>
        <PieChart donut showLabels data={statusData} centerLabel="100%" />
      </div>
    </div>
  );
}
