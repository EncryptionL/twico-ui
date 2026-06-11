import React, { useState } from "react";
import { Navbar } from "twico-ui";

export default function NavbarDemo() {
  const [active, setActive] = useState("Dashboard");
  const items = ["Dashboard", "Projects", "Team"];
  return (
    <Navbar
      brand={<>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>}
      links={items.map((label) => ({
        label,
        active: active === label,
        onClick: () => setActive(label),
      }))}
      actions={<button onClick={() => alert("Sign in")}>Sign in</button>}
      onMenuClick={() => alert("Open menu")}
    />
  );
}
