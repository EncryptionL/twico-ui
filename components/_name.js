import React from "react";

/**
 * Does this control need the component to supply a fallback accessible name?
 *
 * #459: the field controls whose trigger carries `role="combobox"` cannot take their name from their
 * own content (that role prohibits name-from-content), and MultiSelect's input blanks its placeholder
 * the moment a chip exists — so without a `label` they end up with NO accessible name at all.
 *
 * #459 (review): the fallback cannot simply be stamped, because accname resolves `aria-label` (step 2C)
 * BEFORE a host-language `<label>` (step 2D) and these are labelable elements. An unconditional
 * `aria-label` therefore OVERRODE a perfectly good `<label htmlFor>` or wrapping `<label>`, renaming a
 * correctly-labelled control — a WCAG 2.5.3 Label in Name failure, which broke real call sites inside
 * this repo. Props cannot see a host label, so the question is answered from the DOM after mount.
 *
 * #459 (review 2): and it is re-answered on EVERY commit, not once. A one-shot probe captured the
 * answer at first mount and never revisited it, so a label that arrived later (a server-driven schema,
 * a conditional field) left the fallback stamped over it — the very bug the probe exists to prevent.
 *
 * Returns true only when nothing else names the control. Cheap: one ancestor walk, plus a single
 * id-selector lookup when there is an id and no ancestor label. `setState` bails out when the answer
 * is unchanged, so re-probing every commit cannot loop.
 *
 * @param {{current: HTMLElement|null}} ref  the element that will carry the name
 * @param {boolean} hasOwnName  true when the consumer (or the component's own `label`) already names it
 */
export function useFallbackName(ref, hasOwnName) {
  const [needsFallback, setNeedsFallback] = React.useState(false);
  // Layout effect on the client, plain effect on the server — avoids React's SSR useLayoutEffect
  // warning. Same guard as Textarea.jsx and _overlay.js.
  const useIso = typeof document !== "undefined" ? React.useLayoutEffect : React.useEffect;
  useIso(() => {
    if (hasOwnName) { setNeedsFallback(false); return; }
    const el = ref.current;
    if (!el || typeof document === "undefined") return;
    // `.labels` is the exact answer, and asking the DOM beats re-deriving the rules: it covers both
    // `label[for]` and ancestor association, needs no id escaping, and — the reason a hand-rolled
    // `closest("label")` check was wrong — it knows that a wrapping <label> labels only its FIRST
    // labelable descendant. MultiSelect renders its chip remove-buttons before its input, so a
    // consumer's wrapping <label> labels a chip, not the combobox, and the fallback is genuinely
    // needed there. Every element this is used on (<button>, <input>) is labelable, so `.labels`
    // exists; the branch below is for an environment that does not implement it.
    if (el.labels) { setNeedsFallback(el.labels.length === 0); return; }
    const byFor = el.id
      ? Array.prototype.some.call(document.querySelectorAll("label[for]"), (l) => l.getAttribute("for") === el.id)
      : false;
    setNeedsFallback(!byFor && !el.closest("label"));
  });
  return !hasOwnName && needsFallback;
}
