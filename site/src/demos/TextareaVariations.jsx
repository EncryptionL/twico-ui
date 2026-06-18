import React from "react";
import { Textarea } from "twico-ui";

function TextareaAllProps() {
  const [value, setValue] = React.useState("Twico UI ships with dark mode, motion, and RTL out of the box.");
  return (
    <div style={{ width: 340, maxWidth: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
      <Textarea
        label="Release notes"
        required                      // adds the asterisk + forwards to the native textarea
        size="md"                     // sm | md | lg
        tone="info"                   // primary | success | warning | danger | info | neutral
        hint="Markdown is supported"  // shown below; error replaces it when present
        value={value}                 // or defaultValue for uncontrolled
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        maxLength={500}
        placeholder="What changed in this release?"
        disabled={false}
        readOnly={false}
      />
      {/* error replaces the hint and outlines the field in red */}
      <Textarea
        label="Summary"
        size="lg"
        tone="danger"
        error="Summary is required"
        rows={2}
        placeholder="One-line summary"
      />
    </div>
  );
}

const variations = [
  {
    title: "Basic",
    description: "Label, placeholder, and a helper hint below the field.",
    code: `<Textarea
  label="Bio"
  rows={4}
  placeholder="Tell us about yourself"
  hint="Max 280 characters"
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Textarea
          label="Bio"
          rows={4}
          placeholder="Tell us about yourself"
          hint="Max 280 characters"
        />
      </div>
    ),
  },
  {
    title: "Required",
    description: "An asterisk marks the field as required.",
    code: `<Textarea
  label="Message"
  required
  rows={4}
  placeholder="Write your message"
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Textarea
          label="Message"
          required
          rows={4}
          placeholder="Write your message"
        />
      </div>
    ),
  },
  {
    title: "Error",
    description: "An error message replaces the hint and outlines the field in red.",
    code: `<Textarea
  label="Feedback"
  rows={3}
  placeholder="What went wrong?"
  error="This field is required"
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Textarea
          label="Feedback"
          rows={3}
          placeholder="What went wrong?"
          error="This field is required"
        />
      </div>
    ),
  },
  {
    title: "Disabled",
    description: "Non-editable field with a sunken background.",
    code: `<Textarea
  label="Notes"
  rows={3}
  disabled
  defaultValue="This content cannot be edited."
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Textarea
          label="Notes"
          rows={3}
          disabled
          defaultValue="This content cannot be edited."
        />
      </div>
    ),
  },
  {
    title: "With length limit",
    description: "Native textarea attributes like rows and maxLength are passed through.",
    code: `<Textarea
  label="Tweet"
  rows={5}
  maxLength={280}
  placeholder="What's happening?"
  hint="Up to 280 characters"
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Textarea
          label="Tweet"
          rows={5}
          maxLength={280}
          placeholder="What's happening?"
          hint="Up to 280 characters"
        />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every Textarea-specific prop in one place — label, required, size, tone, and the hint/error pair (error replaces hint and turns the field red). Shown controlled via value + onChange; disabled/readOnly are left off so the field stays interactive. Native textarea attributes (rows, maxLength, placeholder) pass straight through.",
    code: `const [value, setValue] = React.useState("Twico UI ships with dark mode, motion, and RTL out of the box.");

<Textarea
  label="Release notes"
  required                      // adds the asterisk + forwards to the native textarea
  size="md"                     // sm | md | lg
  tone="info"                   // primary | success | warning | danger | info | neutral
  hint="Markdown is supported"  // shown below; error replaces it when present
  value={value}                 // or defaultValue for uncontrolled
  onChange={(e) => setValue(e.target.value)}
  rows={4}
  maxLength={500}
  placeholder="What changed in this release?"
  disabled={false}
  readOnly={false}
/>

{/* error replaces the hint and outlines the field in red */}
<Textarea
  label="Summary"
  size="lg"
  tone="danger"
  error="Summary is required"
  rows={2}
  placeholder="One-line summary"
/>`,
    render: () => <TextareaAllProps />,
  },
];

export default variations;
