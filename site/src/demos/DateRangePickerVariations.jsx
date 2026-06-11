import React from "react";
import { DateRangePicker } from "twico-ui";

const variations = [
  {
    title: "Basic",
    description: "A labeled range picker. Click a start day, then an end day.",
    code: `<DateRangePicker label="Reporting period" placeholder="Pick a range" />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <DateRangePicker label="Reporting period" placeholder="Pick a range" />
      </div>
    ),
  },
  {
    title: "Preselected range",
    description: "Seed an uncontrolled picker with defaultValue.",
    code: `<DateRangePicker
  label="Trip dates"
  defaultValue={{
    start: new Date(2026, 5, 10),
    end: new Date(2026, 5, 17),
  }}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <DateRangePicker
          label="Trip dates"
          defaultValue={{ start: new Date(2026, 5, 10), end: new Date(2026, 5, 17) }}
        />
      </div>
    ),
  },
  {
    title: "Week starts on Monday",
    description: "Set weekStartsOn to 1 for ISO calendars.",
    code: `<DateRangePicker label="Sprint" weekStartsOn={1} />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <DateRangePicker label="Sprint" weekStartsOn={1} />
      </div>
    ),
  },
  {
    title: "Without presets",
    description: "Hide the quick-preset column for a compact calendar.",
    code: `<DateRangePicker label="Custom window" presets={false} />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <DateRangePicker label="Custom window" presets={false} />
      </div>
    ),
  },
  {
    title: "No label",
    description: "Omit the label and rely on the placeholder text.",
    code: `<DateRangePicker placeholder="Select dates…" />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <DateRangePicker placeholder="Select dates…" />
      </div>
    ),
  },
];

export default variations;
