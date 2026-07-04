import React from "react";
import { RadarChart } from "twico-ui";

const skillData = [
  { label: "Speed", value: 80 },
  { label: "Power", value: 60 },
  { label: "Range", value: 70 },
  { label: "Defense", value: 85 },
  { label: "Control", value: 50 },
];

const teamData = [
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

const variations = [
  {
    title: "Single series",
    description: "One polygon over a shared set of categorical axes.",
    code: `<RadarChart
  data={[
    { label: "Speed", value: 80 },
    { label: "Power", value: 60 },
    { label: "Range", value: 70 },
    { label: "Defense", value: 85 },
    { label: "Control", value: 50 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <RadarChart data={skillData} />
      </div>
    ),
  },
  {
    title: "Multiple series with legend",
    description:
      "Overlay two series as separate polygons to compare profiles; the legend turns on automatically past one series.",
    code: `<RadarChart
  series={["team", "rival"]}
  showLegend
  data={[
    { label: "Speed", team: 80, rival: 65 },
    { label: "Power", team: 60, rival: 90 },
    { label: "Range", team: 70, rival: 55 },
    { label: "Defense", team: 85, rival: 60 },
    { label: "Control", team: 50, rival: 75 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <RadarChart series={["team", "rival"]} showLegend data={teamData} />
      </div>
    ),
  },
  {
    title: "Fixed scale and rings",
    description:
      "Pin the outer ring with max and set the number of concentric grid levels for a scored profile.",
    code: `<RadarChart
  series={["score"]}
  max={100}
  levels={5}
  valueFormat={(v) => \`\${v}/100\`}
  data={[
    { label: "Design", score: 92 },
    { label: "Perf", score: 74 },
    { label: "A11y", score: 88 },
    { label: "SEO", score: 81 },
    { label: "Best practices", score: 95 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <RadarChart
          series={["score"]}
          max={100}
          levels={5}
          valueFormat={(v) => `${v}/100`}
          data={scoreData}
        />
      </div>
    ),
  },
  {
    title: "Outline only",
    description:
      "Drop the low-opacity fill and vertex dots, and set custom colors, for a clean stroked outline.",
    code: `<RadarChart
  series={["team", "rival"]}
  fill={false}
  showDots={false}
  colors={["#6366f1", "#10b981"]}
  data={[
    { label: "Speed", team: 80, rival: 65 },
    { label: "Power", team: 60, rival: 90 },
    { label: "Range", team: 70, rival: 55 },
    { label: "Defense", team: 85, rival: 60 },
    { label: "Control", team: 50, rival: 75 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <RadarChart
          series={["team", "rival"]}
          fill={false}
          showDots={false}
          colors={["#6366f1", "#10b981"]}
          data={teamData}
        />
      </div>
    ),
  },
];

export default variations;
