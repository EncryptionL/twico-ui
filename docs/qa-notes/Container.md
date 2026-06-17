# QA notes — Container

- **Group:** layout
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues
(none)

## Verified OK
- **Max-width sizing** — named sizes (sm/md/lg/xl/full) map to 640/768/1024/1280/100%; custom CSS lengths like `"480px"` pass through correctly.
- **Centering via marginInline** — uses `marginInline: "auto"` for horizontal centering, which respects RTL and respects user text-direction setting.
- **Responsive padding** — `paddingInline: "var(--space-5)"` (20px) applied symmetrically when `padded={true}`; override with `padded={false}` for flush-to-edges layout.
- **Semantic flexibility** — `as` prop renders as section/article/div etc. while preserving width/padding behavior.
- **XSS protection on href** — `<a>` tags filter javascript:/data:/vbscript: URLs via `safeHref()`.
- **RTL-ready** — uses logical properties (`marginInline`, `paddingInline`); no physical left/right.
- **SSR-safe** — no window/document at module/render scope.
- **Width constraint** — `width: "100%"` ensures container fills its parent; `maxWidth` caps content; layout solid for nested/full-page contexts.
