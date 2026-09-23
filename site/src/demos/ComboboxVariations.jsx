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

// Options that share a long common prefix and differ only in a tail — the truncation case wrapOptions solves.
const catalog = [
  { value: "a", label: "Aurora Wireless Speaker — 40W — Bluetooth 5.3 — Charcoal", description: "catalog · A" },
  { value: "b", label: "Aurora Wireless Speaker — 40W — Bluetooth 5.3 — Ivory", description: "catalog · B" },
  { value: "c", label: "Aurora Wireless Speaker — 60W — Bluetooth 5.3 — Slate", description: "catalog · C" },
];

// #425 — as a cell editor (or any host that stages the typed query): `defaultQuery` seeds the search box on
// open for a spot edit, and `onOpenChange` lets the host withdraw a staged draft when the control silently
// closes (chevron / Escape / outside click). Rendered as a component (not inline) so its hooks are stable.
function ComboboxCellEditor() {
  const [staged, setStaged] = React.useState(null);
  const [committed, setCommitted] = React.useState("Mango");
  return (
    <div style={{ width: 340, maxWidth: "100%", display: "grid", gap: 10 }}>
      <Combobox
        label="Edit fruit"
        // Seed the box with the current value each time it opens (caret at end) so one character can be fixed.
        defaultQuery={committed}
        options={fruits}
        onInputChange={(q) => setStaged(q)}   // host stages what the user types
        onChange={(v) => { if (v) setCommitted(v); setStaged(null); }}
        onOpenChange={(open) => { if (!open) setStaged(null); }} // withdraw the staged draft when it closes
      />
      <div style={{ fontSize: 13, color: "var(--color-fg-muted)" }}>
        Committed: <b>{committed}</b>{staged != null ? <> · staged: <b>{staged || "(empty)"}</b></> : null}
      </div>
    </div>
  );
}

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
    title: "Wrap long options",
    description:
      "When options share a long common prefix and differ only in a tail, single-line truncation makes them indistinguishable. Set wrapOptions so labels/descriptions wrap onto multiple lines. (It takes precedence over virtualized, whose rows must be a fixed height.)",
    code: `<Combobox
  label="Product"
  placeholder="Search a product"
  wrapOptions
  minWidth={320}
  options={[
    { value: "a", label: "Aurora Wireless Speaker — 40W — Bluetooth 5.3 — Charcoal", description: "catalog · A" },
    { value: "b", label: "Aurora Wireless Speaker — 40W — Bluetooth 5.3 — Ivory", description: "catalog · B" },
    { value: "c", label: "Aurora Wireless Speaker — 60W — Bluetooth 5.3 — Slate", description: "catalog · C" },
  ]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Combobox
          label="Product"
          placeholder="Search a product"
          wrapOptions
          minWidth={320}
          options={catalog}
        />
      </div>
    ),
  },
  {
    title: "Custom option rendering",
    description:
      "Add `icon` (leading) and/or `hint` (trailing, muted) to an option for a lift with no custom render, or pass `renderOption(option, { selected, active })` to own the row body entirely — twico keeps the row chrome, keyboard nav, and ARIA. Custom/variable-height rows disable `virtualized`.",
    code: `const envs = [
  { value: "prod", label: "Production", icon: "🔴", hint: "live" },
  { value: "stg", label: "Staging", icon: "🟡", hint: "qa" },
  { value: "dev", label: "Development", icon: "🟢", hint: "local" },
];

{/* lightweight: option icon + hint */}
<Combobox label="Environment" options={envs} defaultValue="stg" />

{/* full control: renderOption owns the body (checkmark/nav/ARIA stay) */}
<Combobox
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
          <Combobox label="Environment" options={envs} defaultValue="stg" />
          <Combobox
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
    title: "Spot-edit cell editor (defaultQuery + onOpenChange)",
    description:
      "As a datatable cell editor the field owns its text: the typed query is internal, close() (chevron / Escape / outside click) resets it silently, and there was no way to pre-fill it. `defaultQuery` seeds the box on open (caret at the end) so one character can be corrected without retyping; `onOpenChange(open)` fires on every open↔close so a host that staged the query (e.g. with the grid) can withdraw it when the control drops it.",
    code: `function CellEditor() {
  const [staged, setStaged] = React.useState(null);
  const [committed, setCommitted] = React.useState("Mango");
  return (
    <>
      <Combobox
        label="Edit fruit"
        defaultQuery={committed}                     // seed on open, caret at end (no onInputChange)
        options={["Apple", "Banana", "Cherry", "Mango", "Orange", "Pear"]}
        onInputChange={(q) => setStaged(q)}          // host stages what the user types
        onChange={(v) => { if (v) setCommitted(v); setStaged(null); }}
        onOpenChange={(open) => { if (!open) setStaged(null); }} // withdraw the draft on silent close
      />
      <div>Committed: <b>{committed}</b>{staged != null && <> · staged: <b>{staged || "(empty)"}</b></>}</div>
    </>
  );
}`,
    render: () => <ComboboxCellEditor />,
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
