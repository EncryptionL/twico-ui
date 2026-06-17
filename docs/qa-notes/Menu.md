# QA notes — Menu

- **Group:** overlay
- **Reviewed:** 2026-06-17
- **Status:** open

## Open issues

- [ ] **[P1] Tab order is broken while the menu is open** — Keyboard nav keeps DOM focus on the trigger and tracks the highlight via `aria-activedescendant` (`Menu.jsx:188-203`), but the menu items render as real, tabbable `<button>`s in a portal at the end of `document.body` (`Menu.jsx:162-178`). The roving model never moves DOM focus into them and there is no focus trap, so pressing Tab while open moves focus to whatever follows the trigger in the source order, leaving an open menu with a now-tabbable button cluster orphaned at the end of the DOM. A subsequent Tab can land on those buttons out of context. _Fix:_ give the menu items `tabIndex={-1}` (the APG menu-button pattern keeps them out of the tab sequence; activation is via the roving handler), or move real focus into the menu and trap Tab like Dialog does. `Menu.jsx:162-178`

- [ ] **[P2] Outside-`mousedown` close races with item activation on touch/synthetic events** — Close-on-outside is bound to document `mousedown` (`Menu.jsx:106-113`) while item selection fires on `click` (`Menu.jsx:172`). For normal mouse this is fine (the guard excludes the menu subtree). It is robust here because the item is inside `menuRef`, but note that any consumer content rendered through the portal that is *not* under `menuRef`/`wrapRef` would dismiss on mousedown before its own click — relevant only if the API grows. No fix required today; flagging the pattern. `Menu.jsx:106-113`

- [ ] **[deferred] Item list uses array index as React key** — `key={i}` / `key={`s${i}`}` / `key={`h${i}`}` (`Menu.jsx:159-165`). For dynamic menus (reordering/inserting items) this can mis-associate state. Stable keys would be safer. Deferred per review scope (index-vs-stable keys in item/nav lists).

## Verified OK

- Portals to `document.body`, so the fixed menu escapes transformed / `backdrop-filter` ancestors; positioned from the trigger's `getBoundingClientRect()` (`Menu.jsx:88-100`, `Menu.jsx:208`).
- Auto-flip: opens upward when space below is insufficient *and* there is more room above; `transform-origin` follows via `data-flip` (`Menu.jsx:94`, `Menu.jsx:17`).
- Horizontal clamp keeps the menu within the viewport with an 8 px margin; `align="end"` anchors to the trigger's right edge (`Menu.jsx:97-98`).
- Reposition on scroll (capture) + resize while open, with listeners cleaned up (`Menu.jsx:111-118`).
- Controlled/uncontrolled is correct: `controlled` derived from `openProp !== undefined`; every transition routes through `setOpen` so `onOpenChange` always fires; refs avoid stale closures and the `value === openRef.current` short-circuit prevents redundant callbacks (`Menu.jsx:70-83`).
- Keyboard nav: ArrowDown/Up wrap over interactive items only (separators/headings skipped via `interactiveIdx`), Home/End jump to ends, Enter/Space activate, Escape closes, and a closed trigger opens on Enter/Space/ArrowDown (`Menu.jsx:130-152`, `Menu.jsx:86`).
- a11y: trigger gets `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` (only while open), and `aria-activedescendant` mirroring the highlighted item id; menu has `role="menu"`, items `role="menuitem"`, separators `role="separator"` (`Menu.jsx:188-203`, `Menu.jsx:155-159`).
- Trigger cloning preserves the consumer's `onClick` and existing `tabIndex`; non-element triggers are wrapped in a focusable `role="button"` span (`Menu.jsx:189-203`).
- Disabled items: `disabled` attribute set, keyboard activation guarded by `!it.disabled`, click-through still closes (a disabled native button won't fire click) (`Menu.jsx:147-151`, `Menu.jsx:167`).
- Exit animation stays mounted 170 ms vs `--duration-exit: 150ms` — in lockstep (`Menu.jsx:122-126`, `Menu.jsx:14`).
- `prefers-reduced-motion` collapses the open/close animation to 1 ms (`Menu.jsx:16`).
- RTL-safe: shortcut uses `margin-inline-start`/`padding-inline-start`, item text `text-align: start` (`Menu.jsx:38`, `Menu.jsx:28`).
- SSR-safe: `useInsertionEffect` and DOM access only in effects; portal resolution guards `typeof window` (`Menu.jsx:84`).
