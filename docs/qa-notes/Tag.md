# QA notes — Tag

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

(none)

## Verified OK

- **Remove button:** Conditionally rendered only when onRemove prop exists. Button is type="button", aria-label="Remove", click-handler receives (e).
- **Left icon slot:** Positioned first in the flex row (if leftIcon exists).
- **Tone × variant matrix:** 6 tones × 3 variants (soft/solid/outline) use CSS custom properties (--_accent family). Neutral defaults to text/surface (full opacity border-subtle).
- **Remove button styling:** Always danger-tinted on hover (danger-subtle bg), regardless of tag tone. Icon is 13×13px.
- **Padding adjustment:** data-no-remove="true" increases padding-inline-end to 11px (from 6px) when no remove button.
- **Height:** Fixed at 28px; font-size xs, medium weight.
- **Active press:** Remove button scales 0.85 on :active.
- **Accessibility:** Remove button is properly labeled. Tag is semantic <span> with appropriate aria-label if needed.
- **RTL:** Uses logical padding-block/padding-inline; safe.
