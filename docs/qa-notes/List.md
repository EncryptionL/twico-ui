# QA notes — List

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

(none)

- [x] **[#462] `.twc-list__trail` lands on sunken at 4.34:1 the moment a row is hovered** - the hover rule swaps `--color-surface-sunken` in under text whose colour does not change, and `--color-text-subtle` on sunken is the pairing the token rules forbid (4.26:1 on the `data-active` primary-subtle fill). It passes at rest on `--color-surface`, which is why it survived #449. Now `--color-text-muted` (6.92:1 on sunken). `List.jsx:22` - fixed 2026-10-07

## Verified OK

- **Interactive row tags:** Rows render as <a> (href), <button> (onClick), or <div> based on data. Tag choice is correct.
- **URL safety:** safeHref() blocks javascript:/data:/vbscript: URLs (same guard as Avatar).
- **Leading + trailing slots:** Flexbox layout: lead (flex: none, muted color) | main (flex: 1, title + description) | trail (flex: none).
- **Row interactivity:** Button rows are type="button", links are <a> with proper href. active state highlights with primary-subtle background.
- **Plain mode:** Removes border, background, border-radius; leaves padding for integration into existing cards.
- **Accessibility:** List is <ul>, items are <li> with display:contents (semantic but not box-creating). Interactive rows are keyboard-operable buttons/links.
- **RTL:** Uses logical properties (padding-inline-start/end); safe.
