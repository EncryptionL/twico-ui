import React from "react";
import { MultiSelect } from "twico-ui";

const fruitOptions = ["Apple", "Banana", "Cherry", "Mango", "Orange", "Pear"];

const stackOptions = [
  {
    group: "Frameworks",
    options: [
      { value: "react", label: "React", description: "UI library" },
      { value: "vue", label: "Vue", description: "Progressive framework" },
      { value: "svelte", label: "Svelte", description: "Compiler-based" },
    ],
  },
  { group: "Tooling", options: ["tailwind", "typescript", "vite"] },
];

function MultiSelectAllProps() {
  const [value, setValue] = React.useState(["react", "tailwind"]);
  return (
    <div style={{ width: 340, maxWidth: "100%" }}>
      <MultiSelect
        label="Tech stack"
        hint="Type to filter; Backspace removes the last chip" // error replaces hint when set
        required
        size="md"
        tone="primary"
        placeholder="Add technologies"
        options={stackOptions}
        value={value} // or defaultValue for uncontrolled
        onChange={setValue}
        clearable
        disabled={false}
        placement="bottom"
        portal
        minWidth={320}
        onFocus={() => {}}
        onKeyDown={() => {}}
      />
    </div>
  );
}

const variations = [
  {
    title: "Basic",
    description: "Plain string options with a placeholder and an uncontrolled default.",
    code: `<MultiSelect
  label="Fruits"
  placeholder="Add fruits"
  options={["Apple", "Banana", "Cherry", "Mango", "Orange", "Pear"]}
  defaultValue={["Apple", "Cherry"]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <MultiSelect
          label="Fruits"
          placeholder="Add fruits"
          options={fruitOptions}
          defaultValue={["Apple", "Cherry"]}
        />
      </div>
    ),
  },
  {
    title: "Grouped & two-line options",
    description: "Grouped headings with optional descriptions under each label.",
    code: `<MultiSelect
  label="Tech stack"
  placeholder="Add technologies"
  hint="Type to filter, Backspace removes the last chip"
  options={[
    { group: "Frameworks", options: [
      { value: "react", label: "React", description: "UI library" },
      { value: "vue", label: "Vue", description: "Progressive framework" },
      { value: "svelte", label: "Svelte", description: "Compiler-based" },
    ]},
    { group: "Tooling", options: ["tailwind", "typescript", "vite"] },
  ]}
  defaultValue={["react", "tailwind"]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <MultiSelect
          label="Tech stack"
          placeholder="Add technologies"
          hint="Type to filter, Backspace removes the last chip"
          options={stackOptions}
          defaultValue={["react", "tailwind"]}
        />
      </div>
    ),
  },
  {
    title: "Required with error",
    description: "Marks the field required and shows a validation message.",
    code: `<MultiSelect
  label="Categories"
  required
  error="Pick at least one category"
  placeholder="Choose categories"
  options={["Design", "Engineering", "Marketing", "Sales"]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <MultiSelect
          label="Categories"
          required
          error="Pick at least one category"
          placeholder="Choose categories"
          options={["Design", "Engineering", "Marketing", "Sales"]}
        />
      </div>
    ),
  },
  {
    title: "Disabled",
    description: "Non-interactive, preserving its selected chips.",
    code: `<MultiSelect
  label="Fruits"
  disabled
  options={["Apple", "Banana", "Cherry", "Mango", "Orange", "Pear"]}
  defaultValue={["Apple", "Mango"]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <MultiSelect
          label="Fruits"
          disabled
          options={fruitOptions}
          defaultValue={["Apple", "Mango"]}
        />
      </div>
    ),
  },
  {
    title: "Tones",
    description:
      "The tone prop colors the selected chips and focus accent — primary, success, warning, danger, and info.",
    code: `<MultiSelect tone="primary" label="Primary" options={fruitOptions} defaultValue={["Apple", "Cherry"]} />
<MultiSelect tone="success" label="Success" options={fruitOptions} defaultValue={["Apple", "Cherry"]} />
<MultiSelect tone="warning" label="Warning" options={fruitOptions} defaultValue={["Apple", "Cherry"]} />
<MultiSelect tone="danger"  label="Danger"  options={fruitOptions} defaultValue={["Apple", "Cherry"]} />
<MultiSelect tone="info"    label="Info"    options={fruitOptions} defaultValue={["Apple", "Cherry"]} />`,
    render: () => (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          width: "100%",
        }}
      >
        {(/** @type {("primary" | "success" | "warning" | "danger" | "info")[]} */ (["primary", "success", "warning", "danger", "info"])).map((tone) => (
          <MultiSelect
            key={tone}
            tone={tone}
            label={tone[0].toUpperCase() + tone.slice(1)}
            placeholder="Add fruits"
            options={fruitOptions}
            defaultValue={["Apple", "Cherry"]}
          />
        ))}
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every MultiSelect-specific prop in one place — label/hint (error replaces hint), required, size, tone, placeholder, grouped options, controlled value + onChange, clearable, disabled, placement, portal, minWidth, plus the composed onFocus and onKeyDown handlers. The value is controlled here; swap in defaultValue for an uncontrolled field.",
    code: `const [value, setValue] = React.useState(["react", "tailwind"]);

<MultiSelect
  label="Tech stack"
  hint="Type to filter; Backspace removes the last chip" // error replaces hint when set
  required
  size="md"             // sm | md | lg
  tone="primary"        // primary | success | warning | danger | info | neutral
  placeholder="Add technologies"
  options={[
    { group: "Frameworks", options: [
      { value: "react", label: "React", description: "UI library" },
      { value: "vue", label: "Vue", description: "Progressive framework" },
      { value: "svelte", label: "Svelte", description: "Compiler-based" },
    ]},
    { group: "Tooling", options: ["tailwind", "typescript", "vite"] },
  ]}
  value={value}         // or defaultValue for uncontrolled
  onChange={setValue}
  clearable
  disabled={false}
  placement="bottom"    // bottom | top
  portal                // false renders the dropdown inline
  minWidth={320}        // min popover width in px when portaled
  onFocus={(e) => {}}   // runs before the field's open-on-focus
  onKeyDown={(e) => {}} // runs before the field's keyboard nav
/>`,
    render: () => <MultiSelectAllProps />,
  },
];

export default variations;
