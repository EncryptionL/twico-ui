// Compile-only fixture for #77 — RadioGroup value/onChange + options typing.
import * as React from "react";
import { RadioGroup } from "../../components/inputs/RadioGroup";
import type { RadioGroupOption } from "../../components/inputs/RadioGroup";

export function radioGroupFixture() {
  const opts: RadioGroupOption[] = [
    { value: "a", label: "A" },
    { value: "b", description: "B option", disabled: true },
  ];
  return (
    <>
      <RadioGroup label="X" options={opts} value="a" onChange={(v: string) => void v} orientation="horizontal" required />
      {/* @ts-expect-error — onChange receives the selected string value, not an event */}
      <RadioGroup options={opts} onChange={(e: React.ChangeEvent) => void e} />
    </>
  );
}
