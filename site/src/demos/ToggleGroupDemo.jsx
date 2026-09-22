import React from "react";
import { ToggleGroup } from "twico-ui";

export default function ToggleGroupDemo() {
  const [align, setAlign] = React.useState("left");
  const [style, setStyle] = React.useState(["bold"]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <ToggleGroup
        aria-label="Text alignment"
        value={align}
        onValueChange={setAlign}
        items={[
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ]}
      />
      <ToggleGroup
        type="multiple"
        aria-label="Text style"
        value={style}
        onValueChange={setStyle}
        items={[
          { value: "bold", label: "Bold" },
          { value: "italic", label: "Italic" },
          { value: "underline", label: "Underline" },
        ]}
      />
    </div>
  );
}
