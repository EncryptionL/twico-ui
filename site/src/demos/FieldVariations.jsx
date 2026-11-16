import React from "react";
import { Field } from "twico-ui";

// Field is layout-only chrome: it renders the label / required asterisk / hint / error and leaves
// the control to you. A BARE <input style={inputStyle}> therefore renders with the browser's own look, which made this
// page show unstyled boxes under "Variations" while the "Usage" demo above it looked right -
// FieldDemo.jsx has always styled its input from tokens. Same object here, so both halves agree and
// the page demonstrates what Field is for: giving a custom control the built-in inputs' treatment.
const inputStyle = {
  height: "var(--control-h-md)",
  padding: "0 var(--space-3)",
  border: "var(--border-thin) solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  font: "inherit",
  fontSize: "var(--text-sm)",
  color: "var(--color-text)",
  background: "var(--color-surface)",
  width: "100%",
};

const variations = [
  {
    title: "Label, hint & required",
    description: "Field is layout-only chrome: it renders a label, your control, and a single hint line. The required asterisk follows the label.",
    code: `// Field styles nothing itself — give your control the tokens:
// const inputStyle = { height: "var(--control-h-md)", border: "var(--border-thin) solid var(--color-border)",
//   borderRadius: "var(--radius-md)", padding: "0 var(--space-3)", font: "inherit", width: "100%" };
<Field label="Email" hint="We never share it." required htmlFor="email">
  <input style={inputStyle} id="email" placeholder="you@twico.dev" />
</Field>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Field label="Email" hint="We never share it." required htmlFor="email-1">
          <input style={inputStyle} id="email-1" placeholder="you@twico.dev" />
        </Field>
      </div>
    ),
  },
  {
    title: "Error state",
    description: "Passing `error` replaces the hint and renders it in the danger color (error wins when both are given).",
    code: `<Field label="Email" error="Enter a valid email address" htmlFor="email-err">
  <input style={inputStyle} id="email-err" defaultValue="not-an-email" aria-invalid />
</Field>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Field label="Email" error="Enter a valid email address" htmlFor="email-2">
          <input style={inputStyle} id="email-2" defaultValue="not-an-email" aria-invalid />
        </Field>
      </div>
    ),
  },
  {
    title: "Sizes",
    description: "size is reserved for parity with Input/Select and exposed via the data-size attribute.",
    code: `<Field size="sm" label="Small" htmlFor="s1"><input style={inputStyle} id="s1" /></Field>
<Field size="md" label="Medium" htmlFor="s2"><input style={inputStyle} id="s2" /></Field>
<Field size="lg" label="Large" htmlFor="s3"><input style={inputStyle} id="s3" /></Field>`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 340, maxWidth: "100%" }}>
        <Field size="sm" label="Small" htmlFor="size-sm"><input style={inputStyle} id="size-sm" /></Field>
        <Field size="md" label="Medium" htmlFor="size-md"><input style={inputStyle} id="size-md" /></Field>
        <Field size="lg" label="Large" htmlFor="size-lg"><input style={inputStyle} id="size-lg" /></Field>
      </div>
    ),
  },
  {
    title: "All props",
    description: "Every Field-specific prop in one place. Field is layout-only chrome (no component callbacks): label, required asterisk, size, an htmlFor that binds the <label> to your control, and a single message line — hint here, with error replacing it when present. id is set so the hint/error element gets `${id}-desc`; wire your control's aria-describedby to it.",
    code: `<Field
  id="profile-name"        // hint/error element becomes \`\${id}-desc\`
  label="Display name"     // any ReactNode
  required={true}          // adds an asterisk after the label
  size="md"                // sm | md | lg (exposed via data-size)
  htmlFor="profile-name-input"  // binds the <label> to your control
  hint="Shown on your public profile."
  // error="Name is required"   // when set, error replaces the hint (danger color)
>
  <input style={inputStyle}
    id="profile-name-input"
    aria-describedby="profile-name-desc"
    placeholder="Ada Lovelace"
  />
</Field>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Field
          id="profile-name"
          label="Display name"
          required={true}
          size="md"
          htmlFor="profile-name-input"
          hint="Shown on your public profile."
        >
          <input style={inputStyle}
            id="profile-name-input"
            aria-describedby="profile-name-desc"
            placeholder="Ada Lovelace"
          />
        </Field>
      </div>
    ),
  },
];

export default variations;
