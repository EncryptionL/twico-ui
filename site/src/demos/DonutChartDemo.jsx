import React from "react";
import { DonutChart } from "twico-ui";

const trafficData = [
  { label: "Direct", value: 42 },
  { label: "Referral", value: 28 },
  { label: "Social", value: 18 },
  { label: "Organic", value: 12 },
];

export default function DonutChartDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ maxWidth: 520 }}>
        <DonutChart
          data={trafficData}
          centerLabel="Traffic"
          valueFormat={(v) => `${v}%`}
        />
      </div>
    </div>
  );
}
