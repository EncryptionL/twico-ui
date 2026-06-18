import React from "react";
import { Skeleton } from "twico-ui";

const variations = [
  {
    title: "Variants",
    description: "Three shapes: text lines, a circle, and a rectangle.",
    code: `<Skeleton variant="text" width={160} />
<Skeleton variant="circle" width={48} height={48} />
<Skeleton variant="rect" width={120} height={64} />`,
    render: () => (
      <>
        <Skeleton variant="text" width={160} />
        <Skeleton variant="circle" width={48} height={48} />
        <Skeleton variant="rect" width={120} height={64} />
      </>
    ),
  },
  {
    title: "Multi-line text",
    description: "Set lines to fill a paragraph — the last line is shortened.",
    code: `<Skeleton variant="text" lines={4} />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Skeleton variant="text" lines={4} />
      </div>
    ),
  },
  {
    title: "Custom sizing",
    description: "Width and height accept any CSS value, including percentages.",
    code: `<Skeleton variant="text" width="60%" />
<Skeleton variant="text" width="40%" />
<Skeleton variant="rect" width="100%" height={140} />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 340, maxWidth: "100%" }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rect" width="100%" height={140} />
      </div>
    ),
  },
  {
    title: "Card placeholder",
    description: "Compose shapes into a realistic loading layout.",
    code: `<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
  <Skeleton variant="circle" width={40} height={40} />
  <div style={{ flex: 1 }}>
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="40%" />
  </div>
</div>
<Skeleton variant="rect" height={120} />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 340, maxWidth: "100%" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Skeleton variant="circle" width={40} height={40} />
          <div style={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
        <Skeleton variant="rect" height={120} />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every Skeleton-specific prop in one place. lines applies only to the text variant (the last line is shortened); width sizes each line and height the group wrapper. For circle/rect, width and height size the shape directly.",
    code: `<Skeleton
  variant="text"   // text | circle | rect
  width="80%"      // any CSS width (string or number)
  height={96}      // any CSS height (string or number)
  lines={3}        // text variant only: number of lines
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Skeleton variant="text" width="80%" height={96} lines={3} />
      </div>
    ),
  },
];

export default variations;
