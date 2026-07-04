// Compile-only fixture for #86 — Slider single + range value/onChange typing.
import * as React from "react";
import { Slider } from "../../components/inputs/Slider";

export function sliderFixture() {
  return (
    <>
      <Slider value={40} onChange={(v: number | [number, number]) => void v} pageStep={5} precision={2} name="a" />
      <Slider value={[20, 60]} range onChange={(v) => void v} getAriaValueText={(n: number) => String(n)} />
      {/* @ts-expect-error — value must be a number or a [number, number] tuple, not a string */}
      <Slider value="oops" onChange={() => {}} />
    </>
  );
}
