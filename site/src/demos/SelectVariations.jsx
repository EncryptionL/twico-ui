import React from "react";
import { Select } from "twico-ui";

const FRUITS = ["Apple", "Banana", "Cherry", "Dragon fruit", "Elderberry"];

const PEOPLE = [
  { group: "Design", options: [
    { value: "ada", label: "Ada Park", description: "Product designer" },
    { value: "sam", label: "Sam Lee", description: "Brand designer" },
  ]},
  { group: "Engineering", options: [
    { value: "jo", label: "Jo Kim", description: "Frontend" },
    { value: "ravi", label: "Ravi Shah", description: "Backend" },
  ]},
];

const COUNTRIES = [
  "Australia", "Brazil", "Canada", "Denmark", "Egypt", "France",
  "Germany", "India", "Japan", "Kenya", "Mexico", "Norway",
];

// Stateful demo for the "All props" example — render() is called inside .map(),
// so hooks must live in a module-level component, not inline in render.
function SelectAllProps() {
  const [value, setValue] = React.useState("ravi"); // or defaultValue for uncontrolled
  return (
    <div style={{ width: 340, maxWidth: "100%" }}>
      <Select
        label="Assignee"
        hint="Pick who owns this task"      // error (below) replaces the hint when set
        error={undefined}                   // e.g. "Please choose a teammate"
        required
        size="md"                            // sm | md | lg
        tone="primary"                       // primary | success | warning | danger | info | neutral
        placeholder="Pick a teammate"
        searchable                           // omit to auto-enable past 5 options
        searchPlaceholder="Search people…"
        options={PEOPLE}                     // strings, {value,label,description}, or {group,options}
        value={value}                        // controlled — or defaultValue for uncontrolled
        onChange={setValue}                  // (value: string | null) — null when cleared
        clearable                            // shows a × affix; Delete/Backspace also clears
        disabled={false}
        placement="bottom"                   // bottom | top
        portal                               // render in a portal so nothing clips it
        minWidth={240}                       // min popover width in px when portaled
        onClick={() => {}}                   // composed; preventDefault() to stop the toggle
        onKeyDown={() => {}}                 // composed; preventDefault() to suppress nav
      />
    </div>
  );
}

const variations = [
  {
    title: "Sizes",
    description: "Three trigger heights to match surrounding form fields.",
    code: `<Select size="sm" placeholder="Small" options={["Apple", "Banana", "Cherry"]} />
<Select size="md" placeholder="Medium" options={["Apple", "Banana", "Cherry"]} />
<Select size="lg" placeholder="Large" options={["Apple", "Banana", "Cherry"]} />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 340, maxWidth: "100%" }}>
        <Select size="sm" placeholder="Small" options={["Apple", "Banana", "Cherry"]} />
        <Select size="md" placeholder="Medium" options={["Apple", "Banana", "Cherry"]} />
        <Select size="lg" placeholder="Large" options={["Apple", "Banana", "Cherry"]} />
      </div>
    ),
  },
  {
    title: "Grouped options with descriptions",
    description: "Group headings and two-line options (title + subtitle). Uncontrolled default.",
    code: `<Select
  label="Assignee"
  placeholder="Pick a teammate"
  hint="Choose who owns this task"
  defaultValue="jo"
  options={[
    { group: "Design", options: [
      { value: "ada", label: "Ada Park", description: "Product designer" },
      { value: "sam", label: "Sam Lee", description: "Brand designer" },
    ]},
    { group: "Engineering", options: [
      { value: "jo", label: "Jo Kim", description: "Frontend" },
      { value: "ravi", label: "Ravi Shah", description: "Backend" },
    ]},
  ]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Select
          label="Assignee"
          placeholder="Pick a teammate"
          hint="Choose who owns this task"
          defaultValue="jo"
          options={PEOPLE}
        />
      </div>
    ),
  },
  {
    title: "Searchable",
    description: "A search box filters options inside the popover (auto-enabled past 5 options).",
    code: `<Select
  label="Country"
  required
  searchable
  searchPlaceholder="Search countries…"
  placeholder="Select a country"
  options={["Australia", "Brazil", "Canada", "Denmark", "Egypt", "France"]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Select
          label="Country"
          required
          searchable
          searchPlaceholder="Search countries…"
          placeholder="Select a country"
          options={COUNTRIES}
        />
      </div>
    ),
  },
  {
    title: "Error state",
    description: "An error message replaces the hint and tints the trigger.",
    code: `<Select
  label="Plan"
  required
  error="Please choose a plan"
  placeholder="Select a plan"
  options={["Free", "Pro", "Team", "Enterprise"]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Select
          label="Plan"
          required
          error="Please choose a plan"
          placeholder="Select a plan"
          options={["Free", "Pro", "Team", "Enterprise"]}
        />
      </div>
    ),
  },
  {
    title: "Disabled",
    description: "A non-interactive, pre-filled select.",
    code: `<Select
  label="Workspace"
  disabled
  defaultValue="Apple"
  options={["Apple", "Banana", "Cherry"]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Select
          label="Workspace"
          disabled
          defaultValue="Apple"
          options={FRUITS}
        />
      </div>
    ),
  },
  {
    title: "Custom option rendering",
    description:
      "Add `icon` (leading) and/or `hint` (trailing, muted) to an option for a lift with no custom render, or pass `renderOption(option, { selected, active })` to own the row body entirely — twico keeps the row chrome, the selected checkmark, and ARIA. Custom/variable-height rows disable `virtualized`.",
    code: `const envs = [
  { value: "prod", label: "Production", icon: "🔴", hint: "live" },
  { value: "stg", label: "Staging", icon: "🟡", hint: "qa" },
  { value: "dev", label: "Development", icon: "🟢", hint: "local" },
];

{/* lightweight: option icon + hint */}
<Select label="Environment" options={envs} defaultValue="stg" />

{/* full control: renderOption owns the body (checkmark/nav/ARIA stay) */}
<Select
  label="Environment (renderOption)"
  options={envs}
  defaultValue="stg"
  renderOption={(o, { selected }) => (
    <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: selected ? 700 : 500 }}>
      <span>{o.icon}</span>{o.label}
    </span>
  )}
