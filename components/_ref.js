import * as React from "react";

/**
 * Merge a forwarded `ref` with the component's own internal ref(s) onto one element.
 *
 * #490: several components keep an internal ref on the very element they spread `{...rest}` onto -
 * Select's trigger, Combobox's and MultiSelect's input, Checkbox's input, Code's root. Converting
 * those to `forwardRef` means two refs want the same node, and `ref={a} ref={b}` is not a thing. The
 * merge was written by hand once for Input in #488; this is that logic, once, so the next component
 * does not reinvent it with a different set of bugs.
 *
 * Two details that are easy to get wrong, and are why this is not a two-liner:
 *
 * 1. **Cleanup-returning callbacks.** React 19 lets a ref callback return a cleanup function, and
 *    `RefAttributes` types that return value - so a component declaring a ref is promising it. React
 *    picks the protocol from what OUR callback returns: return nothing and it falls back to calling
 *    us again with `null`, which would drop the caller's cleanup on the floor. So any cleanups are
 *    collected and returned as one. React 18 simply ignores the returned function and keeps using
 *    the null call, which is its own correct behaviour since it has no cleanup protocol.
 *
 * 2. **Nulling the object refs.** Once a cleanup exists React will NOT call us with `null`, so the
 *    internal `useRef` handles have to be released from inside it - otherwise a component holds a
 *    detached node after unmount.
 *
 * `refs` is used directly as the dependency array, so the identity of the returned callback is
 * stable as long as the refs are. Pass a FIXED number of refs: a varying length would break the
 * deps comparison, and a caller that re-creates its ref callback every render will (correctly) cause
 * a detach/attach on every commit - that is React's behaviour, not something this papers over.
 */
export function useMergedRef(...refs) {
  return React.useCallback((node) => {
    const cleanups = [];
    for (const r of refs) {
      if (typeof r === "function") {
        const cleanup = r(node);
        if (typeof cleanup === "function") cleanups.push(cleanup);
      } else if (r && typeof r === "object") {
        r.current = node;
      }
    }
    if (cleanups.length === 0) return undefined;
    return () => {
      for (const r of refs) if (r && typeof r === "object") r.current = null;
      for (const cleanup of cleanups) cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the refs ARE the deps
  }, refs);
}
