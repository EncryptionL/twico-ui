# Tooltip — positioning notes

Developer notes for `components/overlay/Tooltip.jsx`. Unlike the modal overlays (see
[overlays.md](./overlays.md)), Tooltip portals to `document.body` with `position: fixed`
measured from the trigger, stays mounted, and eases both ways with a plain CSS transition —
but it does **not** trap focus or block the page.

## Positioning model

`place()` reads the trigger's `getBoundingClientRect()` and the measured bubble box
(`offsetWidth`/`offsetHeight`), then sets the anchor edges. `data-place` supplies the enter
transform-origin; the centred axis is **clamped** to the viewport (minus an 8px margin) so a
long label near an edge doesn't run off-screen. It **flips** to the opposite side only when the
preferred side lacks room and the opposite has more (#48).

## Width — grow horizontally, then wrap (`width: max-content`)

The bubble is `width: max-content; max-width: var(--_tw-maxw, 320px); white-space: normal`, so it
grows horizontally with the content up to the max-width and only then wraps.

This matters because the bubble is `position: fixed` with `left` set. A plain shrink-to-fit
(`width: auto`) box computes its width against the space **between `left` and the viewport edge**
— so a tooltip whose trigger sits near the **right** edge (large `left`) collapses to that tiny
remaining width and the text wraps to ~one word per line, stretching the bubble vertically.
`width: max-content` sizes to the content (capped by `max-width`) and ignores that available-space
constraint, so the bubble keeps its natural width wherever it is placed. Set `--_tw-maxw` to raise
or lower the wrap point.

## Arrow — tracks the trigger, not the centre

The bubble is centred on the trigger via a CSS `translate` and then clamped inward near an edge —
which would leave a centre-locked arrow pointing at empty space. Instead the arrow is positioned
from `--_tw-arrow-x` / `--_tw-arrow-y` (px from the bubble's leading edge), computed in `place()` as
the trigger centre minus the bubble's edge and clamped to stay clear of the rounded corners. When
the trigger is not near an edge this resolves to the centre; near an edge it slides toward the
trigger so the arrow always points at it. Both fall back to `50%` before the first measurement / SSR.

## A11y

`role="tooltip"` + `aria-describedby` wiring on the trigger; **Escape** dismisses (WCAG 1.4.13); a
short close grace lets the pointer travel from the trigger onto the (hoverable) bubble (#114).
`prefers-reduced-motion` drops the scale/translate animation.

## Verification

`tests/Tooltip.test.jsx` stubs the trigger rect + bubble box (jsdom has no layout) to assert the
`width: max-content` CSS and that the arrow offset clamps toward a right-edge trigger and centres
otherwise.
