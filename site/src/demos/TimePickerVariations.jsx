import React from "react";
import { TimePicker } from "twico-ui";

const at = (h, m) => new Date(2024, 0, 1, h, m, 0);

// Stateful demo so the controlled value + onChange round-trips inside the all-props example.
function TimePickerAllProps() {
  const [time, setTime] = React.useState(at(9, 30));
  return (
    <div style={{ width: 260, maxWidth: "100%" }}>
      <TimePicker
        label="Appointment"
        required
        hint="Business hours only, 15-minute slots."
        value={time}
        onChange={setTime}
        placeholder="Select a time"
        min={at(9, 0)}
        max={at(17, 0)}
        minuteStep={15}
        hourCycle={12}
        tone="info"
        clearable
      />
    </div>
  );
}

const box = (node) => <div style={{ width: 260, maxWidth: "100%" }}>{node}</div>;

const variations = [
  {
    title: "With label",
    description: "A labelled 24-hour picker stepping the minute column by 5.",
    code: `<TimePicker label="Start time" placeholder="Pick a time" />`,
    render: () => box(<TimePicker label="Start time" placeholder="Pick a time" />),
  },
  {
    title: "12-hour with AM/PM",
    description: "hourCycle={12} shows 1–12 hours plus a dedicated AM/PM column.",
    code: `<TimePicker label="Meeting" hourCycle={12} minuteStep={15} />`,
    render: () => box(<TimePicker label="Meeting" hourCycle={12} minuteStep={15} />),
  },
  {
    title: "Seconds granularity",
    description: `granularity="second" adds a seconds column for precise timestamps.`,
    code: `<TimePicker label="Log time" granularity="second" secondStep={10} />`,
    render: () => box(<TimePicker label="Log time" granularity="second" secondStep={10} />),
  },
  {
    title: "Bounded time-of-day",
    description: "min/max disable options outside the allowed window (here 09:00–17:00).",
    code: `<TimePicker
  label="Shift start"
  min={new Date(2024, 0, 1, 9, 0)}
  max={new Date(2024, 0, 1, 17, 0)}
/>`,
    render: () => box(<TimePicker label="Shift start" min={at(9, 0)} max={at(17, 0)} />),
  },
  {
    title: "Typed entry",
    description: `Set editable to type "HH:MM" (optional am/pm); it commits on Enter/blur.`,
    code: `<TimePicker editable label="Deadline" placeholder="e.g. 14:30" />`,
    render: () => box(<TimePicker editable label="Deadline" placeholder="e.g. 14:30" />),
  },
  {
    title: "All props",
    description: "Every prop wired at once — controlled value, bounds, 12-hour, tone, and required.",
    code: `const [time, setTime] = React.useState(new Date(2024, 0, 1, 9, 30));

<TimePicker
  label="Appointment"
  required
  hint="Business hours only, 15-minute slots."
  value={time}
  onChange={setTime}
  min={new Date(2024, 0, 1, 9, 0)}
  max={new Date(2024, 0, 1, 17, 0)}
  minuteStep={15}          // increment for the minute column
  hourCycle={12}           // 12 = AM/PM column; 24 = 00–23
  tone="info"              // primary | success | warning | danger | info | neutral
  clearable                // shows a × when a time is set
/>`,
    render: () => <TimePickerAllProps />,
  },
];

export default variations;
