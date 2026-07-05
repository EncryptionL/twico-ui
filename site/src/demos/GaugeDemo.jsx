import React from "react";
import { Gauge } from "twico-ui";

const projectRings = [
  { value: 82, label: "Complete", color: "var(--emerald-500)" },
  { value: 54, label: "In review" },
  { value: 23, label: "Blocked" },
];

export default function GaugeDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 520 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
        <Gauge
          value={72}
          label="CPU"
          valueFormat={(n) => `${Math.round(n)}%`}
          onDataClick={(p) => setPicked(p)}
        />
        <div style={{ maxWidth: 260 }}>
          <Gauge
            size={220}
            series={projectRings}
            onDataClick={(p) => setPicked(p)}
          />
        </div>
      </div>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        {picked
          ? <>Clicked <strong style={{ color: "var(--color-text)" }}>{String(picked.label ?? `Ring ${picked.index + 1}`)}</strong> = {picked.value}</>
          : "Hover for details · click a ring to select"}
      </div>
    </div>
  );
}
