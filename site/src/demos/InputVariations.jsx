import React from "react";
import { Input } from "twico-ui";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

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
];

export default variations;
