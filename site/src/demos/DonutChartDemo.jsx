import React from "react";
import { DonutChart } from "twico-ui";

const trafficData = [
  { label: "Direct", value: 42 },
  { label: "Referral", value: 28 },
  { label: "Social", value: 18 },
  { label: "Organic", value: 12 },
];

export default function DonutChartDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ maxWidth: 520 }}>
        <DonutChart
          data={trafficData}
          centerLabel="Traffic"
          valueFormat={(v) => `${v}%`}
          onDataClick={(p) => setPicked(p)}
          ariaLabel="Interactive donut chart of traffic sources"
        />
      </div>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        {picked ? (
          <>
            Clicked{" "}
            <strong style={{ color: "var(--color-text)" }}>{String(picked.label)}</strong> ={" "}
            {picked.value}% ({picked.percent}% of total)
          </>
        ) : (
          "Hover a slice for details · click to select"
        )}
      </div>
    </div>
  );
}
