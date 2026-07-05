import React from "react";
import { PieChart } from "twico-ui";

const trafficData = [
  { label: "Direct", value: 340 },
  { label: "Referral", value: 210 },
  { label: "Social", value: 120 },
  { label: "Email", value: 75 },
];

const statusData = [
  { label: "Done", value: 62, color: "var(--emerald-500)" },
  { label: "In progress", value: 28 },
  { label: "Blocked", value: 10 },
];

const budgetData = [
  { label: "Engineering", value: 48 },
  { label: "Sales", value: 22 },
  { label: "Marketing", value: 18 },
  { label: "Support", value: 12 },
];

const variations = [
  {
    title: "Pie chart",
    description: "A solid pie of a single value series, with the legend below.",
    code: `<PieChart
  data={[
    { label: "Direct", value: 340 },
    { label: "Referral", value: 210 },
    { label: "Social", value: 120 },
    { label: "Email", value: 75 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <PieChart data={trafficData} />
      </div>
    ),
  },
  {
    title: "Donut with center label",
    description:
      "Render as a ring and show a summary in the hole; per-slice colors override the palette.",
    code: `<PieChart
  donut
  showLabels
  centerLabel="100%"
  data={[
    { label: "Done", value: 62, color: "var(--emerald-500)" },
    { label: "In progress", value: 28 },
    { label: "Blocked", value: 10 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <PieChart donut showLabels centerLabel="100%" data={statusData} />
      </div>
    ),
  },
  {
    title: "Percentage labels + custom colors",
    description:
      "Draw the share on each slice and supply your own cycled palette and value formatter.",
    code: `<PieChart
  showLabels
  colors={["#6366f1", "#10b981", "#f59e0b", "#ef4444"]}
  valueFormat={(v) => \`\${v}%\`}
  data={[
    { label: "Engineering", value: 48 },
    { label: "Sales", value: 22 },
    { label: "Marketing", value: 18 },
    { label: "Support", value: 12 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <PieChart
          showLabels
          colors={["#6366f1", "#10b981", "#f59e0b", "#ef4444"]}
          valueFormat={(v) => `${v}%`}
          data={budgetData}
        />
      </div>
    ),
  },
  {
    title: "Gapped slices with a start angle",
    description:
      "A donut with a padded gap between slices, an inner radius, and the first slice rotated.",
    code: `<PieChart
  innerRadius={0.7}
  padAngle={2}
  startAngle={-90}
  data={[
    { label: "Direct", value: 340 },
    { label: "Referral", value: 210 },
    { label: "Social", value: 120 },
    { label: "Email", value: 75 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <PieChart
          innerRadius={0.7}
          padAngle={2}
          startAngle={-90}
          data={trafficData}
        />
      </div>
    ),
  },
];

export default variations;
