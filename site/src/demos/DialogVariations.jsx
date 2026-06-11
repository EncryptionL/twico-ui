import React from "react";
import { Dialog, Button } from "twico-ui";

function BasicDialogExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Welcome aboard"
        description="A quick tour of what you can do here."
        footer={<Button onClick={() => setOpen(false)}>Got it</Button>}
      >
        You can manage projects, invite teammates, and track progress all in one place.
      </Dialog>
    </>
  );
}

function ConfirmDialogExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete project</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete project?"
        description="This action cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
          </>
        }
      >
        The project and all its data will be permanently removed.
      </Dialog>
    </>
  );
}

function SizesDialogExample() {
  const [size, setSize] = React.useState(null);
  return (
    <>
      <Button variant="outline" onClick={() => setSize("sm")}>Small</Button>
      <Button variant="outline" onClick={() => setSize("md")}>Medium</Button>
      <Button variant="outline" onClick={() => setSize("lg")}>Large</Button>
      <Dialog
        open={size !== null}
        onClose={() => setSize(null)}
        size={size || "md"}
        title={`Size: ${size || "md"}`}
        description="Dialogs come in three widths."
        footer={<Button onClick={() => setSize(null)}>Close</Button>}
      >
        Pick the width that fits your content density.
      </Dialog>
    </>
  );
}

function NoBackdropCloseExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="soft" onClick={() => setOpen(true)}>Start task</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        closeOnBackdrop={false}
        title="Processing"
        description="Clicking outside won't dismiss this dialog."
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        Use closeOnBackdrop={"{false}"} for flows that require an explicit decision.
      </Dialog>
    </>
  );
}

function ContentOnlyDialogExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>Show details</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <strong>Custom content</strong>
          <span>No title, description, or footer — just children and the close button.</span>
        </div>
      </Dialog>
    </>
  );
}

const variations = [
  {
    title: "Basic",
    description: "Title, description, body, and a single confirm action.",
    code: `const [open, setOpen] = React.useState(false);

<Button onClick={() => setOpen(true)}>Open dialog</Button>
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Welcome aboard"
  description="A quick tour of what you can do here."
  footer={<Button onClick={() => setOpen(false)}>Got it</Button>}
>
  You can manage projects, invite teammates, and track progress all in one place.
</Dialog>`,
    render: () => <BasicDialogExample />,
  },
  {
    title: "Confirmation",
    description: "Destructive flow with Cancel + danger action in the footer.",
    code: `const [open, setOpen] = React.useState(false);

<Button variant="danger" onClick={() => setOpen(true)}>Delete project</Button>
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete project?"
  description="This action cannot be undone."
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
    </>
  }
>
  The project and all its data will be permanently removed.
</Dialog>`,
    render: () => <ConfirmDialogExample />,
  },
  {
    title: "Sizes",
    description: "Three widths via the size prop: sm, md, lg.",
    code: `const [size, setSize] = React.useState(null);

<Button variant="outline" onClick={() => setSize("sm")}>Small</Button>
<Button variant="outline" onClick={() => setSize("md")}>Medium</Button>
<Button variant="outline" onClick={() => setSize("lg")}>Large</Button>
<Dialog
  open={size !== null}
  onClose={() => setSize(null)}
  size={size || "md"}
  title={\`Size: \${size || "md"}\`}
  description="Dialogs come in three widths."
  footer={<Button onClick={() => setSize(null)}>Close</Button>}
>
  Pick the width that fits your content density.
</Dialog>`,
    render: () => <SizesDialogExample />,
  },
  {
    title: "No backdrop close",
    description: "Set closeOnBackdrop={false} to require an explicit action.",
    code: `const [open, setOpen] = React.useState(false);

<Button variant="soft" onClick={() => setOpen(true)}>Start task</Button>
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  closeOnBackdrop={false}
  title="Processing"
  description="Clicking outside won't dismiss this dialog."
  footer={<Button onClick={() => setOpen(false)}>Done</Button>}
>
  Use closeOnBackdrop={false} for flows that require an explicit decision.
</Dialog>`,
    render: () => <NoBackdropCloseExample />,
  },
  {
    title: "Content only",
    description: "Custom children without title, description, or footer.",
    code: `const [open, setOpen] = React.useState(false);

<Button variant="ghost" onClick={() => setOpen(true)}>Show details</Button>
<Dialog open={open} onClose={() => setOpen(false)}>
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <strong>Custom content</strong>
    <span>No title, description, or footer — just children and the close button.</span>
  </div>
</Dialog>`,
    render: () => <ContentOnlyDialogExample />,
  },
];

export default variations;
