import React from "react";
import { Avatar } from "twico-ui";

// Self-contained avatar image (no CDN) — a gradient person silhouette as a data URI.
const FACE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c83ff'/%3E%3Cstop offset='1' stop-color='%23c265f0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='96' height='96' fill='url(%23g)'/%3E%3Ccircle cx='48' cy='38' r='16' fill='%23ffffff' opacity='0.95'/%3E%3Cpath d='M18 90c0-18 13-29 30-29s30 11 30 29z' fill='%23ffffff' opacity='0.95'/%3E%3C/svg%3E";

export default function AvatarDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Avatar src={FACE} name="Jane Doe" size="lg" />
      <Avatar name="Sam Lee" status="online" />
      <Avatar name="Ava Park" status="busy" size="sm" />
      <Avatar name="Twico" size="lg" square ring />
      <Avatar name="No Image" size="xl" />
    </div>
  );
}
