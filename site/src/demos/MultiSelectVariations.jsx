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
        {["primary", "success", "warning", "danger", "info"].map((tone) => (
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
];

export default variations;
