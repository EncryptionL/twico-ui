import React from "react";
import { Skeleton } from "twico-ui";

export default function SkeletonDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320, maxWidth: "100%" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Skeleton variant="circle" width={40} height={40} />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rect" height={120} />
      <Skeleton variant="text" lines={3} />
    </div>
  );
}
