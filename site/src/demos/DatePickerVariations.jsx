import React from "react";
import { DatePicker } from "twico-ui";

const today = new Date();
const inOneMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
const lastYear = new Date(today.getFullYear() - 1, 0, 1);

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
];

export default variations;
