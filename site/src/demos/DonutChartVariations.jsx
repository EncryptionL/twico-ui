import React from "react";
import { DonutChart } from "twico-ui";

const trafficData = [
  { label: "Direct", value: 42 },
  { label: "Referral", value: 28 },
  { label: "Social", value: 18 },
  { label: "Organic", value: 12 },
];

const storageData = [
  { label: "Documents", value: 320 },
  { label: "Photos", value: 210 },
  { label: "Videos", value: 140 },
  { label: "Other", value: 90 },
];

const variations = [
  {
    title: "Default donut",
    description:
      "A ring of proportional slices with the formatted total shown in the center and a legend below.",
    code: `<DonutChart
  data={[
    { label: "Direct", value: 42 },
    { label: "Referral", value: 28 },
    { label: "Social", value: 18 },
    { label: "Organic", value: 12 },
  ]}
  centerLabel="Traffic"
  valueFormat={(v) => \`\${v}%\`}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <DonutChart
          data={trafficData}
          centerLabel="Traffic"
          valueFormat={(v) => `${v}%`}
        />
      </div>
    ),
  },
  {
    title: "Percentage labels",
    description:
      "Turn on showLabels to draw each slice's percentage share directly on the ring.",
    code: `<DonutChart
  data={[
    { label: "Documents", value: 320 },
    { label: "Photos", value: 210 },
    { label: "Videos", value: 140 },
    { label: "Other", value: 90 },
  ]}
  showLabels
  centerLabel="760 GB"
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <DonutChart data={storageData} showLabels centerLabel="760 GB" />
      </div>
    ),
  },
  {
    title: "Custom colors and thinner ring",
    description:
      "Override the palette with colors and shrink the hole via innerRadius for a chunkier ring.",
    code: `<DonutChart
  data={[
    { label: "Documents", value: 320 },
    { label: "Photos", value: 210 },
    { label: "Videos", value: 140 },
    { label: "Other", value: 90 },
  ]}
  innerRadius={0.45}
  padAngle={2}
  colors={["#6366f1", "#10b981", "#f59e0b", "#ef4444"]}
  valueFormat={(v) => \`\${v} GB\`}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <DonutChart
          data={storageData}
          innerRadius={0.45}
          padAngle={2}
          colors={["#6366f1", "#10b981", "#f59e0b", "#ef4444"]}
          valueFormat={(v) => `${v} GB`}
        />
      </div>
    ),
  },
  {
    title: "Solid pie fallback",
    description:
      "Pass donut={false} to render the same data as a filled pie with the legend hidden.",
    code: `<DonutChart
  data={[
    { label: "Direct", value: 42 },
    { label: "Referral", value: 28 },
    { label: "Social", value: 18 },
    { label: "Organic", value: 12 },
  ]}
  donut={false}
  showLegend={false}
  ariaLabel="Traffic sources"
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <DonutChart
          data={trafficData}
          donut={false}
          showLegend={false}
          ariaLabel="Traffic sources"
        />
      </div>
    ),
  },
];

export default variations;
