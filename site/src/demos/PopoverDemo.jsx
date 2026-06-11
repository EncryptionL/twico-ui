import React from "react";
import { Popover, Button, Input } from "twico-ui";

export default function PopoverDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Popover
        trigger={<Button variant="outline">Share</Button>}
        title="Share link"
        placement="bottom"
        align="center"
        width={260}
      >
        <Input defaultValue="https://twico.dev/x" />
        <Button fullWidth>Copy link</Button>
      </Popover>
    </div>
  );
}
