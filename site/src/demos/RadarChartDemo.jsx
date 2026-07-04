import React from "react";
import { RadarChart } from "twico-ui";

const skillData = [
  { label: "Speed", team: 80, rival: 65 },
  { label: "Power", team: 60, rival: 90 },
  { label: "Range", team: 70, rival: 55 },
  { label: "Defense", team: 85, rival: 60 },
  { label: "Control", team: 50, rival: 75 },
];

const scoreData = [
  { label: "Design", score: 92 },
  { label: "Perf", score: 74 },
  { label: "A11y", score: 88 },
  { label: "SEO", score: 81 },
  { label: "Best practices", score: 95 },
];

export default function RadarChartDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ maxWidth: 520 }}>
        <RadarChart series={["team", "rival"]} showLegend data={skillData} />
      </div>
      <div style={{ maxWidth: 520 }}>
        <RadarChart
          series={["score"]}
          max={100}
          levels={5}
          valueFormat={(v) => `${v}/100`}
          data={scoreData}
        />
      </div>
    </div>
  );
}
