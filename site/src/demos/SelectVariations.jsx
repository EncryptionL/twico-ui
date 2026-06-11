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
];

export default variations;
