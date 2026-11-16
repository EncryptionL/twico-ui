import React from "react";
import { FieldRow, Input, Select, Button, Text } from "twico-ui";

const FILTERS = [
  { label: "Material", value: "material" },
  { label: "Description", value: "desc" },
];
const COMPARISONS = [
  { label: "Contains", value: "contains" },
  { label: "Exact match", value: "exact" },
];

const caption = {
  fontSize: "var(--text-xs)",
  color: "var(--color-text-muted)",
  marginBlockEnd: "var(--space-2)",
};

export default function FieldRowDemo() {
  // The error is what makes the point: it appears on one field only, so without a shared lane the
  // other field and the trailing button would both ride up by a footer's height.
  const [value, setValue] = React.useState("a value that is too long to be accepted here");
  const tooLong = value.length > 24;

  return (
    <div style={{ display: "grid", gap: "var(--space-6)", width: "100%", maxWidth: 680 }}>
      <div>
        <div style={caption}>
          A row of fields <strong>plus a control</strong>. Type to clear the error — the row holds its
          alignment either way.
        </div>
        <FieldRow>
          <Select label="Filter" options={FILTERS} defaultValue="material" />
          <Input
            label="…to this value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={tooLong ? "28 characters; the limit is 24." : undefined}
          />
          <Button size="sm" variant="outline">Insert</Button>
        </FieldRow>
      </div>

      <div>
        <div style={caption}>
          Children need no props: fields share the width, the button keeps its natural size, and a
          field that already has a hint keeps its own footer rather than gaining a second lane.
        </div>
        <FieldRow wrap>
          <Select label="Comparison" options={COMPARISONS} defaultValue="contains" hint="Matches anywhere in the value." />
          <Input label="Value" defaultValue="leather" />
          <Button size="sm" variant="ghost" tone="danger">Remove</Button>
        </FieldRow>
      </div>

      <Text size="xs" tone="muted">
        Without the shared lane, the “Insert” button would sit a footer’s height below the box it
        writes into the moment the field above showed an error.
      </Text>
    </div>
  );
}
