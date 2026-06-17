# QA notes — Box

- **Group:** layout
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues
(none)

## Verified OK
- **Spacing props cascade correctly** — `pt ?? py ?? p` resolution ensures more-specific props override less-specific. `p={4}` works; `p={4} py={2}` correctly applies py={2} to top/bottom.
- **Token conversion** — numeric spacing (e.g. `p={4}`) maps to `var(--space-4)` via the `sp()` function; string CSS lengths pass through unchanged.
- **Background token handling** — surface tokens ("surface", "surface-raised", "surface-sunken", "bg") wrap in `var()`; custom properties like `"--my-color"` are auto-wrapped; arbitrary CSS values like `"#fff"` or gradients used as-is.
- **XSS protection on href** — `<a>` tags filter javascript:/data:/vbscript: URLs via `safeHref()`, stripping control characters to defeat obfuscation.
- **Semantic flexibility** — `as` prop renders any tag while preserving token styling; demos show `as="section"`.
- **RTL-ready** — uses logical properties (`marginInline`, `paddingInline`); no physical left/right in CSS.
- **SSR-safe** — no window/document at module/render scope.
- **Edge inputs** — empty children work; whitespace-only children render as text; 0 spacing valid; negative/invalid spacing reverts to undefined (user error).
