// Compile-only regression fixture for #173. Typechecked by `npm run typecheck`
// (tests/types is in tsconfig `include`), never executed. Under React 19's
// @types/react, `useRef<T>(null)` is typed `RefObject<T | null>`; the ref hooks
// must accept it WITHOUT a cast. This file failing to compile means a hook ref
// param was narrowed back to `RefObject<T>`.
import { useRef } from "react";
import {
  useHover,
  useClickOutside,
  useIntersectionObserver,
  useEventListener,
} from "../../hooks/index.js";

export function hookRefFixture() {
  const ref = useRef<HTMLDivElement>(null);
  useHover(ref);
  useClickOutside(ref, () => {});
  useIntersectionObserver(ref);
  useEventListener("resize", () => {}, ref);
}
