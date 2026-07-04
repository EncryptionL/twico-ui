import React from "react";
import { Candlestick } from "twico-ui";

const weekly = [
  { label: "Mon", open: 132, high: 138, low: 130, close: 136 },
  { label: "Tue", open: 136, high: 141, low: 134, close: 135 },
  { label: "Wed", open: 135, high: 137, low: 128, close: 129 },
  { label: "Thu", open: 129, high: 133, low: 127, close: 132 },
  { label: "Fri", open: 132, high: 140, low: 131, close: 139 },
];

const variations = [
  {
    title: "Daily OHLC",
    description: "One candle per day with a dollar value formatter; up candles render green, down candles red.",
    code: `<Candlestick
  valueFormat={(v) => \`$\${v}\`}
  data={[
    { label: "Mon", open: 132, high: 138, low: 130, close: 136 },
    { label: "Tue", open: 136, high: 141, low: 134, close: 135 },
    { label: "Wed", open: 135, high: 137, low: 128, close: 129 },
    { label: "Thu", open: 129, high: 133, low: 127, close: 132 },
    { label: "Fri", open: 132, high: 140, low: 131, close: 139 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Candlestick data={weekly} valueFormat={(v) => `$${v}`} />
      </div>
    ),
  },
  {
    title: "Custom candle colors",
    description: "Override the direction colors with any CSS color to match a brand or a light-on-dark trading theme.",
    code: `<Candlestick
  upColor="#3b82f6"
  downColor="#f59e0b"
  valueFormat={(v) => \`$\${v}\`}
  data={[
    { label: "Mon", open: 132, high: 138, low: 130, close: 136 },
    { label: "Tue", open: 136, high: 141, low: 134, close: 135 },
    { label: "Wed", open: 135, high: 137, low: 128, close: 129 },
    { label: "Thu", open: 129, high: 133, low: 127, close: 132 },
    { label: "Fri", open: 132, high: 140, low: 131, close: 139 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Candlestick
          upColor="#3b82f6"
          downColor="#f59e0b"
          data={weekly}
          valueFormat={(v) => `$${v}`}
        />
      </div>
    ),
  },
  {
    title: "Minimal (no grid or axis)",
    description: "A compact chart with the grid and axis hidden and a shorter height, useful as an inline price glance.",
    code: `<Candlestick
  height={160}
  showGrid={false}
  showAxis={false}
  data={[
    { label: "Mon", open: 132, high: 138, low: 130, close: 136 },
    { label: "Tue", open: 136, high: 141, low: 134, close: 135 },
    { label: "Wed", open: 135, high: 137, low: 128, close: 129 },
    { label: "Thu", open: 129, high: 133, low: 127, close: 132 },
    { label: "Fri", open: 132, high: 140, low: 131, close: 139 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Candlestick
          height={160}
          showGrid={false}
          showAxis={false}
          data={weekly}
        />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every Candlestick-specific prop in one place: custom colors, height, grid/axis toggles, a value formatter, and an accessible name.",
    code: `<Candlestick
  data={[
    { label: "Mon", open: 132, high: 138, low: 130, close: 136 },
    { label: "Tue", open: 136, high: 141, low: 134, close: 135 },
    { label: "Wed", open: 135, high: 137, low: 128, close: 129 },
    { label: "Thu", open: 129, high: 133, low: 127, close: 132 },
    { label: "Fri", open: 132, high: 140, low: 131, close: 139 },
  ]}
  upColor="var(--color-success)"
  downColor="var(--color-danger)"
  height={300}
  showGrid={true}
  showAxis={true}
  valueFormat={(v) => \`$\${v}\`}
  ariaLabel="ACME weekly OHLC prices"
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Candlestick
          data={weekly}
          upColor="var(--color-success)"
          downColor="var(--color-danger)"
          height={300}
          showGrid={true}
          showAxis={true}
          valueFormat={(v) => `$${v}`}
          ariaLabel="ACME weekly OHLC prices"
        />
      </div>
    ),
  },
];

export default variations;
