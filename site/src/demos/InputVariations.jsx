import React from "react";
import { Input, Select, Stack } from "twico-ui";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function InputAllProps() {
  const [value, setValue] = React.useState("ada@twico.dev");
  return (
    <div style={{ width: 340, maxWidth: "100%" }}>
      <Input
        label="Work email"
        required
        size="md"               // sm | md | lg
        tone="success"          // primary | success | warning | danger | info | neutral
        leftIcon={<MailIcon />}
        rightIcon={<CheckIcon />}
        hint="We'll only use this to send receipts."
        type="email"
        placeholder="you@twico.dev"
        value={value}                                  // or defaultValue for uncontrolled
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

// #494: a row of fields where ONE has a hint. Without reserveFooter the hinted field grows a footer
// and its neighbours do not, so align="flex-end" lines the row up by the bottoms and the hinted
// control sits a footer higher - the caption moves a DIFFERENT control. data-reserve-footer on the
// row holds the lane open in every field inside, so one prop fixes the whole row.
const FILTERS = [{ label: "Material", value: "material" }, { label: "Description", value: "desc" }];
const COMPARISONS = [{ label: "Contains", value: "contains" }, { label: "Exact match", value: "exact" }];

function FieldRowDemo() {
  const row = { width: "100%", maxWidth: 620 };
  return (
    <Stack direction="column" gap={5} style={{ width: "100%" }}>
      <div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBlockEnd: "var(--space-2)" }}>
          Without — the hint on the middle field lifts it above its neighbours
        </div>
        <Stack direction="row" gap={3} align="flex-end" wrap style={row}>
          <div style={{ flex: 1, minWidth: 140 }}><Select label="Filter" options={FILTERS} defaultValue="material" /></div>
          <div style={{ flex: 1, minWidth: 140 }}><Select label="Comparison" options={COMPARISONS} defaultValue="contains" hint="Matches anywhere in the value." /></div>
          <div style={{ flex: 1, minWidth: 140 }}><Input label="Value" defaultValue="leather" /></div>
        </Stack>
      </div>
      <div data-reserve-footer>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBlockEnd: "var(--space-2)" }}>
          With <code>data-reserve-footer</code> on the row — every field keeps a footer lane, so the controls line up
        </div>
        <Stack direction="row" gap={3} align="flex-end" wrap style={row}>
          <div style={{ flex: 1, minWidth: 140 }}><Select label="Filter" options={FILTERS} defaultValue="material" /></div>
          <div style={{ flex: 1, minWidth: 140 }}><Select label="Comparison" options={COMPARISONS} defaultValue="contains" hint="Matches anywhere in the value." /></div>
          <div style={{ flex: 1, minWidth: 140 }}><Input label="Value" defaultValue="leather" /></div>
        </Stack>
      </div>
    </Stack>
  );
}

