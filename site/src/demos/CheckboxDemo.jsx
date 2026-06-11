import React, { useState } from "react";
import { Checkbox } from "twico-ui";

export default function CheckboxDemo() {
  const [subscribed, setSubscribed] = useState(true);
  const items = ["Email", "SMS", "Push"];
  const [selected, setSelected] = useState(["Email"]);

  const allChecked = selected.length === items.length;
  const someChecked = selected.length > 0 && !allChecked;

  function toggleItem(item) {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Checkbox
        label="Subscribe to updates"
        description="Get email alerts for new activity"
        checked={subscribed}
        onChange={(e) => setSubscribed(e.target.checked)}
      />
      <Checkbox
        label="Select all channels"
        checked={allChecked}
        indeterminate={someChecked}
        onChange={() => setSelected(allChecked ? [] : [...items])}
      />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingLeft: 24 }}>
        {items.map((item) => (
          <Checkbox
            key={item}
            size="sm"
            label={item}
            checked={selected.includes(item)}
            onChange={() => toggleItem(item)}
          />
        ))}
      </div>
      <Checkbox label="Disabled option" disabled />
    </div>
  );
}
