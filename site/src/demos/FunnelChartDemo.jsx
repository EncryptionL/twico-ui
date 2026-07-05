import React from "react";
import { FunnelChart } from "twico-ui";

const conversionData = [
  { label: "Visits", value: 8200 },
  { label: "Signups", value: 4100 },
  { label: "Trials", value: 1600 },
  { label: "Paid", value: 540 },
];

export default function FunnelChartDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ maxWidth: 520 }}>
        <FunnelChart
          data={conversionData}
          valueFormat={(v) => v.toLocaleString()}
        />
      </div>
    </div>
  );
}
