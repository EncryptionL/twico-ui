import React from "react";
import { ToastProvider, useToast, Button } from "twico-ui";

// Real-world usage: each button describes an *action*; the toast is the feedback.
function Inner() {
  const { toast } = useToast();
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button size="sm" onClick={() => toast.success("Changes saved", { description: "Your profile is up to date." })}>
        Save changes
      </Button>
      <Button size="sm" tone="danger" variant="soft" onClick={() => toast.error({ title: "Couldn’t save", description: "Check your connection and try again." })}>
        Delete item
      </Button>
      <Button size="sm" variant="soft" onClick={() => toast.info("Update available", { description: "Version 2.1 is ready to install." })}>
        Check for updates
      </Button>
    </div>
  );
}

export default function ToastProviderDemo() {
  return (
    <ToastProvider limit={3}>
      <Inner />
    </ToastProvider>
  );
}
