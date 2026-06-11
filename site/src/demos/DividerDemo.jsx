import React from "react";
import { Divider } from "twico-ui";

export default function DividerDemo() {
  return (
    <div style={{ maxWidth: 320 }}>
      <p>Section one</p>
      <Divider />
      <p>Section two</p>
      <Divider>OR</Divider>
      <p>Section three</p>
      <Divider align="left">LEFT</Divider>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span>A</span>
        <Divider orientation="vertical" />
        <span>B</span>
        <Divider orientation="vertical" />
        <span>C</span>
      </div>
    </div>
  );
}
