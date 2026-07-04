import React from "react";
import { Sparkline } from "twico-ui";

const trend = [3, 5, 4, 8, 6, 9, 7, 12, 10, 14];

const variations = [
  {
    title: "Line (default)",
    description:
      "A smooth word-sized line with the trailing point emphasized by a dot.",
    code: `<Sparkline data={[3, 5, 4, 8, 6, 9, 7, 12, 10, 14]} showDots />`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Sparkline data={trend} showDots />
      </div>
    ),
  },
  {
    title: "Area",
    description:
      "The `area` shorthand fills the region below the line, here in a custom color.",
    code: `<Sparkline
  area
  color="var(--emerald-500)"
  data={[
    { value: 120, label: "Jan" },
    { value: 180, label: "Feb" },
    { value: 140, label: "Mar" },
    { value: 220, label: "Apr" },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Sparkline
          area
          color="var(--emerald-500)"
          data={[
            { value: 120, label: "Jan" },
            { value: 180, label: "Feb" },
            { value: 140, label: "Mar" },
            { value: 220, label: "Apr" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Bars",
    description:
      "`type=\"bar\"` draws thin columns instead of a line — good for discrete counts.",
    code: `<Sparkline type="bar" height={28} data={[4, 6, 2, 8, 5, 7, 3, 9]} />`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Sparkline type="bar" height={28} data={[4, 6, 2, 8, 5, 7, 3, 9]} />
      </div>
    ),
  },
  {
    title: "Stepped with pinned scale",
    description:
      "A stepped curve with the value scale pinned via `min`/`max` and a formatted accessible label.",
    code: `<Sparkline
  curve="stepped"
  color="var(--amber-500)"
  min={0}
  max={100}
  data={[20, 20, 45, 45, 30, 60, 60, 85]}
  valueFormat={(v) => \`\${v}%\`}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Sparkline
          curve="stepped"
          color="var(--amber-500)"
          min={0}
          max={100}
          data={[20, 20, 45, 45, 30, 60, 60, 85]}
          valueFormat={(v) => `${v}%`}
        />
      </div>
    ),
  },
];

export default variations;
