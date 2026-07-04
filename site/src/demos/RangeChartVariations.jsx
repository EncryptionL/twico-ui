import React from "react";
import { RangeChart } from "twico-ui";

const timeline = [
  { label: "Design", min: 0, max: 4 },
  { label: "Build", min: 3, max: 9, color: "var(--sky-500)" },
  { label: "QA", min: 8, max: 11 },
  { label: "Launch", min: 10, max: 12 },
];

const tempBand = [
  { label: "Mon", min: 12, max: 20 },
  { label: "Tue", min: 14, max: 24 },
  { label: "Wed", min: 11, max: 19 },
  { label: "Thu", min: 13, max: 22 },
  { label: "Fri", min: 15, max: 26 },
];

const priceBand = [
  { label: "Q1", min: -4, max: 8 },
  { label: "Q2", min: 2, max: 14 },
  { label: "Q3", min: 6, max: 18 },
  { label: "Q4", min: 3, max: 12 },
];

const variations = [
  {
    title: "Range bar (timeline / Gantt)",
    description: "Horizontal min→max bars, one per row — a lightweight project timeline.",
    code: `<RangeChart
  type="bar"
  data={[
    { label: "Design", min: 0, max: 4 },
    { label: "Build", min: 3, max: 9, color: "var(--sky-500)" },
    { label: "QA", min: 8, max: 11 },
    { label: "Launch", min: 10, max: 12 },
  ]}
  valueFormat={(v) => \`wk \${v}\`}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <RangeChart type="bar" data={timeline} valueFormat={(v) => `wk ${v}`} />
      </div>
    ),
  },
  {
    title: "Range area (min–max band)",
    description: "A shaded band between a per-category min line and max line across categories.",
    code: `<RangeChart
  type="area"
  data={[
    { label: "Mon", min: 12, max: 20 },
    { label: "Tue", min: 14, max: 24 },
    { label: "Wed", min: 11, max: 19 },
    { label: "Thu", min: 13, max: 22 },
    { label: "Fri", min: 15, max: 26 },
  ]}
  valueFormat={(v) => \`\${v}°\`}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <RangeChart type="area" data={tempBand} valueFormat={(v) => `${v}°`} />
      </div>
    ),
  },
  {
    title: "Negative-safe axis",
    description: "Ranges aren't anchored at 0 — the value axis auto-scales to span negative and positive bounds.",
    code: `<RangeChart
  type="bar"
  data={[
    { label: "Q1", min: -4, max: 8 },
    { label: "Q2", min: 2, max: 14 },
    { label: "Q3", min: 6, max: 18 },
    { label: "Q4", min: 3, max: 12 },
  ]}
  valueFormat={(v) => \`\${v}°C\`}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <RangeChart type="bar" data={priceBand} valueFormat={(v) => `${v}°C`} />
      </div>
    ),
  },
  {
    title: "Minimal (no grid or axis)",
    description: "A compact band with the grid, axis and data-table fallback pared back and a custom height.",
    code: `<RangeChart
  type="area"
  height={160}
  showGrid={false}
  showAxis={false}
  colors={["var(--emerald-500)"]}
  data={[
    { label: "Mon", min: 12, max: 20 },
    { label: "Tue", min: 14, max: 24 },
    { label: "Wed", min: 11, max: 19 },
    { label: "Thu", min: 13, max: 22 },
    { label: "Fri", min: 15, max: 26 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <RangeChart
          type="area"
          height={160}
          showGrid={false}
          showAxis={false}
          colors={["var(--emerald-500)"]}
          data={tempBand}
        />
      </div>
    ),
  },
];

export default variations;
