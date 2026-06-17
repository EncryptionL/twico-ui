# QA notes — List

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

(none)

## Verified OK

- **Interactive row tags:** Rows render as <a> (href), <button> (onClick), or <div> based on data. Tag choice is correct.
- **URL safety:** safeHref() blocks javascript:/data:/vbscript: URLs (same guard as Avatar).
- **Leading + trailing slots:** Flexbox layout: lead (flex: none, muted color) | main (flex: 1, title + description) | trail (flex: none).
- **Row interactivity:** Button rows are type="button", links are <a> with proper href. active state highlights with primary-subtle background.
- **Plain mode:** Removes border, background, border-radius; leaves padding for integration into existing cards.
- **Accessibility:** List is <ul>, items are <li> with display:contents (semantic but not box-creating). Interactive rows are keyboard-operable buttons/links.
- **RTL:** Uses logical properties (padding-inline-start/end); safe.
