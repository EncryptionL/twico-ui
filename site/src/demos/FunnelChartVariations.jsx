import React from "react";
import { FunnelChart } from "twico-ui";

const conversionData = [
  { label: "Visits", value: 8200 },
  { label: "Signups", value: 4100 },
  { label: "Trials", value: 1600 },
  { label: "Paid", value: 540 },
];

const salesData = [
  { label: "Leads", value: 500, color: "var(--sky-500)" },
  { label: "Qualified", value: 320 },
  { label: "Won", value: 90 },
];

const variations = [
  {
    title: "Conversion funnel",
    description:
      "Descending stages with each band's value and its percentage of the top stage.",
    code: `<FunnelChart
  data={[
    { label: "Visits", value: 8200 },
    { label: "Signups", value: 4100 },
    { label: "Trials", value: 1600 },
    { label: "Paid", value: 540 },
  ]}
  valueFormat={(v) => v.toLocaleString()}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <FunnelChart
          data={conversionData}
          valueFormat={(v) => v.toLocaleString()}
        />
      </div>
    ),
  },
  {
    title: "Horizontal layout",
    description:
      "Lay the funnel out left→right with percentages hidden and a per-stage color override.",
    code: `<FunnelChart
  horizontal
  showPercent={false}
  height={220}
  data={[
    { label: "Leads", value: 500, color: "var(--sky-500)" },
    { label: "Qualified", value: 320 },
    { label: "Won", value: 90 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <FunnelChart
          horizontal
          showPercent={false}
          height={220}
          data={salesData}
        />
      </div>
    ),
  },
  {
    title: "Custom palette",
    description:
      "Supply a `colors` array (cycled when shorter than the data) instead of the token palette.",
    code: `<FunnelChart
  colors={["#6366f1", "#8b5cf6", "#a855f7", "#d946ef"]}
  data={[
    { label: "Visits", value: 8200 },
    { label: "Signups", value: 4100 },
    { label: "Trials", value: 1600 },
    { label: "Paid", value: 540 },
  ]}
  valueFormat={(v) => v.toLocaleString()}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <FunnelChart
          colors={["#6366f1", "#8b5cf6", "#a855f7", "#d946ef"]}
          data={conversionData}
          valueFormat={(v) => v.toLocaleString()}
        />
      </div>
    ),
  },
  {
    title: "Values only",
    description:
      "Hide the per-stage percentage and keep just the formatted values in each caption.",
    code: `<FunnelChart
  showPercent={false}
  gap={6}
  data={[
    { label: "Visits", value: 8200 },
    { label: "Signups", value: 4100 },
    { label: "Trials", value: 1600 },
    { label: "Paid", value: 540 },
  ]}
  valueFormat={(v) => v.toLocaleString()}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <FunnelChart
          showPercent={false}
          gap={6}
          data={conversionData}
          valueFormat={(v) => v.toLocaleString()}
        />
      </div>
    ),
  },
];

export default variations;
