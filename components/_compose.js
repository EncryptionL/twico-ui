/**
 * Compose a consumer-supplied event handler with a component's internal one.
 *
 * #452: several components attached an internal handler and then spread `{...rest}` AFTER it, so a
 * consumer passing the same-named prop silently REPLACED the internal handler - taking out keyboard
 * navigation, autoplay pause or hover-open entirely, with no warning. The fix is to wire the composed
 * handler LAST (after the spread) so neither side is lost: `rest`'s other entries still override our
 * attributes as before, the consumer's handler runs first, and it can opt out of ours with
 * preventDefault(). Same contract as the Popover trigger composition (#447).
 *
 * Either side may be undefined - whichever exists is returned as-is.
 */
export function compose(theirs, ours) {
  if (typeof theirs !== "function") return ours;
  if (typeof ours !== "function") return theirs;
  return (e) => {
    theirs(e);
    if (!e || !e.defaultPrevented) ours(e);
  };
}
