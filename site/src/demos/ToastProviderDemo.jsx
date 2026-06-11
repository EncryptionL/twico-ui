import React from "react";
import { ToastProvider, useToast, Button } from "twico-ui";

function Inner() {
  const { toast } = useToast();
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="soft" size="sm" onClick={() => toast.success("Saved", { description: "Your changes are live." })}>
        toast.success
      </Button>
      <Button variant="soft" size="sm" onClick={() => toast.error({ title: "Failed", description: "Could not connect to the server." })}>
        toast.error
      </Button>
      <Button variant="soft" size="sm" onClick={() => toast.info("Heads up", { description: "A new version is available." })}>
        toast.info
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
