import React from "react";
import { ToggleGroup } from "twico-ui";

function Single() {
  const [v, setV] = React.useState("center");
  return <ToggleGroup aria-label="Align" value={v} onValueChange={setV}
    items={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }]} />;
}
function Multiple() {
  const [v, setV] = React.useState(["bold"]);
  return <ToggleGroup type="multiple" aria-label="Style" value={v} onValueChange={setV}
    items={[{ value: "bold", label: "Bold" }, { value: "italic", label: "Italic" }, { value: "underline", label: "Underline" }]} />;
}

const variations = [
  {
    title: "Single (exclusive)",
    description: "type=\"single\" holds one value (string | null). Clicking the active toggle deselects it.",
    code: `const [v, setV] = React.useState("center");
<ToggleGroup aria-label="Align" value={v} onValueChange={setV}
  items={[
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
  ]} />`,
    render: () => <Single />,
  },
  {
    title: "Multiple",
    description: "type=\"multiple\" holds a string[]; each toggle adds/removes independently.",
    code: `const [v, setV] = React.useState(["bold"]);
<ToggleGroup type="multiple" aria-label="Style" value={v} onValueChange={setV}
  items={[
    { value: "bold", label: "Bold" },
    { value: "italic", label: "Italic" },
    { value: "underline", label: "Underline" },
  ]} />`,
    render: () => <Multiple />,
  },
  {
    title: "Tone, size & OFF variant",
    description: "tone sets the pressed (\"on\") fill; variant is the OFF look; size mirrors Button.",
    code: `<ToggleGroup aria-label="Mode" tone="danger" variant="soft" size="sm" defaultValue="deny"
  items={[
    { value: "allow", label: "Allow" },
    { value: "deny", label: "Deny" },
    { value: "clear", label: "Clear" },
  ]} />`,
    render: () => (
      <ToggleGroup aria-label="Mode" tone="danger" variant="soft" size="sm" defaultValue="deny"
        items={[{ value: "allow", label: "Allow" }, { value: "deny", label: "Deny" }, { value: "clear", label: "Clear" }]} />
    ),
  },
  {
    title: "Roving arrow-key focus",
    description: "roving makes the group a single Tab stop; arrow keys move focus (Space/Enter/click toggle).",
    code: `<ToggleGroup aria-label="View" roving defaultValue="grid"
  items={[
    { value: "list", label: "List" },
    { value: "grid", label: "Grid" },
    { value: "board", label: "Board" },
  ]} />`,
    render: () => (
      <ToggleGroup aria-label="View" roving defaultValue="grid"
        items={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }, { value: "board", label: "Board" }]} />
    ),
  },
];

export default variations;
