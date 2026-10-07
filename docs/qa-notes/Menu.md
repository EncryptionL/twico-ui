# QA notes — Menu

- **Group:** overlay
- **Reviewed:** 2026-10-06
- **Status:** open

## Open issues

- [x] **[#447] a cloned non-button `trigger` received widget ARIA it cannot legally carry** - like Popover, Menu
  clones the trigger to inject `tabIndex`/`aria-expanded`/`aria-haspopup`/`aria-controls`, and on a `div`/`Box`
  those land on `role="generic"` where `aria-expanded` is prohibited. A cloned non-control trigger now also gets
  `role="button"` via the shared `triggerIsControl` (`components/_overlay.js`); an explicit consumer `role` is
  preserved, so AvatarMenu is untouched. Unlike Popover, **no keyboard handler was needed**: the report's claim
  that a non-button Menu trigger cannot be opened from the keyboard is wrong - `span.twc-menu-wrap` carries
  `onKeyDown`, Enter/Space/ArrowDown bubble up to it, and `tests/Menu.test.jsx` has been proving exactly that via
  AvatarMenu (whose trigger is a `span role="button"`) all along. See [Popover](Popover.md) for the full
  rationale. `Menu.jsx`, `_overlay.js`; `tests/overlay-trigger-semantics.test.jsx` (11). - fixed 2026-10-06

- [x] **[P2] `aria-activedescendant` is injected on the documented happy path** - tracked as #459 and fixed there (see below). Found while fixing #447 and NOT
  part of it. Menu injects `aria-activedescendant` into the cloned trigger whenever an item is highlighted. That
  attribute is not global and is **not** allowed on `role="button"`, so `trigger={<Button>}` - the documented,
  recommended usage - is an `aria-allowed-attr` violation as soon as the user arrows into the menu; adding
  `role="button"` to a div does not make it legal either. This is a pre-existing deviation from the WAI-ARIA APG
  menu-button pattern, which moves DOM focus into the items rather than roving via `aria-activedescendant` on the
  button, so it wanted its own issue and a considered fix rather than being folded into #447. - fixed 2026-10-07

- [x] **[#420/#410] Menu opened from a disabled trigger, and swallowed a parent-claimed key** — guard opening when the trigger is disabled/aria-disabled; bail onKeyDown on defaultPrevented; forward aria-describedby to the focusable trigger. `Menu.jsx` — ✓ 2026-09-23

- [x] **[#389] a backdrop click over a Menu-in-Dialog closed both** — Menus outside-pointer dismissal now gates on the dismissable-layer stack (`isTop()`), so only the topmost layer closes. `Menu.jsx` — ✓ fixed 2026-09-22

- [x] **[P1] Tab order is broken while the menu is open** — Keyboard nav keeps DOM focus on the trigger and tracks the highlight via `aria-activedescendant` (`Menu.jsx:188-203`), but the menu items render as real, tabbable `<button>`s in a portal at the end of `document.body` (`Menu.jsx:162-178`). The roving model never moves DOM focus into them and there is no focus trap, so pressing Tab while open moves focus to whatever follows the trigger in the source order, leaving an open menu with a now-tabbable button cluster orphaned at the end of the DOM. A subsequent Tab can land on those buttons out of context. _Fix:_ give the menu items `tabIndex={-1}` (the APG menu-button pattern keeps them out of the tab sequence; activation is via the roving handler), or move real focus into the menu and trap Tab like Dialog does. `Menu.jsx:162-178` — ✓ fixed 2026-06-17

- [ ] **[P2] Outside-`mousedown` close races with item activation on touch/synthetic events** — Close-on-outside is bound to document `mousedown` (`Menu.jsx:106-113`) while item selection fires on `click` (`Menu.jsx:172`). For normal mouse this is fine (the guard excludes the menu subtree). It is robust here because the item is inside `menuRef`, but note that any consumer content rendered through the portal that is *not* under `menuRef`/`wrapRef` would dismiss on mousedown before its own click — relevant only if the API grows. No fix required today; flagging the pattern. `Menu.jsx:106-113`

- [ ] **[deferred] Item list uses array index as React key** — `key={i}` / `key={`s${i}`}` / `key={`h${i}`}` (`Menu.jsx:159-165`). For dynamic menus (reordering/inserting items) this can mis-associate state. Stable keys would be safer. Deferred per review scope (index-vs-stable keys in item/nav lists).

- [x] **[#457] Space could never activate the highlighted item** - the type-ahead branch tested `e.key.length === 1` and preceded the activation branch in the same `else if` chain, so a space was swallowed into the type-ahead buffer and `(Enter || " ") && active >= 0` was unreachable. Space is now excluded from type-ahead; the APG lists it alongside Enter for a `menuitem`. `Menu.jsx:181` - fixed 2026-10-07
- [x] **[#459] `aria-activedescendant` was injected onto a `role="button"` trigger** - the attribute is not permitted on that role, so AT discarded it and a keyboard user arrowing through the menu was told nothing at all. Replaced with the APG focus model: real DOM focus moves to the highlighted item (for keyboard-driven changes only, so hovering never steals focus) and returns to the trigger on close. Items stay at `tabIndex={-1}`. `Menu.jsx:146-165,269` - fixed 2026-10-07
- [x] **[#452] a consumer `onKeyDown` disabled all keyboard navigation** - `{...rest}` was spread AFTER the wrapper's own `onKeyDown`, so `<Menu onKeyDown={...}>` silently replaced it. Composed via `components/_compose.js`. `Menu.jsx:291` - fixed 2026-10-07

- [x] **[#459 review] Tab out of an open menu could be hijacked by an ancestor focus trap** - with focus parked on a portaled item, `useFocusTrap` sees `activeElement` outside its region and yanks focus to the trap's FIRST focusable, so tabbing out of a Menu inside a Dialog/Drawer jumped to the top of the dialog instead of continuing past the trigger. The Tab branch now restores focus to the trigger first, before the event reaches the trap's document-level listener. Not assertable in jsdom (the trap filters candidates by `offsetParent`, which jsdom always reports as `null`, so it focuses the dialog node whatever we do) - verified instead against the trap's logic, and the control case proves the jsdom outcome is identical with focus on the trigger. `Menu.jsx:163` - fixed 2026-10-07
- [x] **[#459 review] the new focus model depends on React portal propagation, which the first round of tests never exercised** - they fired keydown on the wrapper, whereas a browser dispatches at `document.activeElement`, which after the first arrow key is an element inside the portal. Confirmed working (React propagates through the React tree and attaches to the portal container) and now covered by tests that dispatch on the focused item. `tests/menu-keyboard-activation.test.jsx` - fixed 2026-10-07

- [x] **[#459 review 2] `kbdRef` was never cleared on close** - it is set unconditionally at the top of `onKeyDown`, and Escape/Tab/Enter all close the menu before the focus effect reaches its own clear, so it was left true with `active` still pointing at the old index. A controlled reopen from elsewhere (`<Menu open={o}>` driven by a second button) then satisfied the focus effect immediately and yanked focus onto that stale item instead of leaving it on the trigger. Cleared in the close path. `Menu.jsx:179` - fixed 2026-10-07

## Verified OK

- Portals to `document.body`, so the fixed menu escapes transformed / `backdrop-filter` ancestors; positioned from the trigger's `getBoundingClientRect()` (`Menu.jsx:88-100`, `Menu.jsx:208`).
- Auto-flip: opens upward when space below is insufficient *and* there is more room above; `transform-origin` follows via `data-flip` (`Menu.jsx:94`, `Menu.jsx:17`).
- Horizontal clamp keeps the menu within the viewport with an 8 px margin; `align="end"` anchors to the trigger's right edge (`Menu.jsx:97-98`).
- Reposition on scroll (capture) + resize while open, with listeners cleaned up (`Menu.jsx:111-118`).
- Controlled/uncontrolled is correct: `controlled` derived from `openProp !== undefined`; every transition routes through `setOpen` so `onOpenChange` always fires; refs avoid stale closures and the `value === openRef.current` short-circuit prevents redundant callbacks (`Menu.jsx:70-83`).
- Keyboard nav: ArrowDown/Up wrap over interactive items only (separators/headings skipped via `interactiveIdx`), Home/End jump to ends, Enter/Space activate (Space only since #457 - the type-ahead branch used to swallow it), Escape closes, and a closed trigger opens on Enter/Space/ArrowDown (`Menu.jsx:130-152`, `Menu.jsx:86`).
- a11y: trigger gets `aria-haspopup="menu"`, `aria-expanded` and `aria-controls` (only while open). It no longer carries `aria-activedescendant` - that was #459: the attribute is illegal on `role="button"`, and the highlight is now announced by real DOM focus on the item. menu has `role="menu"`, items `role="menuitem"`, separators `role="separator"` (`Menu.jsx:188-203`, `Menu.jsx:155-159`).
- Trigger cloning preserves the consumer's `onClick` and existing `tabIndex`; non-element triggers are wrapped in a focusable `role="button"` span (`Menu.jsx:189-203`).
- Disabled items: `disabled` attribute set, keyboard activation guarded by `!it.disabled`, click-through still closes (a disabled native button won't fire click) (`Menu.jsx:147-151`, `Menu.jsx:167`).
- Exit animation stays mounted 170 ms vs `--duration-exit: 150ms` — in lockstep (`Menu.jsx:122-126`, `Menu.jsx:14`).
- `prefers-reduced-motion` collapses the open/close animation to 1 ms (`Menu.jsx:16`).
- RTL-safe: shortcut uses `margin-inline-start`/`padding-inline-start`, item text `text-align: start` (`Menu.jsx:38`, `Menu.jsx:28`).
- SSR-safe: `useInsertionEffect` and DOM access only in effects; portal resolution guards `typeof window` (`Menu.jsx:84`).
