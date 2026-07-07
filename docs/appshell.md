# AppShell — layout & focus notes

Developer notes for `components/layout/AppShell.jsx` (a fixed `sidebar` beside a scrollable content
area, with an optional `header`). Structure: `.twc-shell` → the skip link, the `sidebar`, and
`.twc-shell__main` (the header + the scrollable `<main>` content region `.twc-shell__content`).

## Skip link (#134)

The shell renders a **"Skip to content"** link (`.twc-shell__skip`) as the first focusable element; it
targets the content region by id (`mainId`, default `twc-main`). The `<main class="twc-shell__content"
id={mainId} tabindex="-1">` is a **programmatic focus target** so the skip link can move focus into the
content. The link is visually hidden until focused (`transform: translateY(-200%)` → `0` on
`:focus-visible`, with the brand ring).

## Skip-target focus ring (#190)

`tabindex="-1"` makes the `<main>` focusable **by mouse** (per spec, clicking focuses any element with a
`tabindex`). So clicking anywhere in the content focuses `<main>` (pointer modality → no ring), and then
the **first keypress** (commonly Shift) flips the browser to keyboard modality, at which point
`:focus-visible` becomes true for the focused `<main>` and the UA draws an outline around the **entire**
content area — a large, surprising ring.

Fix (in `SHELL_CSS`):

```css
.twc-shell__content:focus,
.twc-shell__content:focus-visible { outline: none; }
```

This suppresses the ring on the skip target only. It's safe for a11y: the region is **not** tab-reachable
and is not an interactive control, the skip **link** keeps its own visible ring
(`.twc-shell__skip:focus-visible`), and screen-reader focus announcement on skip-link activation is
unaffected. Note the selector is `.twc-shell__content` (the `<main>`), **not** `.twc-shell__main` (the
non-focusable wrapper `<div>` that holds the header + content).
