import React from "react";
import { Button, Drawer, Text, Input } from "twico-ui";

function SidesExample() {
  const [side, setSide] = React.useState(null);
  return (
    <>
      <Button variant="soft" onClick={() => setSide("left")}>Left</Button>
      <Button variant="soft" onClick={() => setSide("right")}>Right</Button>
      <Button variant="soft" onClick={() => setSide("top")}>Top</Button>
      <Button variant="soft" onClick={() => setSide("bottom")}>Bottom</Button>
      <Drawer
        open={side !== null}
        onClose={() => setSide(null)}
        side={side || "right"}
        title={`Panel from the ${side || ""}`}
      >
        <Text>This panel slides in from the {side} edge of the screen.</Text>
      </Drawer>
    </>
  );
}

function HeaderFooterExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open filters</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        width={380}
        title="Filters"
        description="Narrow down the results"
        footer={<Button onClick={() => setOpen(false)}>Apply</Button>}
      >
        <Input label="Search" placeholder="Keyword…" />
      </Drawer>
    </>
  );
}

function SizeExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="soft" onClick={() => setOpen(true)}>Open wide drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        width={520}
        title="Order details"
      >
        <Text>A wider panel (520px) suited to dense content and detail views.</Text>
      </Drawer>
    </>
  );
}

function BarePanelExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Open menu</Button>
      <Drawer open={open} onClose={() => setOpen(false)} side="left" width={260}>
        <Text>A bare panel with no title, description, or footer — ideal for a navigation menu.</Text>
      </Drawer>
    </>
  );
}

function NoBackdropCloseExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="soft" onClick={() => setOpen(true)}>Open sticky drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        title="Confirm changes"
        closeOnBackdrop={false}
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        <Text>Clicking the backdrop won't dismiss this — use Done or Esc to close.</Text>
      </Drawer>
    </>
  );
}

const variations = [
  {
    title: "Sides",
    description: "Anchor the panel to any screen edge.",
    code: `<Drawer open={open} onClose={close} side="left" title="Panel from the left">…</Drawer>
<Drawer open={open} onClose={close} side="right" title="Panel from the right">…</Drawer>
<Drawer open={open} onClose={close} side="top" title="Panel from the top">…</Drawer>
<Drawer open={open} onClose={close} side="bottom" title="Panel from the bottom">…</Drawer>`,
    render: () => <SidesExample />,
  },
  {
    title: "Header, description & footer",
    description: "A full layout: title, supporting text, body, and a footer action.",
    code: `<Drawer
  open={open}
  onClose={close}
  side="right"
  width={380}
  title="Filters"
  description="Narrow down the results"
  footer={<Button onClick={close}>Apply</Button>}
>
  <Input label="Search" placeholder="Keyword…" />
</Drawer>`,
    render: () => <HeaderFooterExample />,
  },
  {
    title: "Custom size",
    description: "Set the panel width (left/right) or height (top/bottom).",
    code: `<Drawer open={open} onClose={close} side="right" width={520} title="Order details">
  …
</Drawer>`,
    render: () => <SizeExample />,
  },
  {
    title: "Bare panel",
    description: "No title, description, or footer — just content.",
    code: `<Drawer open={open} onClose={close} side="left" width={260}>
  …navigation links…
</Drawer>`,
    render: () => <BarePanelExample />,
  },
  {
    title: "Backdrop won't close",
    description: "Set closeOnBackdrop={false} to require an explicit action or Esc.",
    code: `<Drawer
  open={open}
  onClose={close}
  side="right"
  title="Confirm changes"
  closeOnBackdrop={false}
  footer={<Button onClick={close}>Done</Button>}
>
  …
</Drawer>`,
    render: () => <NoBackdropCloseExample />,
  },
];

export default variations;
