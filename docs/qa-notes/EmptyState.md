# QA notes — EmptyState

- **Group:** Feedback
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Verified OK

- **API:** `border` is the preferred prop; legacy `bordered` still works as an alias. Both set `data-bordered` correctly for CSS targeting.
- **Layout:** Flexbox column layout with center alignment; all children (icon, title, description, actions) properly spaced and centered. Icon placed in a tinted background tile as designed.
- **Icon accessibility:** Icon span has `aria-hidden="true"` since it's purely decorative; content is conveyed through text.
- **Edge cases:** All properties are optional and handled with conditional rendering; works with only title, only icon, or full composition. No crashes with empty or whitespace content.
- **Styling:** Padding, gap, border-radius, and font sizes all use design tokens. Dashed border appears only when `border` or `bordered` is true; otherwise transparent border.
- **SSR safety:** Uses `React.useInsertionEffect` to inject styles; no window/document at module or render scope.
- **RTL:** Flexbox column layout, center text alignment, and no physical left/right properties. Should work correctly in RTL.

