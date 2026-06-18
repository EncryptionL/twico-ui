import React from "react";
import { DatePicker } from "twico-ui";

const today = new Date();
const inOneMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
const lastYear = new Date(today.getFullYear() - 1, 0, 1);
const inSixMonths = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());

// Stateful demo so the controlled value + onChange round-trips inside a .map()-rendered example.
function DatePickerAllProps() {
  const [date, setDate] = React.useState(today);
  return (
    <div style={{ width: 340, maxWidth: "100%" }}>
      <DatePicker
        label="Departure"
        required
        hint="Pick a day within the next six months."
        value={date}
        onChange={setDate}
        placeholder="Select a date"
        min={today}
        max={inSixMonths}
        disabled={false}
        tone="info"
        clearable
        format={(d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
        locale="en-GB"
        weekStartsOn={1}
      />
    </div>
  );
}

const variations = [
  {
    title: "With label",
    description: "A labelled field with placeholder text until a day is chosen.",
    code: `<DatePicker label="Start date" placeholder="Pick a day" />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <DatePicker label="Start date" placeholder="Pick a day" />
      </div>
    ),
  },
  {
    title: "Preselected (uncontrolled)",
    description: "Seed an initial date with defaultValue.",
    code: `<DatePicker label="Appointment" defaultValue={new Date()} />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <DatePicker label="Appointment" defaultValue={new Date()} />
      </div>
    ),
  },
  {
    title: "Bounded range",
    description: "Restrict selection between min and max, and start weeks on Monday.",
    code: `<DatePicker
  label="Delivery window"
  min={today}
  max={inOneMonth}
  weekStartsOn={1}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <DatePicker
          label="Delivery window"
          min={today}
          max={inOneMonth}
          weekStartsOn={1}
        />
      </div>
    ),
  },
  {
    title: "Custom format, not clearable",
    description: "Format the display string yourself and hide the clear button.",
    code: `<DatePicker
  label="Renewal date"
  defaultValue={today}
  clearable={false}
  format={(d) => d.toISOString().slice(0, 10)}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <DatePicker
          label="Renewal date"
          defaultValue={today}
          clearable={false}
          format={(d) => d.toISOString().slice(0, 10)}
        />
      </div>
    ),
  },
  {
    title: "Disabled",
    description: "Non-interactive, with a value already set.",
    code: `<DatePicker label="Locked date" defaultValue={lastYear} disabled />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <DatePicker label="Locked date" defaultValue={lastYear} disabled />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every DatePicker-specific prop in one place — label, required, hint, controlled value + onChange, placeholder, min/max bounds, disabled flag, tone accent, clearable button, a custom format, locale, and weekStartsOn. (error would replace hint and turn the field red; defaultValue is the uncontrolled alternative to value.)",
    code: `const [date, setDate] = React.useState(new Date());

<DatePicker
  label="Departure"
  required                       // adds an asterisk to the label
  hint="Pick a day within the next six months." // error replaces hint when set
  value={date}                   // or defaultValue for uncontrolled
  onChange={setDate}
  placeholder="Select a date"
  min={today}
  max={inSixMonths}
  disabled={false}
  tone="info"                    // primary | success | warning | danger | info | neutral
  clearable                      // shows a × button when a date is set
  format={(d) =>
    d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
  }
  locale="en-GB"
  weekStartsOn={1}               // 0 = Sunday … 6 = Saturday
/>`,
    render: () => <DatePickerAllProps />,
  },
];

export default variations;
