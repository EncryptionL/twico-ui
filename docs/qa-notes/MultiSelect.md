# QA notes — MultiSelect

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Enhancements

- **[#92] Opt-in option-list virtualization** — `virtualized` (+ `overscan`, default 8) windows the
  checkable option list to the visible slice for long lists; aria-activedescendant / keyboard indexing
  spans the full list and nav scrolls unrendered options into view. Off by default. — added 2026-07-04

## Verified OK

- Controlled/uncontrolled multi-select (value/defaultValue/onChange)
- Type-to-filter behavior works among chips
- Portal mode with fixed positioning and auto-flip (lines 146-164)
- Chips render as selected indicators with remove buttons (lines 257-264)
- Backspace on empty input removes last chip (line 193)
- Keyboard navigation: ArrowDown/Up navigate, Enter toggles, Escape closes (lines 188-192)
- Checkbox options show checked state (line 217)
- Clearable button removes all selections (line 272)
- aria-multiselectable correctly set on listbox (line 205)
- aria-expanded, aria-autocomplete, aria-activedescendant wired (lines 265-267)
- Placeholder hides when chips present (line 268)
- Input focuses on chip removal (line 186)
- Empty state message renders when no results
- Grouped options with descriptions render
- RTL-safe: uses inset-inline-start/end
- SSR-safe: portal fallback detection
