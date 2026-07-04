// Compile-only fixture for #177 — the extracted overlay hooks. Typechecked by
// `npm run typecheck` (tests/types is in tsconfig `include`), never executed.
// useFocusTrap must accept a `useRef<T>(null)` ref (RefObject<T | null>) without a
// cast, take an optional active flag + options, and return void; usePortal must
// return a render callback accepting a ReactNode.
import { useRef } from "react";
import type { ReactNode, ReactPortal } from "react";
import { useFocusTrap, usePortal } from "../../hooks/index.js";

export function overlayHookFixture() {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref);
  useFocusTrap(ref, true);
  useFocusTrap(ref, false, { restoreFocus: false });

  // @ts-expect-error — active must be a boolean, not a string.
  useFocusTrap(ref, "yes");

  const render = usePortal();
  const out: ReactPortal | ReactNode | null = render(null);
  return out;
}
