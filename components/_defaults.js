import React from "react";
import { warnOnce } from "./_warn.js";

// #554: the component-defaults channel behind `TwicoProvider defaults={…}`.
//
// Adopting one capability across an app meant a call-site sweep — 24 edits to put `rowResize` on
// every <Datatable> — because there was no way to say "every Datatable in this app has this prop".
// The sweep is the part that rots: the next grid someone adds is the one that silently lacks it, and
// nothing fails. A missing optional boolean is invisible by construction. A wrapper component covers
// the grids a consumer mounts through its own wrapper, but not the ones mounted directly, which is
// where the drift starts.
//
// Precedence is built-in < provider default < prop, so a call site always wins. That is the rule
// `defaultColumn` already establishes one level down inside Datatable (built-in < defaultColumn <
// column), so the two read consistently.
//
// Plain React context, never a module-level registry: two apps rendering in one Node process (SSR)
// would otherwise share one set of defaults and the second request would be served the first's.
export const DefaultsContext = React.createContext(null);

// Which components read the channel.
//
// An allow-list, not "every prop of every component". A defaults blob is written once and read never,
// so a typo in it that silently does nothing is worse than no feature at all — the allow-list is what
// lets the provider say so (see warnUnknownDefaults). Opting a component in is two lines: add its name
// here, and take its props through useComponentDefaults instead of destructuring them in the
// signature. See docs/provider-defaults.md.
export const DEFAULTABLE = ["Datatable", "CardGrid"];

/**
 * Merge this component's provider defaults under `props`. Call it unconditionally at the top of the
 * component, in place of destructuring the signature.
 */
export function useComponentDefaults(name, props) {
  const all = React.useContext(DefaultsContext);
  const d = all && all[name];
  // No provider, or nothing for this component: hand back the very same object, so a grid outside a
  // provider pays nothing at all and its props keep their identity.
  if (!d) return props;
  const merged = { ...d };
  // A prop explicitly passed as `undefined` must NOT veto the default: `rowResize={flag ? true :
  // undefined}` and omitting `rowResize` have to mean the same thing, and React hands both to the
  // component as `undefined`. Copying only defined values is also what makes the signature's own
  // `= false` defaults still apply when neither the provider nor the call site supplies one.
  for (const k in props) if (props[k] !== undefined) merged[k] = props[k];
  return merged;
}

const shallowEq = (a, b) => {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!Object.prototype.hasOwnProperty.call(b, k) || a[k] !== b[k]) return false;
  return true;
};

// Two levels deep, because that is the shape: an outer map of component names, and each component's
// own flat prop bag.
const defaultsEq = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!shallowEq(a[k], b[k])) return false;
  return true;
};

/**
 * Keep the previous `defaults` object while the next one is structurally equal to it.
 *
 * The commonest spelling is an object literal written inline — `defaults={{ Datatable: { rowResize:
 * true } }}`, which is how the API reads best and how it is documented. That is a new object on every
 * provider render, so without this every opted-in component in the tree would see a new context value
 * and re-render whenever anything above the provider did. A ref compared by value is the only way to
 * memoize a dependency that is itself unstable; it is idempotent and observes nothing outside the
 * render, so it is safe to write during one.
 */
export function useStableDefaults(defaults) {
  const ref = React.useRef(null);
  const next = defaults ?? null;
  if (!defaultsEq(ref.current, next)) ref.current = next;
  return ref.current;
}

/**
 * Dev-only: name a defaults key that reaches no component. Almost always a typo, or a component that
 * has not been wired up — and silently doing nothing is the exact failure mode this feature exists to
 * remove, so it must not be this feature's own failure mode.
 */
export function warnUnknownDefaults(defaults) {
  if (!defaults || typeof defaults !== "object") return;
  for (const k of Object.keys(defaults)) {
    if (DEFAULTABLE.includes(k)) continue;
    warnOnce(
      `twc-defaults-unknown-${k}`,
      `[twico-ui] TwicoProvider: defaults.${k} is ignored — "${k}" does not read provider defaults. ` +
        `Components that do: ${DEFAULTABLE.join(", ")}.`,
    );
  }
}
