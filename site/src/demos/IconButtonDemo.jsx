import React from "react";
import { IconButton } from "twico-ui";

const StarIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
  </svg>
);

export default function IconButtonDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <IconButton aria-label="Star solid" variant="solid" icon={StarIcon} />
      <IconButton aria-label="Star soft" variant="soft" icon={StarIcon} />
      <IconButton aria-label="Star outline" variant="outline" icon={StarIcon} />
      <IconButton aria-label="Star ghost" variant="ghost" icon={StarIcon} />
      <IconButton aria-label="Star small" size="sm" icon={StarIcon} />
      <IconButton aria-label="Star large" size="lg" icon={StarIcon} />
      <IconButton aria-label="Star round" variant="soft" round icon={StarIcon} />
      <IconButton aria-label="Star disabled" variant="solid" disabled icon={StarIcon} />
    </div>
  );
}
