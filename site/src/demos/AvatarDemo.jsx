import React from "react";
import { Avatar } from "twico-ui";

export default function AvatarDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Avatar
        src="https://i.pravatar.cc/80?img=5"
        name="Jane Doe"
        size="lg"
      />
      <Avatar name="Sam Lee" status="online" />
      <Avatar name="Ava Park" status="busy" size="sm" />
      <Avatar name="Twico" size="lg" square ring />
      <Avatar name="No Image" size="xl" />
    </div>
  );
}
