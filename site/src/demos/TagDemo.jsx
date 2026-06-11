import React, { useState } from "react";
import { Tag } from "twico-ui";

export default function TagDemo() {
  const [tags, setTags] = useState(["react", "design-system", "ui"]);
  const remove = (name) => setTags((prev) => prev.filter((t) => t !== name));
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      {tags.map((t) => (
        <Tag key={t} leftIcon={<span>#</span>} onRemove={() => remove(t)}>
          {t}
        </Tag>
      ))}
      <Tag>read-only</Tag>
    </div>
  );
}
