import React from "react";
import { PieChart } from "twico-ui";

const trafficData = [
  { label: "Direct", value: 340 },
  { label: "Referral", value: 210 },
  { label: "Social", value: 120 },
  { label: "Email", value: 75 },
];

export default function PieChartDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ maxWidth: 520 }}>
        <PieChart
          donut
          showLabels
          data={trafficData}
          centerLabel="745"
          onDataClick={(p) => setPicked(p)}
          ariaLabel="Interactive traffic-source donut chart"
        />
      </div>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        {picked ? (
          <>
            Clicked{" "}
            <strong style={{ color: "var(--color-text)" }}>{String(picked.label)}</strong> ={" "}
            {picked.value} ({picked.percent}%)
          </>
        ) : (
          "Hover a slice for details · click to select"
        )}
      </div>
    </div>
  );
}
