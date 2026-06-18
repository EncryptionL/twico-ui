import React from "react";
import { ToastProvider, useToast, Button } from "twico-ui";

// Buttons that exercise the provider: limit (how many stack) + duration (auto-dismiss).
function AllPropsTriggers() {
  const { toast, clear } = useToast();
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button
        size="sm"
        onClick={() =>
          toast.success("Saved", { description: "Uses the provider's 6000ms default duration." })
        }
      >
        Push (default duration)
      </Button>
      <Button
        size="sm"
        variant="soft"
        onClick={() =>
          toast.info("Quick toast", { description: "This one dismisses in 1500ms.", duration: 1500 })
        }
      >
        Push (short)
      </Button>
      <Button size="sm" variant="outline" onClick={clear}>
        Clear all
      </Button>
    </div>
  );
}

// Module-level wrapper so the live example can hold the provider + its children.
function ToastProviderAllProps() {
  return (
    <ToastProvider limit={2} duration={6000}>
      <AllPropsTriggers />
    </ToastProvider>
  );
}

const variations = [
  {
    title: "Default",
    description: "Wrap your app once; call useToast() anywhere underneath to push feedback.",
    code: `function Inner() {
  const { toast } = useToast();
  return <Button onClick={() => toast.success("Changes saved")}>Save</Button>;
}

<ToastProvider>
  <Inner />
</ToastProvider>`,
    render: () => <ToastProviderAllProps />,
  },
  {
    title: "All props",
    description:
      "Every ToastProvider prop: children (the subtree that can call useToast()), limit (max toasts stacked at once — most recent kept), and duration (default auto-dismiss in ms, overridable per toast). Push more than the limit to watch the oldest drop.",
    code: `function Triggers() {
  const { toast, clear } = useToast();
  return (
    <>
      <Button onClick={() => toast.success("Saved", { description: "Uses the 6000ms default." })}>
        Push (default duration)
      </Button>
      <Button onClick={() => toast.info("Quick", { description: "Dismisses fast.", duration: 1500 })}>
        Push (short)
      </Button>
      <Button onClick={clear}>Clear all</Button>
    </>
  );
}

<ToastProvider
  limit={2}        // max toasts shown at once (most recent kept); default 4
  duration={6000}  // default auto-dismiss in ms; 0/Infinity keeps it open; default 4500
>
  <Triggers />     {/* children: the subtree that calls useToast() */}
</ToastProvider>`,
    render: () => <ToastProviderAllProps />,
  },
];

export default variations;
