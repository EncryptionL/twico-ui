import React from "react";
import { PolarAreaChart } from "twico-ui";

const weekData = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 30 },
  { label: "Wed", value: 22 },
  { label: "Thu", value: 41 },
  { label: "Fri", value: 18 },
];

const windData = [
  { label: "N", value: 40 },
  { label: "E", value: 65 },
  { label: "S", value: 25 },
  { label: "W", value: 80 },
];

const salesData = [
  { label: "Direct", value: 34 },
  { label: "Referral", value: 22 },
  { label: "Social", value: 48 },
  { label: "Organic", value: 61 },
  { label: "Email", value: 17, color: "var(--rose-500)" },
];

const variations = [
  {
    title: "Default",
    description:
      "Equal-angle slices whose radius encodes each value, over concentric value rings.",
    code: `<PolarAreaChart
  data={[
    { label: "Mon", value: 12 },
    { label: "Tue", value: 30 },
    { label: "Wed", value: 22 },
    { label: "Thu", value: 41 },
    { label: "Fri", value: 18 },
  ]}
  valueFormat={(v) => \`\${v}h\`}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <PolarAreaChart data={weekData} valueFormat={(v) => `${v}h`} />
      </div>
    ),
  },
  {
    title: "Fixed max and rings",
    description:
      "Pin the outer ring with `max` and set the number of grid rings and value ticks with `levels`.",
    code: `<PolarAreaChart
  max={100}
  levels={5}
  startAngle={-90}
  showLegend={false}
  data={[
    { label: "N", value: 40 },
    { label: "E", value: 65 },
    { label: "S", value: 25 },
    { label: "W", value: 80 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <PolarAreaChart
          max={100}
          levels={5}
          startAngle={-90}
          showLegend={false}
          data={windData}
        />
      </div>
    ),
  },
  {
    title: "Custom colors and per-slice override",
    description:
      "Supply a palette with `colors` (cycled across slices); a single datum can pin its own `color`.",
    code: `<PolarAreaChart
  colors={["#6366f1", "#10b981", "#f59e0b", "#06b6d4"]}
  data={[
    { label: "Direct", value: 34 },
    { label: "Referral", value: 22 },
    { label: "Social", value: 48 },
    { label: "Organic", value: 61 },
    { label: "Email", value: 17, color: "var(--rose-500)" },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <PolarAreaChart
          colors={["#6366f1", "#10b981", "#f59e0b", "#06b6d4"]}
          data={salesData}
        />
      </div>
    ),
  },
];

export default variations;
