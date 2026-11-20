import React from "react";
import { FieldRow, Input, Select, Button, IconButton, Stack, Field, Tooltip, Checkbox, Text } from "twico-ui";

// A COMPONENT returning a fragment renders several elements into one cell - nothing sees through a
// render - which is what the fragment-cell rules exist for. Declared here, used by the variations
// below, so each snippet can show the component rather than the expansion.
const Range = () => (
  <>
    <Input label="from" />
    <Text size="sm" tone="muted">to</Text>
    <Input label="to" />
  </>
);
const PairInsert = () => (
  <>
    <Select label="Start from" options={FIELDS} defaultValue="material" />
    <Button variant="outline">Insert</Button>
  </>
);
const PairCheck = () => (
  <>
    <Input label="Name" />
    <Checkbox label="Only active" error="Pick one." />
  </>
);

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
const narrow = { width: "100%", maxWidth: 420 };

// A group of fields shared between rows. As a COMPONENT it renders into one cell, because nothing
// sees through a render; as a VALUE it is flattened into one cell per field.
function Trio() {
  return (
    <>
      <Select label="Field" options={FIELDS} defaultValue="material" />
      <Select label="Operator" options={OPS} defaultValue="contains" />
      <Input label="Value" defaultValue="leather" />
    </>
  );
}

const trio = () => (
  <>
    <Select label="Field" options={FIELDS} defaultValue="material" />
    <Select label="Operator" options={OPS} defaultValue="contains" />
    <Input label="Value" defaultValue="leather" />
  </>
);

