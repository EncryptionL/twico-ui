# QA notes — Tabs

- **Group:** navigation
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P2] Nav-only tabs leave a dangling `aria-controls`** — Every tab sets `aria-controls={panelId}` unconditionally, but the panel only renders when the active item has `content !== undefined`. For nav-only tabs (the documented "omit content" mode), `aria-controls` references an element id that does not exist in the DOM, which trips accessibility validators and confuses screen readers. _Fix:_ only emit `aria-controls` when the active item actually renders a panel (e.g. `aria-controls={activeItem?.content !== undefined ? panelId : undefined}`). `components/navigation/Tabs.jsx:150,165-166`. — ✓ fixed 2026-06-17
- [ ] **[P2] Sliding indicator can be misaligned until first resize after a late layout change** — The indicator position is measured from `offsetLeft/offsetWidth` in a `useEffect` keyed on `[active, items, orientation]`, with a `window` resize listener as the only re-measure trigger. If a web font (Plus Jakarta Sans) finishes loading after first paint, or the container is revealed after being `display:none`, tab widths change but no resize fires, so the underline/pill can sit under the wrong width until the next resize. _Fix:_ observe the list with `ResizeObserver` (and/or re-measure on `document.fonts.ready`) instead of only `window resize`. `components/navigation/Tabs.jsx:95-107`.

## Verified OK

- **WAI-ARIA tabs pattern:** `role="tablist"` with `aria-orientation`; tabs are `<button role="tab">` with `aria-selected`, roving `tabIndex` (active=0, others=-1); panel is `role="tabpanel"` with `aria-labelledby` to the active tab and `tabIndex={0}`. IDs from `React.useId()`. `components/navigation/Tabs.jsx:141-166`.
- **Keyboard nav:** only the matching arrow axis navigates per orientation (Left/Right horizontal, Up/Down vertical); Home/End jump to ends; selection wraps via modulo and moves DOM focus to the new tab. Orthogonal arrows are left free for the page. `preventDefault` only on handled keys. `components/navigation/Tabs.jsx:118-137`.
- **Controlled/uncontrolled:** `value` (controlled) vs `defaultValue ?? items[0]?.value` (uncontrolled); `onChange` always fires. Panel is keyed by `active` so it remounts on tab change. `components/navigation/Tabs.jsx:86-87,109-112,166`.
- **Vertical orientation:** indicator switches to `top/height` and `inset-inline-end`, list uses `border-inline-end`; the effect re-measures on `orientation` change. `components/navigation/Tabs.jsx:56-63,162`.
- **Tone axis:** 6 tones via the `--_accent` custom-property family (mirrors Button/Badge). `components/navigation/Tabs.jsx:6-11`.
- **Keys:** tabs keyed by `it.value` (stable). `components/navigation/Tabs.jsx:145`.
- **RTL:** indicator positioning via `offsetLeft` + `left` is internally consistent (both physical, same origin); vertical edge uses `inset-inline-end`. `border-inline-end` for vertical lists. Works under `dir="rtl"`.
- **SSR-safe:** style injection in `useInsertionEffect`; measurement effects run only on the client; resize listener cleaned up on unmount. `components/navigation/Tabs.jsx:78-107`.
- **Reduced-motion:** indicator transitions are token-timed and collapsed by the global reduced-motion handling.
