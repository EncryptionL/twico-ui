import React from "react";
import { ColorPicker } from "twico-ui";

const variations = [
  {
    title: "Basic",
    description: "A labeled color picker with an uncontrolled hex value.",
    code: `<ColorPicker label="Brand color" defaultValue="#6366F1" />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <ColorPicker label="Brand color" defaultValue="#6366F1" />
      </div>
    ),
  },
  {
    title: "With presets",
    description: "Preset swatches give quick access to a curated palette.",
    code: `<ColorPicker
  label="Accent"
  defaultValue="#14B8A6"
  presets={["#6366F1", "#14B8A6", "#F43F5E", "#F59E0B", "#0EA5E9"]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <ColorPicker
          label="Accent"
          defaultValue="#14B8A6"
          presets={["#6366F1", "#14B8A6", "#F43F5E", "#F59E0B", "#0EA5E9"]}
        />
      </div>
    ),
  },
  {
    title: "Without label",
    description: "Omit the label for a compact, standalone swatch trigger.",
    code: `<ColorPicker defaultValue="#F43F5E" />`,
    render: () => (
      <ColorPicker defaultValue="#F43F5E" />
    ),
  },
  {
    title: "Controlled",
    description: "Drive the value from state and react to every change.",
    code: `const [color, setColor] = React.useState("#0EA5E9");

<ColorPicker
  label="Theme color"
  value={color}
  onChange={setColor}
  presets={["#0EA5E9", "#8B5CF6", "#10B981"]}
/>`,
    render: () => <ControlledExample />,
  },
];

function ControlledExample() {
  const [color, setColor] = React.useState("#0EA5E9");
  return (
    <div style={{ width: 340, maxWidth: "100%" }}>
      <ColorPicker
        label="Theme color"
        value={color}
        onChange={setColor}
        presets={["#0EA5E9", "#8B5CF6", "#10B981"]}
      />
    </div>
  );
}

export default variations;
