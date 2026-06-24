import React, { useState } from "react";
import { Navbar, Button } from "twico-ui";

export default function NavbarDemo() {
  const [active, setActive] = useState("Dashboard");
  const items = ["Dashboard", "Projects", "Team"];
  return (
    <Navbar
      brand={<>Twico <span style={{ color: "var(--color-primary)" }}>UI</span></>}
      links={items.map((label) => ({
        label,
        active: active === label,
        onClick: () => setActive(label),
      }))}
      actions={<Button size="sm">Sign in</Button>}
    />
  );
}
