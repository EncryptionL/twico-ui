# QA notes — Select

- **Group:** inputs
- **Status:** open
- **Reviewed:** 2026-09-22

## Open issues

- [x] **[#389] Escape closing an open Select inside a Dialog also closed the Dialog** — Select now preventDefaults Escape when the listbox is open, so an enclosing Dialog/Drawer stands down. `Select.jsx` — ✓ fixed 2026-09-22

- [x] **[P1] Portal z-index string vs numeric mismatch** — Portal popover uses CSS var `z-index: "var(--z-tooltip)"` (line 263) but this should be just the CSS variable without quotes in the style object. Fix: change to `zIndex: "var(--z-tooltip)"` in camelCase JS prop. `Select.jsx:263`. — ✓ fixed 2026-06-17

- [ ] **[P2] Popover viewport flip animation mismatch** — When menu flips to top, transform-origin is set to bottom (CSS line 53) but animation timing remains the same (line 52). During the flip-and-open transition, the visual effect might feel jerky. Consider adding a CSS animation-delay or transform-origin class based on data-placement. `Select.jsx:52-53`.

## Enhancements

- **[#326] Richer options — `renderOption` + option `icon`/`hint`** — options may add `icon` (leading, in
  `.twc-opt__icon`) and `hint` (trailing muted, in `.twc-opt__hint`); `renderOption(option, { selected, active })
  => node` replaces the row body while twico keeps the `.twc-opt` chrome (keyboard nav, ARIA, the selected
  checkmark). `renderOption` wins over `icon`/`hint` and **disables `virtualized`** (variable-height rows;
  `warnOnce` key `select-renderoption-virtualized`). Mirrors Combobox/MultiSelect. Shared tests in
  `tests/select-family-render-option.test.jsx`. — added 2026-08-04

- **Portaled menu tracks trigger resize** — the positioning effect re-placed only on window `scroll`/`resize`,
  measuring the trigger once. When the **trigger itself** resized while the menu was open (a resized Datatable
  filter field from #292, or a table column during a cell edit) no window event fired, so a portaled,
  trigger-width-matched menu kept its stale width/position. Fixed by adding a `ResizeObserver` on the trigger
  in the positioning effect (guarded `typeof ResizeObserver`, disconnected on cleanup). The same one-line fix
  was applied to **every** portaled dropdown that anchors to its trigger — `Select`, `MultiSelect`, `Combobox`,
  and the `DatePicker` / `DateRangePicker` / `TimePicker` / `ColorPicker` popovers. Guarded (source + a DOM
  re-track test with a mocked ResizeObserver) in `tests/dropdown-trigger-resize.test.jsx`. — fixed 2026-07-29
- **[#269] Full option label on hover** — each option button carries a native `title` equal to its label
  (plain-string labels only), so a name clipped by the option's `text-overflow: ellipsis` stays
  discoverable. Native `title` rather than a twico `Tooltip` because options live in a portaled,
  virtualized listbox where a Tooltip per option is impractical. Surfaced via the Datatable filter
  builder's column dropdown. — added 2026-07-23
- **[#92] Opt-in option-list virtualization** — `virtualized` (+ `overscan`, default 8) windows
  `.twc-pop__list`, rendering only the option rows intersecting the viewport (plus spacer divs) so a
  250/500/1000-item list opens without mounting every button. aria-activedescendant / keyboard indexing
  still spans the full list, and keyboard nav scrolls an unrendered active option into view by its
  computed offset. Off by default (small/grouped lists render byte-identically). — added 2026-07-04

- [x] **[#459] `aria-activedescendant` on a `<button>` trigger made arrow-key highlighting silent** - with 5 or fewer options no search field is rendered and the option rows are never focused, so the attribute was the ONLY announcement channel, and `role="button"` cannot own it. The trigger is now the APG select-only combobox (`role="combobox"`), and it claims `aria-activedescendant` only when it actually holds focus (i.e. when no search field is rendered). `Select.jsx:436` - fixed 2026-10-07
- [x] **[#459] the search input and a live region were rendered inside the `role="listbox"` element** - the role sat on the popover wrapper, so it owned a nested `role="combobox"` and a `role="status"` region (neither is permitted list content) and the input's `aria-controls` resolved to its own ancestor. Moved onto `.twc-pop__list`, as MultiSelect already did. `Select.jsx:376,410,417` - fixed 2026-10-07

- [x] **[#459 review] `role="combobox"` removed the trigger's accessible name when no `label` was given** - that role prohibits name-from-content, and as a plain `<button>` the trigger had been named by its own value text. It now falls back to naming itself after the `placeholder` (a better name than the current value, and the APG select-only combobox is named by its label while its CONTENTS are announced as the value); a consumer's `aria-label`/`aria-labelledby` still wins. The role change is also observable: the trigger is no longer exposed as a `button`, so four test files and the prompt doc were updated. `Select.jsx:436` - fixed 2026-10-07

- [x] **[#463] `active` was never clamped to `visible.length`, and `nextEnabled` could not walk back from an out-of-range index** - `active` is reset only by the `[query]` and `[open]` effects, so an `options` prop that shrinks while the list is open (the documented server-ranked pattern does this on every refetch) left it past the end. `nextEnabled` started at `from + dir`, so the `while` guard was false immediately and it returned `from` unchanged in BOTH directions: arrows dead, `visible[active]` undefined so Enter did nothing, and `aria-activedescendant` dropped to undefined - keyboard navigation stayed dead until the user typed or reopened. `nextEnabled` now re-enters from the nearest end, and a `[visible.length]` effect clamps so Enter and the announcement recover without needing a keypress. Same fix in MultiSelect and Combobox. `Select.jsx:176` - fixed 2026-10-07
- [x] **[#463] the on-open 'highlight the selected option' was clobbered by the `[query]` reset** - the `[open]` effect called `setActive(idx)` and then `setQuery("")` in the same body. The query is never cleared on close, so after a search it was still non-empty at the next open, and effect ordering did the rest: in the commit where `open` flips true the `[query]` effect still saw the OLD query (so it did not run), React re-rendered with `query === ""`, and THAT commit ran it and called `setActive(0)`. So the feature worked only on the very first open - after any search the list opened at the top instead of at the selection. The query is now cleared on CLOSE, one commit before the next open reads it. Combobox fixed the same ordering hazard under #425. `Select.jsx:222` - fixed 2026-10-07
- [x] **[#468] the `.twc-pop__group` label divs are `role="presentation"`** - a listbox owns `option`/`group` only, and these bare label divs were neither, so a screen reader walked them as list content. Wrapping each group in a real `role="group"` + `aria-labelledby` (as CommandPalette now does) is the fuller fix, but the virtualized path renders a FLAT row list with no nesting to hang it on - deferred. `Select.jsx:409,416` - fixed 2026-10-07

## Verified OK

- Controlled/uncontrolled mode works (value/defaultValue/onChange)
- Portal mode with fixed positioning escapes scrolling ancestors (lines 145-163)
- Auto-flip placement when insufficient space below (line 150)
- Keyboard navigation: ArrowUp/Down move focus, Enter selects, Escape closes (lines 199-207)
- Search box auto-enables for >5 options, can be forced on/off (lines 129-130)
- Grouped options with descriptions render properly (lines 229-248)
- Selected item shows checkmark icon (line 243)
- Clearable mode with Delete/Backspace on closed trigger (line 201)
- aria-haspopup + aria-expanded correctly wired; `aria-controls` is open-guarded. **Correction (#459):** this line previously claimed `aria-activedescendant` was correctly wired too. It was not - it sat on a `<button>`, a role that cannot own it, so AT discarded it and the highlight was announced to nobody. The trigger is now `role="combobox"` (the APG select-only pattern) and only claims the attribute while it holds focus.
- Focus management: search input auto-focused when menu opens (line 170)
- Visible options list scrolls to keep active option in view (line 182)
- aria-invalid, aria-describedby wired for error/hint (line 282)
- RTL-safe: uses inset-inline-start/end (line 44)
- SSR-safe: portal detection and fallback (lines 253-254)
