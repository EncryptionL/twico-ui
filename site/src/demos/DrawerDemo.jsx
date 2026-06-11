import React, { useState } from "react";
import { Drawer } from "twico-ui";

export default function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <button onClick={() => setOpen(true)}>Open filters</button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        size={380}
        title="Filters"
        description="Narrow down the results"
        footer={<button onClick={() => setOpen(false)}>Apply</button>}
      >
        <p>Adjust your filter options here, then apply the changes.</p>
      </Drawer>
    </div>
  );
}
