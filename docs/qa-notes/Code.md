# QA notes — Code

- **Group:** typography
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues
- [x] **[P2] Long inline snippets clip / force horizontal overflow** — `.twc-code` sets `white-space: nowrap` (`Code.jsx:9`). Inline `<Code>` is documented and demoed as sitting *inside* body `Text` (`CodeVariations.jsx:14-24`, `Code.prompt.md:6`), but a long unbroken token (a full command, a URL, a long flag string) will refuse to wrap. In a narrow/mobile container or a fixed-width card it pushes a horizontal scrollbar or overflows the parent rather than breaking onto the next line — a real layout break for the exact "snippet in a sentence" use case it's built for. _Fix:_ replace `white-space: nowrap` with `overflow-wrap: anywhere` (or `word-break: break-word`) so long snippets wrap within the flow; keep `padding`/`border` as-is. `components/typography/Code.jsx:9` — ✓ fixed 2026-06-17

## Verified OK
- `font-size: 0.875em` is relative (em), so inline code scales with the surrounding `Text` size instead of locking to a fixed px — correct for embedding in `Text size="sm"` vs `size="lg"` (`Code.jsx:5`).
- Single shared `<style id="twc-code-styles">` injected once via `useInsertionEffect` with an early-return de-dupe guard — multiple `<Code>` instances inject CSS exactly once (`Code.jsx:23-28`).
- SSR-safe: `useInsertionEffect` is client-only and never runs during server render; no `window`/`document` at render scope. First-paint-before-hydration shows unstyled `<code>` text (the accepted library-wide injection pattern), no hydration mismatch.
- `as` override works and `href` sanitization is correctly gated on `Tag === "a"` so `<Code as="a" href="javascript:…">` is neutralized; `as="kbd"` (the demo) renders cleanly with the code styling (`Code.jsx:30-32`, `CodeVariations.jsx:29`).
- All CSS values are token-driven (`--font-mono`, `--color-surface-sunken`, `--color-text`, `--radius-sm`, `--border-thin`, `--color-border`), so dark mode flips automatically via semantic aliases — no hardcoded colors.
- No focus/keyboard surface (non-interactive by default), no motion, no portal — nothing for reduced-motion or z-index to affect.
