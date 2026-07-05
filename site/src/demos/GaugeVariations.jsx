import React from "react";
import { Gauge } from "twico-ui";

const variations = [
  {
    title: "Default gauge",
    description: "A single value mapped onto the default -110°..110° arc with a centered readout.",
    code: `<Gauge
  value={72}
  label="CPU"
  valueFormat={(n) => \`\${Math.round(n)}%\`}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Gauge value={72} label="CPU" valueFormat={(n) => `${Math.round(n)}%`} />
      </div>
    ),
  },
  {
    title: "Custom domain and sweep",
    description: "A half-circle gauge over a 0..5 rating domain with custom start and end angles.",
    code: `<Gauge
  value={4.6}
  min={0}
  max={5}
  startAngle={-90}
  endAngle={90}
  label="Rating"
  valueFormat={(n) => n.toFixed(1)}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Gauge
          value={4.6}
          min={0}
          max={5}
          startAngle={-90}
          endAngle={90}
          label="Rating"
          valueFormat={(n) => n.toFixed(1)}
        />
      </div>
    ),
  },
  {
    title: "Multi-ring (radial bar)",
    description: "Pass series to draw concentric radial bars, each its own track and color, with a legend.",
    code: `<Gauge
  size={220}
  series={[
    { value: 82, label: "Complete", color: "var(--emerald-500)" },
    { value: 54, label: "In review" },
    { value: 23, label: "Blocked" },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Gauge
          size={220}
          series={[
            { value: 82, label: "Complete", color: "var(--emerald-500)" },
            { value: 54, label: "In review" },
            { value: 23, label: "Blocked" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Custom colors and thickness",
    description: "A thicker value arc with custom color and track color, and the center caption hidden.",
    code: `<Gauge
  value={38}
  color="#f59e0b"
  trackColor="var(--color-surface-sunken)"
  thickness={0.24}
  showValue={false}
  label="Disk used"
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Gauge
          value={38}
          color="#f59e0b"
          trackColor="var(--color-surface-sunken)"
          thickness={0.24}
          showValue={false}
          label="Disk used"
        />
      </div>
    ),
  },
];

export default variations;
