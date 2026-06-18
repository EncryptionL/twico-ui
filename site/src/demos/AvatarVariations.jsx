import React from "react";
import { Avatar } from "twico-ui";

// Self-contained avatar image (no CDN) — a gradient person silhouette as a data URI.
const FACE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c83ff'/%3E%3Cstop offset='1' stop-color='%23c265f0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='96' height='96' fill='url(%23g)'/%3E%3Ccircle cx='48' cy='38' r='16' fill='%23ffffff' opacity='0.95'/%3E%3Cpath d='M18 90c0-18 13-29 30-29s30 11 30 29z' fill='%23ffffff' opacity='0.95'/%3E%3C/svg%3E";

const variations = [
  {
    title: "Sizes",
    description: "Five sizes from xs to xl. Initials are derived from name.",
    code: `<Avatar name="Jane Doe" size="xs" />
<Avatar name="Jane Doe" size="sm" />
<Avatar name="Jane Doe" size="md" />
<Avatar name="Jane Doe" size="lg" />
<Avatar name="Jane Doe" size="xl" />`,
    render: () => (
      <>
        <Avatar name="Jane Doe" size="xs" />
        <Avatar name="Jane Doe" size="sm" />
        <Avatar name="Jane Doe" size="md" />
        <Avatar name="Jane Doe" size="lg" />
        <Avatar name="Jane Doe" size="xl" />
      </>
    ),
  },
  {
    title: "Image vs. initials",
    description: "With an image, or falling back to initials when src is absent.",
    code: `<Avatar src="/u/jane.jpg" name="Jane Doe" size="lg" />
<Avatar name="Sam Lee" size="lg" />`,
    render: () => (
      <>
        <Avatar src={FACE} name="Jane Doe" size="lg" />
        <Avatar name="Sam Lee" size="lg" />
      </>
    ),
  },
  {
    title: "Presence status",
    description: "A status dot indicates online, busy, away, or offline.",
    code: `<Avatar name="Ava Park" status="online" />
<Avatar name="Ben Cole" status="busy" />
<Avatar name="Mia Ito" status="away" />
<Avatar name="Leo Kim" status="offline" />`,
    render: () => (
      <>
        <Avatar name="Ava Park" status="online" />
        <Avatar name="Ben Cole" status="busy" />
        <Avatar name="Mia Ito" status="away" />
        <Avatar name="Leo Kim" status="offline" />
      </>
    ),
  },
  {
    title: "Shape and ring",
    description: "Rounded-square instead of circle, and an optional brand ring.",
    code: `<Avatar name="Twico" size="lg" square />
<Avatar name="Twico" size="lg" ring />
<Avatar src="/u/jane.jpg" name="Jane Doe" size="lg" square ring />`,
    render: () => (
      <>
        <Avatar name="Twico" size="lg" square />
        <Avatar name="Twico" size="lg" ring />
        <Avatar src={FACE} name="Jane Doe" size="lg" square ring />
      </>
    ),
  },
  {
    title: "All props",
    description:
      "Every Avatar-specific prop in one place. The image loads when src is valid and falls back to the initials derived from name; status renders the presence dot, ring adds the brand outline, and square switches the circle to a rounded square.",
    code: `<Avatar
  src="/u/jane.jpg"     // image URL; falls back to initials on error/absent
  name="Jane Doe"       // initials + accessible label
  size="lg"             // xs | sm | md | lg | xl
  status="online"       // online | busy | away | offline
  square                // rounded-square instead of circle
  ring                  // brand ring around the avatar
/>`,
    render: () => (
      <>
        <Avatar
          src={FACE}
          name="Jane Doe"
          size="lg"
          status="online"
          square
          ring
        />
      </>
    ),
  },
];

export default variations;
