import React from "react";
import { Accordion } from "twico-ui";

export default function AccordionDemo() {
  const items = [
    { value: "a", label: "Is Twico UI free?", content: "Yes — MIT licensed, forever." },
    { value: "b", label: "Does it support dark mode?", content: "Out of the box." },
    { value: "c", label: "Can I open multiple panels?", content: "Set the multiple prop to true." },
  ];
  return (
    <div style={{ maxWidth: 480 }}>
      <Accordion multiple defaultOpen={["a"]} items={items} />
    </div>
  );
}
