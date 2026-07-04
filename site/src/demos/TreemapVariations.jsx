import React from "react";
import { Treemap } from "twico-ui";

const spendData = [
  { label: "Compute", value: 4200 },
  { label: "Storage", value: 2600 },
  { label: "Network", value: 1800 },
  { label: "Database", value: 1500 },
  { label: "Other", value: 700 },
];

const storageData = [
  { label: "Photos", value: 128 },
  { label: "Videos", value: 96 },
  { label: "Documents", value: 42 },
  { label: "Backups", value: 30 },
  { label: "Apps", value: 18 },
  { label: "System", value: 12, color: "var(--slate-500)" },
];

const variations = [
  {
    title: "Default",
    description: "A squarified treemap sized by value, with labels and values inside tiles that fit.",
    code: `<Treemap
  ariaLabel="Cloud spend by service"
  valueFormat={(v) => \`$\${v.toLocaleString()}\`}
  data={[
    { label: "Compute", value: 4200 },
    { label: "Storage", value: 2600 },
    { label: "Network", value: 1800 },
    { label: "Database", value: 1500 },
    { label: "Other", value: 700 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Treemap
          data={spendData}
          ariaLabel="Cloud spend by service"
          valueFormat={(v) => `$${v.toLocaleString()}`}
        />
      </div>
    ),
  },
  {
    title: "Per-tile color",
    description: "A datum's own color overrides the cycled palette — here the System tile is muted slate.",
    code: `<Treemap
  height={260}
  valueFormat={(v) => \`\${v} GB\`}
  data={[
    { label: "Photos", value: 128 },
    { label: "Videos", value: 96 },
    { label: "Documents", value: 42 },
    { label: "Backups", value: 30 },
    { label: "Apps", value: 18 },
    { label: "System", value: 12, color: "var(--slate-500)" },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Treemap
          data={storageData}
          height={260}
          valueFormat={(v) => `${v} GB`}
        />
      </div>
    ),
  },
  {
    title: "Labels only",
    description: "Turn off in-tile values with showValues={false} for a cleaner look; values stay in the hover tooltip.",
    code: `<Treemap
  showValues={false}
  gap={4}
  ariaLabel="Cloud spend by service"
  data={[
    { label: "Compute", value: 4200 },
    { label: "Storage", value: 2600 },
    { label: "Network", value: 1800 },
    { label: "Database", value: 1500 },
    { label: "Other", value: 700 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Treemap
          data={spendData}
          showValues={false}
          gap={4}
          ariaLabel="Cloud spend by service"
        />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every Treemap-specific prop in one place: custom colors, height, gap, a value formatter, an accessible name, and the in-tile value + data-table toggles.",
    code: `<Treemap
  data={[
    { label: "Compute", value: 4200 },
    { label: "Storage", value: 2600 },
    { label: "Network", value: 1800 },
    { label: "Database", value: 1500 },
    { label: "Other", value: 700 },
  ]}
  showValues={true}
  height={300}
  gap={2}
  colors={["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]}
  valueFormat={(v) => \`$\${v.toLocaleString()}\`}
  ariaLabel="Cloud spend by service"
  tableFallback={true}
  caption="Monthly cloud spend, by service"
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Treemap
          data={spendData}
          showValues={true}
          height={300}
          gap={2}
          colors={["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]}
          valueFormat={(v) => `$${v.toLocaleString()}`}
          ariaLabel="Cloud spend by service"
          tableFallback={true}
          caption="Monthly cloud spend, by service"
        />
      </div>
    ),
  },
];

export default variations;
