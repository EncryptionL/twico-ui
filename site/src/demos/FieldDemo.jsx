import React from "react";
import { Field } from "twico-ui";

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

export default function FieldDemo() {
  return (
    <div style={{ display: "grid", gap: 18, maxWidth: 360 }}>
      <Field label="Email" hint="We'll never share it." required id="demo-email" htmlFor="demo-email-input">
        <input
          id="demo-email-input"
          type="email"
          placeholder="you@example.com"
          aria-describedby="demo-email-desc"
          style={inputStyle}
        />
      </Field>
      <Field label="API token" error="That token is invalid." id="demo-token" htmlFor="demo-token-input">
        <input
          id="demo-token-input"
          aria-invalid="true"
          aria-describedby="demo-token-desc"
          defaultValue="sk_live_oops"
          style={{ ...inputStyle, borderColor: "var(--color-danger)" }}
        />
      </Field>
    </div>
  );
}
