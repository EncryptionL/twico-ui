import React from "react";
import { PolarAreaChart } from "twico-ui";

const hoursData = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 30 },
  { label: "Wed", value: 22 },
  { label: "Thu", value: 41 },
  { label: "Fri", value: 18 },
  { label: "Sat", value: 8 },
  { label: "Sun", value: 5 },
];

const windData = [
  { label: "N", value: 40 },
  { label: "NE", value: 55 },
  { label: "E", value: 65 },
  { label: "SE", value: 30 },
  { label: "S", value: 25 },
  { label: "SW", value: 45 },
  { label: "W", value: 80 },
  { label: "NW", value: 60 },
];

export default function PolarAreaChartDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ maxWidth: 520 }}>
          <PolarAreaChart
            data={hoursData}
            valueFormat={(v) => `${v}h`}
            onDataClick={(p) => setPicked(p)}
            ariaLabel="Focus hours by day of week"
          />
        </div>
        <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
          {picked ? (
            <>
              Clicked{" "}
              <strong style={{ color: "var(--color-text)" }}>{String(picked.label)}</strong> ={" "}
              {picked.value}h
            </>
          ) : (
            "Hover a slice for details · click to select"
          )}
        </div>
      </div>
      <div style={{ maxWidth: 520 }}>
        <PolarAreaChart
          data={windData}
          max={100}
          levels={5}
          startAngle={-22.5}
          showLegend={false}
          ariaLabel="Average wind speed by compass direction"
        />
      </div>
    </div>
  );
}
