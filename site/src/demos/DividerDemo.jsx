import React from "react";
import { Divider, Text } from "twico-ui";

export default function DividerDemo() {
  return (
    <div style={{ width: 380, maxWidth: "100%" }}>
      <Text>Section one</Text>
      <Divider />
      <Text>Section two</Text>
      <Divider>OR</Divider>
      <Text>Section three</Text>
      <Divider align="left">LEFT</Divider>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Text as="span">A</Text>
        <Divider orientation="vertical" />
        <Text as="span">B</Text>
        <Divider orientation="vertical" />
        <Text as="span">C</Text>
      </div>
    </div>
  );
}
