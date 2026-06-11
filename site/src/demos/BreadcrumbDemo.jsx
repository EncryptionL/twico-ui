import React from "react";
import { Breadcrumb } from "twico-ui";

export default function BreadcrumbDemo() {
  const trail = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Twico UI", href: "/projects/twico-ui" },
    { label: "Components", href: "/projects/twico-ui/components" },
    { label: "Breadcrumb" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: "Breadcrumb" },
        ]}
      />
      <Breadcrumb maxItems={3} items={trail} />
    </div>
  );
}
