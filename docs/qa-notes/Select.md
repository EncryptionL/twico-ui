# QA notes — Select

- **Group:** inputs
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P1] Portal z-index string vs numeric mismatch** — Portal popover uses CSS var `z-index: "var(--z-tooltip)"` (line 263) but this should be just the CSS variable without quotes in the style object. Fix: change to `zIndex: "var(--z-tooltip)"` in camelCase JS prop. `Select.jsx:263`. — ✓ fixed 2026-06-17

- [ ] **[P2] Popover viewport flip animation mismatch** — When menu flips to top, transform-origin is set to bottom (CSS line 53) but animation timing remains the same (line 52). During the flip-and-open transition, the visual effect might feel jerky. Consider adding a CSS animation-delay or transform-origin class based on data-placement. `Select.jsx:52-53`.

## Enhancements

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

## Verified OK

- Controlled/uncontrolled mode works (value/defaultValue/onChange)
- Portal mode with fixed positioning escapes scrolling ancestors (lines 145-163)
- Auto-flip placement when insufficient space below (line 150)
- Keyboard navigation: ArrowUp/Down move focus, Enter selects, Escape closes (lines 199-207)
- Search box auto-enables for >5 options, can be forced on/off (lines 129-130)
- Grouped options with descriptions render properly (lines 229-248)
- Selected item shows checkmark icon (line 243)
- Clearable mode with Delete/Backspace on closed trigger (line 201)
- aria-haspopup, aria-expanded, aria-activedescendant correctly wired (lines 281-282)
- Focus management: search input auto-focused when menu opens (line 170)
- Visible options list scrolls to keep active option in view (line 182)
- aria-invalid, aria-describedby wired for error/hint (line 282)
- RTL-safe: uses inset-inline-start/end (line 44)
- SSR-safe: portal detection and fallback (lines 253-254)
