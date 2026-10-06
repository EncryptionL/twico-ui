# QA notes — Alert

- **Group:** Feedback
- **Status:** clean
- **Reviewed:** 2026-10-06

## Open issues

- [x] **[#449] the default `soft`/`info` combination failed WCAG AA in the light theme** - not named in the
  report, but Alert consumes the same `--color-*-subtle-fg` tokens as Badge, and since `soft` is Alert's
  **default** variant and `info` its default tone, the library's most-used tinted surface was the worst case at
  **3.84:1**. Fixed by the four light tokens moving `-600` -> `-700` (info now **5.57:1**); no Alert code change.
  See [Badge](Badge.md) and [colors.md](../colors.md). `tokens/colors.css`; `tests/tokens-a11y.test.js`.
  - fixed 2026-10-06

None identified.

## Verified OK

- **Accessibility:** `role="alert"` correctly applied; icon `aria-hidden="true"`; close button has `aria-label="Dismiss"`. Semantic messaging role properly announces updates to screen readers.
- **Event handling:** `onClose` callback fires correctly on dismiss button click; optional prop pattern allows both dismissible and persistent alerts.
- **Edge cases:** Empty title and children are guarded with conditional rendering; component handles all tone combinations (info/success/warning/danger/primary/neutral) and variants (soft/solid/outline) without visual glitches.
- **Styling:** Animation uses `var(--duration-base)` and `var(--ease-out)` from design tokens; all spacing and sizing consistent with design system. Close button opacity transition smooth.
- **SSR safety:** Uses `React.useInsertionEffect` to inject styles after component mounts; no window/document access at module scope.
- **RTL:** Flexbox layout with `gap` property and no physical left/right positioning; uses standard semantic HTML. Should render correctly in RTL contexts.
- **prefers-reduced-motion:** Slide animation is brief and essential (user action feedback), so continued animation under reduced motion is acceptable.