/>`,
    render: () => {
      const envs = [
        { value: "prod", label: "Production", icon: "🔴", hint: "live" },
        { value: "stg", label: "Staging", icon: "🟡", hint: "qa" },
        { value: "dev", label: "Development", icon: "🟢", hint: "local" },
      ];
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 340, maxWidth: "100%" }}>
          <Select label="Environment" options={envs} defaultValue="stg" />
          <Select
            label="Environment (renderOption)"
            options={envs}
            defaultValue="stg"
            renderOption={(o, { selected }) => (
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: selected ? 700 : 500 }}>
                <span>{o.icon}</span>{o.label}
              </span>
            )}
          />
        </div>
      );
    },
  },
  {
    title: "All props",
    description: "Every Select-specific prop in one place — label/hint/error, required, size, tone, placeholder, the in-popover search (searchable + searchPlaceholder), grouped options, controlled value + onChange, clearable, disabled, placement, portal + minWidth, and the composed onClick/onKeyDown handlers.",
    code: `const [value, setValue] = React.useState("ravi"); // or defaultValue for uncontrolled

<Select
  label="Assignee"
  hint="Pick who owns this task"      // error (below) replaces the hint when set
  error={undefined}                   // e.g. "Please choose a teammate"
  required
  size="md"                            // sm | md | lg
  tone="primary"                       // primary | success | warning | danger | info | neutral
  placeholder="Pick a teammate"
  searchable                           // omit to auto-enable past 5 options
  searchPlaceholder="Search people…"
  options={[                           // strings, {value,label,description}, or {group,options}
    { group: "Design", options: [
      { value: "ada", label: "Ada Park", description: "Product designer" },
      { value: "sam", label: "Sam Lee", description: "Brand designer" },
    ]},
    { group: "Engineering", options: [
      { value: "jo", label: "Jo Kim", description: "Frontend" },
      { value: "ravi", label: "Ravi Shah", description: "Backend" },
    ]},
  ]}
  value={value}                        // controlled — or defaultValue for uncontrolled
  onChange={setValue}                  // (value: string | null) — null when cleared
  clearable                            // shows a × affix; Delete/Backspace also clears
  disabled={false}
  placement="bottom"                   // bottom | top
  portal                               // render in a portal so nothing clips it
  minWidth={240}                       // min popover width in px when portaled
  onClick={() => {}}                   // composed; preventDefault() to stop the toggle
  onKeyDown={() => {}}                 // composed; preventDefault() to suppress nav
/>`,
    render: () => <SelectAllProps />,
  },
];

export default variations;
