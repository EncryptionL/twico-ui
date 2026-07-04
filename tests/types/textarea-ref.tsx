// Compile-only fixture for #68 — Textarea forwards a ref to the inner <textarea>
// and accepts autosize/minRows/maxRows/showCount. Typechecked by `npm run typecheck`.
import * as React from "react";
import { Textarea } from "../../components/inputs/Textarea";

export function textareaRefFixture() {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  return (
    <>
      <Textarea ref={ref} autosize minRows={2} maxRows={8} showCount maxLength={100} />
      {/* @ts-expect-error — ref must be a textarea, not a div */}
      <Textarea ref={React.useRef<HTMLDivElement>(null)} />
    </>
  );
}