// Hooks live in a component, never in a `render` callback — Variations calls render() inline.
function CheckboxErrorExample() {
  const [err, setErr] = React.useState(true);
  return (
    <div style={box}>
      <FieldRow>
        <Input label="Email" defaultValue="someone@example.com" />
        <Checkbox label="Subscribe" error={err ? "Required" : undefined} />
      </FieldRow>
      <div style={{ marginBlockStart: "var(--space-3)" }}>
        <Button size="sm" variant="ghost" onClick={() => setErr((v) => !v)}>
          {err ? "Clear the error" : "Show the error"}
        </Button>
      </div>
    </div>
  );
}

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
    title: "A wrapped field still shares the row",
    description:
      "The cell asks \"is there already a footer in here?\" at any depth, so a field behind a Tooltip — or your own wrapper div — gets one lane, not two, and still stretches. An earlier version asked a direct-child question and gave such a field a 24px ride-up (#519).",
    code: `<FieldRow>
  <Tooltip label="Matched anywhere in the value"><Input label="Value" /></Tooltip>
  <Input label="Other" error="Too long." />
  <Button size="sm" variant="outline">Insert</Button>
</FieldRow>`,
    render: () => (
      <div style={box}>
        <FieldRow>
          <Tooltip label="Matched anywhere in the value" placement="bottom">
            <Input label="Value" defaultValue="leather" />
          </Tooltip>
          <Input label="Other" defaultValue="a value that is too long" error="Too long." />
          <Button size="sm" variant="outline">Insert</Button>
        </FieldRow>
      </div>
    ),
  },
  {
    title: "A validation error does not re-flow the row",
    description:
      "Checkbox, Switch and Radio only grow a field root when they have an error to show. Width is keyed on the control instead, so the text field keeps its width whether or not the message is there — it used to lose 202px of 600 the moment the error appeared (#519).",
    code: `<FieldRow>
  <Input label="Email" />
  <Checkbox label="Subscribe" error={err} />
</FieldRow>`,
    render: () => <CheckboxErrorExample />,
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
    title: "A shared group of fields, wrapping",
    description:
      "A component returning a fragment renders into ONE cell, because React.Children cannot see through a render. In a wrapping row the floor reaches the fields inside that cell anyway, and the cell wraps within itself (#530) — so a shared group breaks at a readable width instead of squashing. Narrow the window to see it break.",
    code: `function Trio() {
  return (
    <>
      <Select label="Field" options={FIELDS} />
      <Select label="Operator" options={OPS} />
      <Input label="Value" />
    </>
  );
}

<FieldRow gap={2} wrap minChildWidth="15rem"><Trio /></FieldRow>`,
    render: () => (
      <div style={narrow}>
        <FieldRow gap={2} wrap minChildWidth="15rem"><Trio /></FieldRow>
      </div>
    ),
  },
  {
    title: "...or as a value, for real cells",
    description:
      "Pass the same group as a VALUE rather than as a component element and it is flattened into one cell per field — the real floor, the real wrap and the footer band — with no duplication at the call site. This is the answer whenever you want the group to break against the ROW's width rather than its own cell's.",
    code: `const trio = () => (
  <>
    <Select label="Field" options={FIELDS} />
    <Select label="Operator" options={OPS} />
    <Input label="Value" />
  </>
);

<FieldRow gap={2} wrap minChildWidth="15rem">{trio()}</FieldRow>`,
    render: () => (
      <div style={narrow}>
        <FieldRow gap={2} wrap minChildWidth="15rem">{trio()}</FieldRow>
      </div>
    ),
  },
  {
    title: "A fragment group with a trailing button",
    description:
      "Such a cell keeps its natural size rather than filling the row, so the floor deliberately does not reach inside it. The button gets the shared lane as margin instead of generated content (#531), because a button is an inline-flex ROW — an ::after on it would land beside the label rather than beneath the control.",
    code: `<FieldRow gap={2}><Trio /><IconButton label="Remove" icon={trash} /></FieldRow>`,
    render: () => (
      <div style={box}>
        <FieldRow gap={2}>
          <Trio />
          <IconButton label="Remove" variant="ghost" tone="danger" icon={TrashIcon} />
        </FieldRow>
      </div>
    ),
  },
  {
    title: "A wrapping row nested in a band row",
    description:
      "The outer row bands its three tracks; the inner row has to stay flex, since grid has no flex-wrap. It is placed across all three tracks on the bottom edge (#532) — without that it matched no placement rule and auto-placed into the LABEL track, inflating it from 27px to 190px.",
    code: `<FieldRow gap={2}>
  <Select label="Field" options={FIELDS} />
  <FieldRow gap={2} wrap minChildWidth="12rem">
    <Input label="From" />
    <Input label="To" />
  </FieldRow>
</FieldRow>`,
    render: () => (
      <div style={box}>
        <FieldRow gap={2}>
          <Select label="Field" options={FIELDS} defaultValue="material" />
          <FieldRow gap={2} wrap minChildWidth="12rem">
            <Input label="From" defaultValue="0" />
            <Input label="To" defaultValue="100" />
          </FieldRow>
        </FieldRow>
      </div>
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
  {
    title: "A range row — a word between two fields",
    description:
      "The commonest reason to share a fragment, and the shape minChildWidth must not floor. The floor is a readable width for an input, not a width for a word (#536): it reaches the fields in the cell, and a field behind a Tooltip or a host div, but nothing else. Resize the page — the row breaks when the two fields no longer fit, not when the word does not.",
    code: `const Range = () => (
  <>
    <Input label="from" />
    <Text size="sm" tone="muted">to</Text>
    <Input label="to" />
  </>
);

<FieldRow gap={2} wrap minChildWidth="15rem">
  <Range />
</FieldRow>`,
    render: () => (
      <div style={box}>
        <FieldRow gap={2} wrap minChildWidth="15rem">
          <Range />
        </FieldRow>
      </div>
    ),
  },
  {
    title: "footerLines reaches a shared group too",
    description:
      "footerLines is the band's floor, and a fragment cell holds two lanes of its own — the one its fields draw and the one its plain children take as margin. Both read the same token now (#537); before, a shared group's Button sat (n − 1) × 18px above the row's band as soon as footerLines went past 1. The Insert button's bottom edge lines up with the Select's control at every value.",
    code: `const Pair = () => (
  <>
    <Select label="Start from" options={FIELDS} defaultValue="material" />
    <Button variant="outline">Insert</Button>
  </>
);

<FieldRow gap={2} footerLines={3}>
  <Input label="Rename to" hint="Three lines are held open for whatever the longest footer in this row turns out to be." />
  <Pair />
</FieldRow>`,
    render: () => (
      <div style={box}>
        <FieldRow gap={2} footerLines={3}>
          <Input label="Rename to" hint="Three lines are held open for whatever the longest footer in this row turns out to be." />
          <PairInsert />
        </FieldRow>
      </div>
    ),
  },
  {
    title: "A shared group stays on the band when a sibling's footer wraps",
    description:
      "A fragment cell holding a plain control is laid out by the row's own three tracks (#538), so a sibling whose error wraps to three lines makes the ROW taller and moves nothing. It used to drop out of the row template and carry a fixed one-line lane instead, which left it up to 72px out of line — and only when something elsewhere in the row had a footer, so it looked fine in isolation.",
    code: `const Pair = ({ err }) => (
  <>
    <Input label="Name" />
    <Checkbox label="Only active" error={err} />
  </>
);

<FieldRow gap={2}>
  <Input label="Template" error="A message long enough that it wraps onto more than one line in this column." />
  <Pair err="Pick one." />
</FieldRow>`,
    render: () => (
      <div style={box}>
        <FieldRow gap={2}>
          <Input label="Template" error="A message long enough that it wraps onto more than one line in this column." />
          <PairCheck />
        </FieldRow>
      </div>
    ),
  },
];

export default variations;
