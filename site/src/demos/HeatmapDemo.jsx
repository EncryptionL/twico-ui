import React from "react";
import { Heatmap } from "twico-ui";

const activity = [
  { x: "9a", y: "Mon", value: 12 }, { x: "12p", y: "Mon", value: 48 }, { x: "3p", y: "Mon", value: 30 }, { x: "6p", y: "Mon", value: 18 },
  { x: "9a", y: "Tue", value: 20 }, { x: "12p", y: "Tue", value: 62 }, { x: "3p", y: "Tue", value: 41 }, { x: "6p", y: "Tue", value: 24 },
  { x: "9a", y: "Wed", value: 16 }, { x: "12p", y: "Wed", value: 55 }, { x: "3p", y: "Wed", value: 38 }, { x: "6p", y: "Wed", value: 22 },
  { x: "9a", y: "Thu", value: 28 }, { x: "12p", y: "Thu", value: 70 }, { x: "3p", y: "Thu", value: 52 }, { x: "6p", y: "Thu", value: 31 },
  { x: "9a", y: "Fri", value: 34 }, { x: "12p", y: "Fri", value: 58 }, { x: "3p", y: "Fri", value: 44 }, { x: "6p", y: "Fri", value: 26 },
];

export default function HeatmapDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ maxWidth: 520 }}>
        <Heatmap xLabel="Hour" yLabel="Day" data={activity} />
      </div>
      <div style={{ maxWidth: 520 }}>
        <Heatmap
          showValues
          colorScale="var(--emerald-500)"
          valueFormat={(v) => `${v}%`}
          data={activity}
        />
      </div>
    </div>
  );
}
