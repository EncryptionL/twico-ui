# QA notes — Badge

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-10-06

## Open issues

- [x] **[#449] the `soft` variant's tone foregrounds failed WCAG AA in the light theme** - the `-600` foreground
  on the `-50` tint measured success **3.58:1**, warning **3.07:1**, info **3.84:1** and danger **4.28:1**, all
  under the 4.5:1 floor for normal text (primary and neutral already passed). Status pills appear on essentially
  every list and detail page, and `color-contrast` is scored per-audit, so one failing node keeps the whole audit
  red. Fixed by moving the four light `--color-*-subtle-fg` tokens one text-grade step to `-700`: success
  **5.21:1**, warning **4.84:1**, danger **5.72:1**, info **5.57:1**. Dark was already fine (the `-400`
  foreground over a 15% tint composited on the surface measures 5.8-8.3:1) and is unchanged. The report named only
  Badge, but these are shared tokens - the same fix lifts [Alert](Alert.md), whose DEFAULT variant is `soft` and
  default tone `info`, i.e. the library's most-used tinted surface was the worst case. See
  [colors.md](../colors.md). `tokens/colors.css`; `tests/tokens-a11y.test.js`. - fixed 2026-10-06

## Verified OK

- **Tone × variant matrix:** 6 tones × 3 variants (soft/solid/outline) implemented via data attributes + CSS custom properties. All combinations present and render correctly.
- **Dot sizing:** 6px dot scales proportionally; uses currentColor so it inherits the badge's foreground color.
- **Size variants (sm/md/lg):** Font size, padding, and height all scale appropriately. sm uses 18px height (7px padding reduction), lg uses 26px.
- **Accessibility:** Semantic <span> with role defaults to text. No ARIA needed for visual indicators.
- **RTL:** No physical left/right CSS; safe for RTL.
