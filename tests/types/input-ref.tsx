// Compile-only fixture for #488 — Input forwards a ref to the inner <input>, the way the sibling
// Textarea already did (#68, tests/types/textarea-ref.tsx). Typechecked by `npm run typecheck`.
//
// This is the test that matches the reported symptom. Input honoured a caller's ref at runtime but
// was declared as a plain function, so `<Input ref={…} />` failed with
//   error TS2322: Property 'ref' does not exist on type 'IntrinsicAttributes & InputProps'.
// The runtime tests in tests/input-ref-forwarding.test.jsx cannot catch that — only tsc can.
import * as React from "react";
import { Input } from "../../components/inputs/Input";

export function inputRefFixture() {
  const ref = React.useRef<HTMLInputElement>(null);
  const cb = (node: HTMLInputElement | null) => void node?.setSelectionRange(0, 0);

  // the caret APIs the issue was blocked on, reached through the ref
  const insertAtCursor = (token: string) => {
    const el = ref.current;
    if (!el) return "";
    const at = el.selectionStart ?? el.value.length;
    return el.value.slice(0, at) + token + el.value.slice(at);
  };
  void insertAtCursor;

  return (
    <>
      <Input ref={ref} label="Template" clearable />
      <Input ref={cb} label="Callback ref" />
      <Input label="No ref at all" />
      {/* @ts-expect-error — ref must be an input, not a div */}
      <Input ref={React.useRef<HTMLDivElement>(null)} />
      {/* @ts-expect-error — ref must be an input, not the sibling textarea element */}
      <Input ref={React.useRef<HTMLTextAreaElement>(null)} />
    </>
  );
}

// The public barrel must export the ref-bearing type too, not just the component value:
// a consumer writes `import { Input } from "twico-ui"`, never the deep path above.
import { Input as BarrelInput } from "../../src";

export function inputRefFromBarrel() {
  const ref = React.useRef<HTMLInputElement>(null);
  return <BarrelInput ref={ref} label="From the barrel" />;
}
