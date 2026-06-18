import React from "react";
import { Input } from "twico-ui";

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
];

export default variations;
