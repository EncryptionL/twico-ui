import React from "react";
import { Boxplot } from "twico-ui";

const latencyData = [
  { label: "API", min: 12, q1: 24, median: 33, q3: 42, max: 58, outliers: [72] },
  { label: "Web", min: 18, q1: 30, median: 41, q3: 52, max: 66 },
  { label: "Cache", min: 8, q1: 20, median: 27, q3: 38, max: 49, outliers: [2, 63] },
];

const scoreData = [
  { label: "Q1", min: 55, q1: 68, median: 74, q3: 82, max: 91 },
  { label: "Q2", min: 60, q1: 71, median: 78, q3: 85, max: 96 },
  { label: "Q3", min: 52, q1: 66, median: 73, q3: 80, max: 88 },
  { label: "Q4", min: 63, q1: 74, median: 81, q3: 88, max: 99 },
];

const variations = [
  {
    title: "Basic box plot",
    description: "One box per category summarising a five-number distribution, with outliers drawn beyond the whiskers.",
    code: `<Boxplot
  data={[
    { label: "API", min: 12, q1: 24, median: 33, q3: 42, max: 58, outliers: [72] },
    { label: "Web", min: 18, q1: 30, median: 41, q3: 52, max: 66 },
    { label: "Cache", min: 8, q1: 20, median: 27, q3: 38, max: 49, outliers: [2, 63] },
  ]}
  valueFormat={(v) => \`\${v}ms\`}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Boxplot data={latencyData} valueFormat={(v) => `${v}ms`} />
      </div>
    ),
  },
  {
    title: "Custom color",
    description: "Recolor the box fill and stroke accent with any CSS color; here a set of quarterly test scores.",
    code: `<Boxplot
  color="#10b981"
  data={[
    { label: "Q1", min: 55, q1: 68, median: 74, q3: 82, max: 91 },
    { label: "Q2", min: 60, q1: 71, median: 78, q3: 85, max: 96 },
    { label: "Q3", min: 52, q1: 66, median: 73, q3: 80, max: 88 },
    { label: "Q4", min: 63, q1: 74, median: 81, q3: 88, max: 99 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Boxplot color="#10b981" data={scoreData} />
      </div>
    ),
  },
  {
    title: "Minimal (no grid or axis)",
    description: "Hide the grid and axis and set a compact height for a dense, glanceable summary.",
    code: `<Boxplot
  height={160}
  showGrid={false}
  showAxis={false}
  data={[
    { label: "API", min: 12, q1: 24, median: 33, q3: 42, max: 58, outliers: [72] },
    { label: "Web", min: 18, q1: 30, median: 41, q3: 52, max: 66 },
    { label: "Cache", min: 8, q1: 20, median: 27, q3: 38, max: 49, outliers: [2, 63] },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Boxplot
          height={160}
          showGrid={false}
          showAxis={false}
          data={latencyData}
        />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every Boxplot-specific prop in one place: custom color and height, a value formatter, an accessible name and caption, and the grid/axis/table toggles.",
    code: `<Boxplot
  data={[
    { label: "API", min: 12, q1: 24, median: 33, q3: 42, max: 58, outliers: [72] },
    { label: "Web", min: 18, q1: 30, median: 41, q3: 52, max: 66 },
    { label: "Cache", min: 8, q1: 20, median: 27, q3: 38, max: 49, outliers: [2, 63] },
  ]}
  color="var(--color-primary)"
  height={300}
  showGrid={true}
  showAxis={true}
  valueFormat={(v) => \`\${v}ms\`}
  ariaLabel="Request latency distribution by service"
  tableFallback={true}
  caption="Request latency (ms) by service"
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Boxplot
          data={latencyData}
          color="var(--color-primary)"
          height={300}
          showGrid={true}
          showAxis={true}
          valueFormat={(v) => `${v}ms`}
          ariaLabel="Request latency distribution by service"
          tableFallback={true}
          caption="Request latency (ms) by service"
        />
      </div>
    ),
  },
];

export default variations;
