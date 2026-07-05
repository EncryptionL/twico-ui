import React from "react";
import { Gauge } from "twico-ui";

export default function GaugeDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        <Gauge value={72} label="CPU" valueFormat={(n) => `${Math.round(n)}%`} />
        <Gauge
          value={4.6}
          min={0}
          max={5}
          startAngle={-90}
          endAngle={90}
          label="Rating"
        />
      </div>
      <div style={{ maxWidth: 260 }}>
        <Gauge
          size={220}
          series={[
            { value: 82, label: "Complete", color: "var(--emerald-500)" },
            { value: 54, label: "In review" },
            { value: 23, label: "Blocked" },
          ]}
        />
      </div>
    </div>
  );
}
