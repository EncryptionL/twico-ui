import React, { useState } from "react";
import { Button, Drawer, Text } from "twico-ui";

export default function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="soft" onClick={() => setOpen(true)}>Open filters</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        width={380}
        title="Filters"
        description="Narrow down the results"
        footer={<Button onClick={() => setOpen(false)}>Apply</Button>}
      >
        <Text>Adjust your filter options here, then apply the changes.</Text>
      </Drawer>
    </div>
  );
}
