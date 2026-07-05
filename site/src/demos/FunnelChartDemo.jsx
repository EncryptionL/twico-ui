import React from "react";
import { FunnelChart } from "twico-ui";

const conversionData = [
  { label: "Visits", value: 8200 },
  { label: "Signups", value: 4100 },
  { label: "Trials", value: 1600 },
  { label: "Paid", value: 540 },
];

export default function FunnelChartDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ maxWidth: 520 }}>
        <FunnelChart
          data={conversionData}
          valueFormat={(v) => v.toLocaleString()}
          onDataClick={(p) => setPicked(p)}
          ariaLabel="Interactive conversion funnel"
        />
      </div>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        {picked ? (
          <>
            Clicked{" "}
            <strong style={{ color: "var(--color-text)" }}>{String(picked.label)}</strong> ={" "}
            {picked.value.toLocaleString()} ({picked.percent.toFixed(0)}% of top)
          </>
        ) : (
          "Hover for details · click a stage to select"
        )}
      </div>
    </div>
  );
}
