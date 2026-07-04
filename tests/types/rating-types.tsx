// Compile-only fixture for #83/#87 — Rating clearable + format props.
import * as React from "react";
import { Rating } from "../../components/inputs/Rating";

export function ratingFixture() {
  return (
    <>
      <Rating value={3.5} readOnly clearable format={(v: number) => `${v}/5`} />
      <Rating defaultValue={2} clearable={false} onChange={(v: number) => void v} />
    </>
  );
}
