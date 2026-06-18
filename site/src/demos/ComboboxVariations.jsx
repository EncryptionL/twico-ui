import React from "react";
import { Combobox } from "twico-ui";

const fruits = ["Apple", "Banana", "Cherry", "Mango", "Orange", "Pear"];

const countries = [
  { group: "Asia", options: [
    { value: "id", label: "Indonesia", description: "Jakarta" },
    { value: "jp", label: "Japan", description: "Tokyo" },
  ]},
  { group: "Europe", options: [
    { value: "de", label: "Germany", description: "Berlin" },
    { value: "fr", label: "France", description: "Paris" },
  ]},
];

function ComboboxAllProps() {
  const [value, setValue] = React.useState("jp"); // or defaultValue for uncontrolled

  return (
    <div style={{ width: 340, maxWidth: "100%" }}>
      <Combobox
        label="Country"
        hint="Type to filter, ↑/↓ to move, Enter to select" // error replaces hint when set
        required
        size="md"            // sm | md | lg
        tone="info"          // primary | success | warning | danger | info | neutral
        placeholder="Search a country"
        options={countries}
        value={value}        // controlled; use defaultValue instead for uncontrolled
        onChange={(v) => setValue(v)}
        clearable
        disabled={false}     // set true to make the field non-interactive
        placement="bottom"   // bottom | top
        portal               // render the dropdown in a portal (default true)
        minWidth={240}       // minimum popover width in px when portaled
        onFocus={() => {}}   // runs before the open-on-focus behavior
        onKeyDown={() => {}} // runs before the built-in keyboard navigation
      />
    </div>
  );
}

const variations = [
  {
    title: "Basic",
    description: "Type to filter a simple list of string options.",
    code: `<Combobox
  label="Fruit"
  placeholder="Search a fruit"
  options={["Apple", "Banana", "Cherry", "Mango", "Orange", "Pear"]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Combobox
          label="Fruit"
          placeholder="Search a fruit"
          options={fruits}
        />
      </div>
    ),
  },
  {
    title: "Grouped with descriptions",
    description: "Group headings and two-line options (label + subtitle).",
    code: `<Combobox
  label="Country"
  placeholder="Search a country"
  hint="Type to filter the list"
  clearable
  defaultValue="jp"
  options={[
    { group: "Asia", options: [
      { value: "id", label: "Indonesia", description: "Jakarta" },
      { value: "jp", label: "Japan", description: "Tokyo" },
    ]},
    { group: "Europe", options: [
      { value: "de", label: "Germany", description: "Berlin" },
      { value: "fr", label: "France", description: "Paris" },
    ]},
  ]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Combobox
          label="Country"
          placeholder="Search a country"
          hint="Type to filter the list"
          clearable
          defaultValue="jp"
          options={countries}
        />
      </div>
    ),
  },
  {
    title: "Sizes",
    description: "Three field heights: sm, md, and lg.",
    code: `<Combobox size="sm" label="Small" placeholder="Search" options={["Apple", "Banana", "Cherry"]} />
<Combobox size="md" label="Medium" placeholder="Search" options={["Apple", "Banana", "Cherry"]} />
<Combobox size="lg" label="Large" placeholder="Search" options={["Apple", "Banana", "Cherry"]} />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%", display: "grid", gap: 16 }}>
        <Combobox size="sm" label="Small" placeholder="Search" options={fruits} />
        <Combobox size="md" label="Medium" placeholder="Search" options={fruits} />
        <Combobox size="lg" label="Large" placeholder="Search" options={fruits} />
      </div>
    ),
  },
  {
    title: "Required with error",
    description: "Validation state with a required marker and error message.",
    code: `<Combobox
  label="Country"
  placeholder="Search a country"
  required
  error="Please choose a country"
  options={[
    { group: "Asia", options: [
      { value: "id", label: "Indonesia", description: "Jakarta" },
      { value: "jp", label: "Japan", description: "Tokyo" },
    ]},
  ]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Combobox
          label="Country"
          placeholder="Search a country"
          required
          error="Please choose a country"
          options={countries}
        />
      </div>
    ),
  },
  {
    title: "Disabled",
    description: "Non-interactive, with a preselected value.",
    code: `<Combobox
  label="Country"
  defaultValue="fr"
  disabled
  options={[
    { group: "Europe", options: [
      { value: "de", label: "Germany", description: "Berlin" },
      { value: "fr", label: "France", description: "Paris" },
    ]},
  ]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Combobox
          label="Country"
          defaultValue="fr"
          disabled
          options={countries}
        />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every Combobox-specific prop in one place — label/hint/required, size, tone, placeholder, grouped options, the controlled value + onChange pair (defaultValue for uncontrolled), clearable, disabled, placement, portal, minWidth, plus the composed onFocus/onKeyDown handlers. Pass error instead of hint for the invalid state.",
    code: `const [value, setValue] = React.useState("jp"); // or defaultValue for uncontrolled

<Combobox
  label="Country"
  hint="Type to filter, ↑/↓ to move, Enter to select" // error replaces hint when set
  required
  size="md"            // sm | md | lg
  tone="info"          // primary | success | warning | danger | info | neutral
  placeholder="Search a country"
  options={[
    { group: "Asia", options: [
      { value: "id", label: "Indonesia", description: "Jakarta" },
      { value: "jp", label: "Japan", description: "Tokyo" },
    ]},
    { group: "Europe", options: [
      { value: "de", label: "Germany", description: "Berlin" },
      { value: "fr", label: "France", description: "Paris" },
    ]},
  ]}
  value={value}        // controlled; use defaultValue instead for uncontrolled
  onChange={(v) => setValue(v)}
  clearable
  disabled={false}     // set true to make the field non-interactive
  placement="bottom"   // bottom | top
  portal               // render the dropdown in a portal (default true)
  minWidth={240}       // minimum popover width in px when portaled
  onFocus={() => {}}   // runs before the open-on-focus behavior
  onKeyDown={() => {}} // runs before the built-in keyboard navigation
/>`,
    render: () => <ComboboxAllProps />,
  },
];

export default variations;
