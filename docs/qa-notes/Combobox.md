# QA notes — Combobox

- **Group:** inputs
- **Status:** open
- **Reviewed:** 2026-09-23

## Open issues

- [x] **[#425] Lossy as a datatable cell editor — no `defaultQuery`, and `close()` reset the typed query with no signal** — the field owns its input: the typed query is internal state, `close()` (chevron / Escape / outside click) reset it **without firing `onInputChange`**, and there was no way to pre-fill the box. A host staging the query (a `renderEditCell` that mirrors what the user types into the grid draft) had no signal on the silent reset, so a click-away committed text the field no longer showed; and a Combobox cell editor always opened empty, so a one-character correction meant retyping the whole value. Two additive props close both holes: **`onOpenChange?: (open: boolean) => void`** fires on every open↔close transition — a small effect on `[open]` (skips mount via `prevOpenRef`, reads `onOpenChange` through a ref so its identity doesn't re-fire) catches every path (openMenu, typing, `close()`, chevron), so the host can withdraw a staged draft on close; **`defaultQuery?: string`** seeds the input each time the menu opens (`openMenu()` sets `setQuery(defaultQuery || "")` then a `requestAnimationFrame` puts the caret at the end via `setSelectionRange`). Because the seed goes through `setQuery` (state), not the input's `onChange`, it is **never** emitted as an `onInputChange` — it's a seed, not a user-typed change. It is the search **text** (matched against option labels/descriptions like any typed query, not the option `value`), so a cell editor pre-fills with the current option's *label*. **Regression caught in adversarial review:** because `openMenu()` now seeds a (possibly filtering) query, the `#95` on-open highlight effect — which set `active` from `flat.findIndex(current)` (an index into the *unfiltered* list) — desynced `active` from the filtered `visible` list when a value was selected *and* the seed narrowed the list, breaking `aria-activedescendant`, arrow-key bounds, and Enter (which reads `visible[active]`) — and could silently commit the wrong option. Fixed by indexing `visible` instead of `flat` (falls back to 0 when the selection isn't in the filtered list; reduces to prior behavior when the seed doesn't filter). Tests in `tests/combobox-default-query.test.jsx` (14, incl. the selected-value + filtering-seed regression). `Combobox.jsx` — ✓ 2026-09-23

- [x] **[#412] Escape blurred the input (and cancelled an enclosing editor)** — Escape now closes the list keeping focus (WAI-ARIA); a closed-list Escape bubbles. `Combobox.jsx` — ✓ 2026-09-23

- [x] **[#389] Escape closing an open Combobox inside a Dialog also closed the Dialog** — Combobox now preventDefaults Escape when its list is open. `Combobox.jsx` — ✓ fixed 2026-09-22

- [ ] **[P2] Backspace with selected item keeps selection** — Line 182 has a comment "keep selection; user can clear" but the logic does nothing — just returns early. User expects Backspace to be able to clear the field when empty. Consider allowing a second press to clear, or document this behavior. `Combobox.jsx:182`.

## Enhancements

- **[#342] `disabled` fully suppresses the clear ✕** — the clear "✕" render condition
  (`clearable && selected && !open`) lacked a `!disabled` term, so a disabled Combobox still rendered a
  clickable clear that fired `onChange(null)` — a disabled (read-only) control could be value-wiped
  (`.twc-cb__control[data-disabled]` sets only opacity, no `pointer-events: none`). Added `!disabled` to the
  render (matching Select/DatePicker) **and** a `if (disabled) return;` sink guard at the top of `commit()`,
  so no path (clear ✕, Backspace-to-clear) mutates value while disabled. Tests in
  `tests/disabled-clear-affordance.test.jsx`. — fixed 2026-08-11

- **[#326] Richer options — `renderOption` + option `icon`/`hint`** — the shared `Option` type gains optional
  `icon` (leading node, rendered in `.twc-opt__icon`) and `hint` (trailing muted node in `.twc-opt__hint`, e.g.
  a shortcut/count) for a lift with no custom render. For full control, `renderOption(option, { selected, active })
  => node` replaces the row **body** while twico keeps the row chrome (the `.twc-opt` button, keyboard nav, ARIA
  `aria-selected`/active, and the clear affordance). `renderOption` takes precedence over `icon`/`hint`. Like
  `wrapOptions`, it **disables `virtualized`** (custom/variable-height rows can't be windowed by the fixed
  `rowH`) and `warnOnce`s in dev if both are set (`combobox-var-height-virtualized`). Mirrored on Select +
  MultiSelect (same `.twc-opt` markup; MultiSelect keeps its checkbox around the custom body). Shared tests in
  `tests/select-family-render-option.test.jsx`. — added 2026-08-04

- **[#92] Opt-in option-list virtualization** — `virtualized` (+ `overscan`, default 8) windows the
  option list to the visible slice for long client-side sets; keyboard nav scrolls unrendered options
  into view. Off by default. For server-backed sets, prefer the async `onInputChange` + `filter={false}`
  path (#88). — added 2026-07-04

- **[#300] `wrapOptions` — multi-line option text** — `.twc-opt__label`/`__desc` truncate to one line
  (`white-space: nowrap` + ellipsis), so options sharing a long common prefix (e.g. catalog descriptions that
  share a leading code) were indistinguishable when the differing tail was cut off. `wrapOptions`
  (default false) flips a `data-wrap` attribute on each option row; scoped CSS then sets
  `white-space: normal` + `overflow-wrap: anywhere` (the latter also breaks a single very long token so it
  can't overflow the popover edge) and top-aligns the check icon. **Takes precedence over `virtualized`**
  — wrapped rows are variable-height, which the fixed-`rowH` (36/48) windowing can't measure; passing both
  disables virtualization and `warnOnce`s in dev. Default single-line behavior is unchanged. 4 tests in
  `tests/combobox-wrap-options.test.jsx`. Not (yet) mirrored on Select/MultiSelect (same `.twc-opt` markup,
  could be added if requested). — added 2026-07-30

## Verified OK

- Controlled/uncontrolled single-select (value/defaultValue/onChange)
- Type-to-filter behavior works (displays query while open)
- Portal mode with fixed positioning and viewport flip (lines 138-156)
- Keyboard navigation: ArrowDown/Up navigate, Enter selects, Escape closes (lines 177-180)
- Grouped options with descriptions render correctly
- Clearable button shows when value selected (line 257)
- aria-expanded, aria-autocomplete, aria-activedescendant wired (lines 247-249)
- Focus management: opens menu on focus if not already open (line 252)
- Visible options list auto-scrolls to keep active option visible (line 169)
- Selected label shows when menu closed (line 185)
- Empty state message renders when no results (line 195)
- RTL-safe: uses inset-inline-start/end (line 46)
- SSR-safe: portal fallback detection
