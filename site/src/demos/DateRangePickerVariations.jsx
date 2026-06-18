import React from "react";
import { DateRangePicker } from "twico-ui";

// Stateful wrapper for the "All props" demo: render() runs inside .map(), so hooks
// cannot live there — keep the controlled value + onChange in a module-level component.
function DateRangePickerAllProps() {
  const [value, setValue] = React.useState({ start: new Date(2026, 5, 1), end: new Date(2026, 5, 14) });
  return (
    <div style={{ width: 340, maxWidth: "100%" }}>
      <DateRangePicker
        label="Reporting period"
        required
        value={value}
        onChange={setValue}
        placeholder="Select a date range"
        hint="Pick a start day, then an end day."
        presets
        locale="en-US"
        weekStartsOn={1}
        disabled={false}
        tone="info"
      />
    </div>
  );
}

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
  {
    title: "All props",
    description:
      "Every DateRangePicker-specific prop in one place — label, required asterisk, controlled value + onChange, placeholder, hint (error would replace it and turn the field red), the preset column, locale and weekStartsOn for the calendar, the disabled flag (off here so it stays interactive), and the tone accent.",
    code: `const [value, setValue] = React.useState({
  start: new Date(2026, 5, 1),
  end: new Date(2026, 5, 14),
});

<DateRangePicker
  label="Reporting period"
  required                       // adds the asterisk
  value={value}                  // controlled — or defaultValue for uncontrolled
  onChange={setValue}            // (range: { start, end }) => void
  placeholder="Select a date range"
  hint="Pick a start day, then an end day."  // error="…" replaces the hint + turns red
  presets                        // show the quick-preset column
  locale="en-US"                 // BCP-47 month/weekday names + formatting
  weekStartsOn={1}               // 0 = Sunday … 6 = Saturday
  disabled={false}               // true blocks opening the popover
  tone="info"                    // primary | success | warning | danger | info | neutral
/>`,
    render: () => <DateRangePickerAllProps />,
  },
];

export default variations;
