import React from "react";
import { DateTimePicker } from "twico-ui";

function DateTimePickerAllProps() {
  const [when, setWhen] = React.useState(new Date(2024, 5, 15, 9, 30, 0));
  return (
    <div style={{ width: 380, maxWidth: "100%" }}>
      <DateTimePicker
        label="Shift start"
        required
        hint="Pick the day and the start time."
        value={when}
        onChange={setWhen}
        minuteStep={15}
        hourCycle={12}
        weekStartsOn={1}
        tone="info"
      />
    </div>
  );
}

const box = (node) => <div style={{ width: 380, maxWidth: "100%" }}>{node}</div>;

const variations = [
  {
    title: "Date + time",
    description: "A calendar and a time-column popover over one Date value.",
    code: `<DateTimePicker label="Shift start" />`,
    render: () => box(<DateTimePicker label="Shift start" />),
  },
  {
    title: "12-hour, 15-minute slots",
    description: "hourCycle={12} plus minuteStep={15} for appointment-style entry.",
    code: `<DateTimePicker label="Meeting" hourCycle={12} minuteStep={15} />`,
    render: () => box(<DateTimePicker label="Meeting" hourCycle={12} minuteStep={15} />),
  },
  {
    title: "Seconds precision",
    description: `granularity="second" surfaces a seconds column on the time side.`,
    code: `<DateTimePicker label="Logged at" granularity="second" />`,
    render: () => box(<DateTimePicker label="Logged at" granularity="second" />),
  },
  {
    title: "All props",
    description: "Controlled value, required, 12-hour, Monday-first week, and a tone accent.",
    code: `const [when, setWhen] = React.useState(new Date(2024, 5, 15, 9, 30));

<DateTimePicker
  label="Shift start"
  required
  hint="Pick the day and the start time."
  value={when}
  onChange={setWhen}
  minuteStep={15}
  hourCycle={12}          // 12 = AM/PM; 24 = 00–23
  weekStartsOn={1}        // 0 = Sunday … 6 = Saturday
  tone="info"             // primary | success | warning | danger | info | neutral
/>`,
    render: () => <DateTimePickerAllProps />,
  },
];

export default variations;
