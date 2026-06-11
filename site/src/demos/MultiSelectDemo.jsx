import React, { useState } from "react";
import { MultiSelect } from "twico-ui";

export default function MultiSelectDemo() {
  const [tags, setTags] = useState(["react", "tailwind"]);
  const options = [
    { group: "Frameworks", options: [
      { value: "react", label: "React", description: "UI library" },
      { value: "vue", label: "Vue", description: "Progressive framework" },
      { value: "svelte", label: "Svelte", description: "Compiler-based" },
    ]},
    { group: "Tooling", options: ["tailwind", "typescript", "vite"] },
  ];
  return (
    <div style={{ maxWidth: 420 }}>
      <MultiSelect
        label="Tech stack"
        placeholder="Add technologies"
        hint="Type to filter, Backspace removes the last chip"
        value={tags}
        onChange={setTags}
        options={options}
      />
    </div>
  );
}
