# QA notes — CommandPalette

- **Group:** overlay
- **Reviewed:** 2026-10-06
- **Status:** clean

## Open issues

- [x] **[#449] the `kbd` cap was the one residual contrast failure after the token fix** - `.twc-cmdk__kbd` was
  `var(--color-text-subtle)` on `var(--color-surface-sunken)`. The #449 token change lifted it from 2.34:1 to
  **4.34:1** - still just under 4.5:1, because the sunken background moves with the text. Changed that one
  declaration to `var(--color-text-muted)` (**6.92:1** light / **12.59:1** dark), which also aligns it with
  `components/typography/Kbd.jsx`, where the identical cap on the identical background already used
  `--color-text-muted`. `CommandPalette.jsx`; `tests/tokens-a11y.test.js`. - fixed 2026-10-06

- [x] **[P2] Tab moves DOM focus into the option buttons and breaks arrow-nav** — The combobox pattern keeps DOM focus on the input and tracks the highlight with `aria-activedescendant` (`CommandPalette.jsx:159`), while ArrowUp/Down/Enter are handled only on the input's `onKeyDown` (`CommandPalette.jsx:135-139`). The option rows are real, tabbable `<button>`s (`CommandPalette.jsx:171`). Because the focus trap (`CommandPalette.jsx:90-113`) includes those buttons in its focusable set, pressing Tab moves real focus off the input onto an option; arrow navigation then silently stops working until the user Tabs back to the input. _Fix:_ give the option buttons `tabIndex={-1}` so they stay out of the tab sequence (activation is mouse/`aria-activedescendant`-driven), keeping the input the sole tab stop. `CommandPalette.jsx:171` — ✓ fixed 2026-06-17

- [x] **[P2] Enter with no matching results closes the palette** — `run(flat[active])` is called on Enter (`CommandPalette.jsx:138`); when the filtered list is empty, `flat[active]` is `undefined`, and `run` still calls `onClose?.()` unconditionally after the optional-chained no-op (`CommandPalette.jsx:132`). So hitting Enter on a "No results" state dismisses the palette rather than doing nothing. Minor but surprising. _Fix:_ early-return from `run` (and skip `onClose`) when the command is `undefined`. `CommandPalette.jsx:132`, `CommandPalette.jsx:138` — ✓ fixed 2026-06-17

- [x] **[P2] Body scroll not locked while open** — The overlay is a fixed full-viewport scrim, but `<body>` is not scroll-locked, so the page behind the palette can still scroll (wheel after the pointer leaves the panel; iOS body scroll). _Fix:_ set `body { overflow: hidden }` on open / restore on unmount (SSR-guarded), or document as consumer responsibility. `CommandPalette.jsx:64-70` — ✓ fixed 2026-06-17

- [x] **[#468] the listbox groups had no accessible name, and the heading was an unallowed listbox child** - each category rendered as `<div role="group">` with no label, so arrowing across a boundary announced a bare 'grouping' and the user never heard which category they had entered; the visible heading was the only cue and it is sighted-only. ARIA also wants a listbox to own `option`/`group` only, and the heading div was neither. The group is now `aria-labelledby` its heading, the heading is `role="presentation"`, and the listbox itself carries `aria-label`. The APG listbox pattern requires every group to carry a label. This file previously recorded the group wiring as 'correct'. `CommandPalette.jsx:148` - fixed 2026-10-07

## Verified OK

- Portals to `document.body`, so the fixed scrim escapes a transformed / `backdrop-filter` ancestor (e.g. a sticky navbar) (`CommandPalette.jsx:190-193`).
- Exit animation: stays mounted 170 ms vs `--duration-exit: 150ms` — in lockstep (`CommandPalette.jsx:64-70`, `CommandPalette.jsx:13`).
- Input is auto-focused on open (30 ms timer, cleaned up); query + active index reset on open (`CommandPalette.jsx:72-74`).
- Focus restore keyed on `open` only, immune to an unstable `onClose`; restores to the previously focused element (`CommandPalette.jsx:79-85`).
- Focus trap reads `paletteRef` lazily inside the handler, so it works even though the panel mounts one render after `open` flips; handles Shift+Tab/first, Tab/last, and the empty-focusables case (`CommandPalette.jsx:87-113`).
- Escape closes via the document-level listener, so it works regardless of where focus sits (`CommandPalette.jsx:100-101`).
- ARIA combobox/listbox wiring is correct: input `role="combobox"` + `aria-controls` + `aria-activedescendant`; list `role="listbox"`; groups `role="group"`; rows `role="option"` with `aria-selected` (`CommandPalette.jsx:155-184`).
- Items use `onMouseDown` `preventDefault()` so clicking a row does not blur the input (keeping the trap/active state intact), with selection on `onClick` (`CommandPalette.jsx:173`).
- Search filters on label + keywords + group, case-insensitively; grouping preserves command order and builds a correct flat index for keyboard nav (`CommandPalette.jsx:115-128`).
- `onSelect` is preferred, falling back to `onClick`, matching the documented alias (`CommandPalette.jsx:132`).
- Active option scrolls into view on change (`block: "nearest"`) (`CommandPalette.jsx:141-144`).
- Arrow nav clamps to `[0, flat.length-1]`; active resets to 0 on query change so a shrinking list can't leave a stale out-of-range index (`CommandPalette.jsx:130`, `CommandPalette.jsx:136-137`).
- Backdrop dismissal: `onMouseDown` + `e.target === e.currentTarget` guard (`CommandPalette.jsx:154`).
- `prefers-reduced-motion` collapses overlay + panel animations to 1 ms (`CommandPalette.jsx:16-18`).
- SSR-safe: `typeof document === "undefined"` → `null`; portal output client-only (`CommandPalette.jsx:146`).
- Row keys prefer `c.id`, falling back to index (`CommandPalette.jsx:171`).
