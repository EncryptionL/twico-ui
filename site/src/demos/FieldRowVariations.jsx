import React from "react";
import { FieldRow, Input, Select, Button, IconButton, Stack, Field } from "twico-ui";

const FIELDS = [
  { label: "Material", value: "material" },
  { label: "Description", value: "desc" },
  { label: "Supplier", value: "supplier" },
];
const OPS = [
  { label: "Contains", value: "contains" },
  { label: "Exact match", value: "exact" },
  { label: "Is empty", value: "empty" },
];

const TrashIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </svg>
);

const box = { width: "100%", maxWidth: 560 };

// Hooks live in a component, never in a `render` callback — Variations calls render() inline.
function ConditionalFieldExample() {
  const [op, setOp] = React.useState("empty");
  return (
    <div style={box}>
      <FieldRow>
        <Select label="Comparison" options={OPS} value={op} onChange={(v) => setOp(v || "empty")} />
        {op !== "empty" && <Input label="Value" defaultValue="leather" />}
        <Button size="sm" variant="outline">Add</Button>
      </FieldRow>
    </div>
  );
}

const variations = [
  {
    title: "A field and a control, aligned",
    description:
      "The case reserveFooter could not reach. The error makes the left field taller, but the button is in a cell with a matching footer lane, so it stays level with the box it writes into instead of riding up by a footer's height.",
    code: `<FieldRow>
  <Input label="…to this value" error="28 characters; the limit is 24." />
  <Button size="sm" variant="outline">Insert</Button>
</FieldRow>`,
    render: () => (
      <div style={box}>
        <FieldRow>
          <Input label="…to this value" defaultValue="a value that is too long" error="28 characters; the limit is 24." />
          <Button size="sm" variant="outline">Insert</Button>
        </FieldRow>
      </div>
    ),
  },
  {
    title: "A condition row",
    description:
      "The shape this exists for: two fields, a value, and a remove button at the end. Children need no props — the fields share the width, the IconButton keeps its natural size, and nothing has to know which is which.",
    code: `<FieldRow>
  <Select label="Field" options={FIELDS} defaultValue="material" />
  <Select label="Comparison" options={OPS} defaultValue="contains" />
  <Input label="Value" defaultValue="leather" />
  <IconButton aria-label="Remove condition" variant="ghost" tone="danger" icon={TrashIcon} />
</FieldRow>`,
    render: () => (
      <div style={box}>
        <FieldRow>
          <Select label="Field" options={FIELDS} defaultValue="material" />
          <Select label="Comparison" options={OPS} defaultValue="contains" />
          <Input label="Value" defaultValue="leather" />
          <IconButton aria-label="Remove condition" variant="ghost" tone="danger" icon={TrashIcon} />
        </FieldRow>
      </div>
    ),
  },
  {
    title: "A field that already has a footer keeps it",
    description:
      "The lane is decided per cell with :has(), so a field carrying its own hint or error renders that and gains no second lane — the row is the same height whether the message is there or not.",
    code: `<FieldRow>
  <Select label="Comparison" options={OPS} defaultValue="contains" hint="Matches anywhere in the value." />
  <Input label="Value" defaultValue="leather" />
  <Button size="sm" variant="ghost" tone="danger">Remove</Button>
</FieldRow>`,
    render: () => (
      <div style={box}>
        <FieldRow>
          <Select label="Comparison" options={OPS} defaultValue="contains" hint="Matches anywhere in the value." />
          <Input label="Value" defaultValue="leather" />
          <Button size="sm" variant="ghost" tone="danger">Remove</Button>
        </FieldRow>
      </div>
    ),
  },
  {
    title: "Gap and wrap",
    description:
      "gap takes a spacing step or any CSS length, the same way Stack's does. wrap lets the row break onto more lines rather than squeezing every field below a usable width.",
    code: `<FieldRow gap={1.5}>…</FieldRow>
<FieldRow gap="20px">…</FieldRow>
<FieldRow wrap>…</FieldRow>`,
    render: () => (
      <Stack gap={4} style={box}>
        <FieldRow gap={1.5}>
          <Input label="Tight gap" defaultValue="1.5" />
          <Input label="Value" defaultValue="leather" />
          <Button size="sm" variant="outline">Add</Button>
        </FieldRow>
        <FieldRow gap="20px">
          <Input label="Wide gap" defaultValue="20px" />
          <Input label="Value" defaultValue="leather" />
          <Button size="sm" variant="outline">Add</Button>
        </FieldRow>
        <div style={{ width: 300, resize: "horizontal", overflow: "auto", paddingBlockEnd: 4 }}>
          <FieldRow wrap>
            <Select label="Field" options={FIELDS} defaultValue="material" />
            <Input label="Value" defaultValue="leather" />
            <Button size="sm" variant="outline">Add</Button>
          </FieldRow>
        </div>
      </Stack>
    ),
  },
  {
    title: "Null children leave no hole",
    description:
      "A conditionally-rendered field would otherwise leave an empty cell that still draws a lane and still takes part in the gap. FieldRow drops null and false children instead.",
    code: `function ConditionalFieldExample() {
  const [op, setOp] = React.useState("empty");
  return (
    <FieldRow>
      <Select label="Comparison" options={OPS} value={op} onChange={(v) => setOp(v || "empty")} />
      {op !== "empty" && <Input label="Value" />}
      <Button size="sm" variant="outline">Add</Button>
    </FieldRow>
  );
}`,
    render: () => <ConditionalFieldExample />,
  },
  {
    title: "All props",
    description:
      "Every FieldRow prop in one place. It is layout only — no callbacks of its own — and anything else you pass lands on the row element, so data-* and aria-* go straight through.",
    code: `<FieldRow
  gap={3}                 // spacing step (3 -> var(--space-3)) or any CSS length
  wrap={false}            // allow the row to break onto more lines
  className="my-row"      // appended to twc-fieldrow, never replacing it
  style={{ maxWidth: 560 }}  // merged after the row's own gap
  aria-label="Filter condition"  // ...rest lands on the row element
>
  <Select label="Field" options={FIELDS} defaultValue="material" />
  <Input label="Value" defaultValue="leather" />
  <Button size="sm" variant="outline">Add</Button>
</FieldRow>`,
    render: () => (
      <FieldRow gap={3} wrap={false} style={box} aria-label="Filter condition">
        <Select label="Field" options={FIELDS} defaultValue="material" />
        <Input label="Value" defaultValue="leather" />
        <Button size="sm" variant="outline">Add</Button>
      </FieldRow>
    ),
  },
  {
    title: "The per-field escape hatch",
    description:
      "For a row you lay out yourself, #494's reserveFooter still works: set it on each field, or once on an ancestor. Wrapping a non-field control in a Field with reserveFooter gives it the same lane by hand.",
    code: `<Stack direction="row" gap={3} align="flex-end" data-reserve-footer>
  <Input label="…to this value" error="28 characters; the limit is 24." />
  <Field reserveFooter>
    <Button size="sm" variant="outline">Insert</Button>
  </Field>
</Stack>`,
    render: () => (
      <Stack direction="row" gap={3} align="flex-end" style={box} data-reserve-footer>
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <Input label="…to this value" defaultValue="a value that is too long" error="28 characters; the limit is 24." />
        </div>
        <Field reserveFooter>
          <Button size="sm" variant="outline">Insert</Button>
        </Field>
      </Stack>
    ),
  },
];

export default variations;