const variations = [
  {
    title: "Label, hint & required",
    description: "A labeled field with a required asterisk and helper text below.",
    code: `<Input
  label="Email"
  type="email"
  placeholder="you@twico.dev"
  required
  hint="We'll never share your email."
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Input
          label="Email"
          type="email"
          placeholder="you@twico.dev"
          required
          hint="We'll never share your email."
        />
      </div>
    ),
  },
  {
    title: "Error state",
    description: "Passing `error` turns the field red and replaces the hint.",
    code: `<Input
  label="Email"
  type="email"
  defaultValue="not-an-email"
  error="Enter a valid email address"
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Input
          label="Email"
          type="email"
          defaultValue="not-an-email"
          error="Enter a valid email address"
        />
      </div>
    ),
  },
  {
    title: "Sizes",
    description: "Three control sizes: sm, md (default), and lg.",
    code: `<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 340, maxWidth: "100%" }}>
        <Input size="sm" placeholder="Small" />
        <Input size="md" placeholder="Medium" />
        <Input size="lg" placeholder="Large" />
      </div>
    ),
  },
  {
    title: "Inline icons",
    description: "A leading prefix icon and a trailing suffix node.",
    code: `<Input label="Search" leftIcon={<SearchIcon />} placeholder="Search…" />
<Input label="Amount" rightIcon={<span>USD</span>} placeholder="0.00" />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 340, maxWidth: "100%" }}>
        <Input label="Search" leftIcon={<SearchIcon />} placeholder="Search…" />
        <Input label="Amount" rightIcon={<span>USD</span>} placeholder="0.00" />
      </div>
    ),
  },
  {
    title: "Password & disabled",
    description: "Password fields get a built-in reveal/hide eye toggle; disabled fields are dimmed.",
    code: `<Input label="Password" type="password" placeholder="••••••••" />
<Input label="Username" defaultValue="twico" disabled />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 340, maxWidth: "100%" }}>
        <Input label="Password" type="password" placeholder="••••••••" />
        <Input label="Username" defaultValue="twico" disabled />
      </div>
    ),
  },
  {
    title: "Clearable",
    description:
      "Set `clearable` to show a trailing ✕ once the field has a value; clicking it empties the field and fires onChange with an empty string. It works for controlled and uncontrolled inputs and coexists with rightIcon and the password reveal eye.",
    code: `<Input label="Search" clearable defaultValue="twico ui" placeholder="Search…" />
<Input label="Password" type="password" clearable defaultValue="secret" />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 340, maxWidth: "100%" }}>
        <Input label="Search" clearable defaultValue="twico ui" placeholder="Search…" />
        <Input label="Password" type="password" clearable defaultValue="secret" />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every Input-specific prop in one place. Shows the controlled value pattern, a leading and trailing icon, a tone accent, and a hint (passing `error` instead would turn the field red and replace the hint). disabled/readOnly are left off so the field stays interactive.",
    code: `const [value, setValue] = React.useState("ada@twico.dev");

<Input
  label="Work email"
  required
  size="md"               // sm | md | lg
  tone="success"          // primary | success | warning | danger | info | neutral
  leftIcon={<MailIcon />}
  rightIcon={<CheckIcon />}
  hint="We'll only use this to send receipts."   // error="..." replaces the hint and turns the field red
  type="email"
  placeholder="you@twico.dev"
  value={value}                                  // or defaultValue for uncontrolled
  onChange={(e) => setValue(e.target.value)}
/>`,
    render: () => <InputAllProps />,
  },
  {
    title: "A row of fields — reserveFooter",
    description:
      "A hint on ONE field in a row makes that field taller, so align=\"flex-end\" lines the row up by the bottoms and the hinted control ends up sitting a footer's height above its neighbours — the caption moves a different control. align cannot fix it: flex-start lines up the labels instead, so the controls part company as soon as one label wraps. reserveFooter keeps the footer lane open even when empty. Set it per field, or once on any ancestor as data-reserve-footer, which is the safer habit in a row: with a per-field prop alone, adding a field later and forgetting it brings the misalignment straight back. error behaves the same way, and a validation message that appears conditionally is a row that jumps out of alignment conditionally.",
    code: `// One attribute on the row, and every field inside keeps a footer lane.
<Stack direction="row" gap={3} align="flex-end" wrap data-reserve-footer>
  <div style={{ flex: 1 }}><Select label="Filter" options={filters} /></div>
  <div style={{ flex: 1 }}><Select label="Comparison" options={comparisons}
                             hint="Matches anywhere in the value." /></div>
  <div style={{ flex: 1 }}><Input label="Value" /></div>
</Stack>

// ...or per field, when only some of them belong to the row:
<Select label="Filter" options={filters} reserveFooter />

// The lane is held open by generated content, so it matches the real footer by
// construction - same font metrics, same flex gap - and adds no text for a screen
// reader. A field that already has a hint, an error or a counter is left alone.`,
    render: () => <FieldRowDemo />,
  },
];

export default variations;
