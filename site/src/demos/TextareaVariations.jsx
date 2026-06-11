import React from "react";
import { Textarea } from "twico-ui";

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
];

export default variations;
