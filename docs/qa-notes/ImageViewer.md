# QA notes — ImageViewer

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-09-22

## Open issues

- [x] **[#407] no zoom/pan viewer for an image (charts had `zoomable`, images had nothing)** — added
  `ImageViewer`, a zoomable/pannable image on a fixed stage. Pointer-anchored wheel + pinch zoom via a
  **non-passive** native `wheel` listener (React's `onWheel` is passive, so the page/dialog behind would
  otherwise scroll — the same pattern the charts use), drag-to-pan when zoomed (clamped to the stage so the
  image can't leave it), `+`/`-`/`0` keys, and double-click to toggle. Controlled/uncontrolled `zoom`
  (`zoom`/`defaultZoom`/`onZoomChange`), resets when `src` changes, and built-in zoom in/out/reset controls
  (Tooltip-wrapped `IconButton`s reused from the barrel) with a node / render-prop / `false` `controls` slot.
  Respects `prefers-reduced-motion`. Kept SEPARATE from `Image` so the lean `<img>` path isn't bloated. 6 tests
  in `tests/image-viewer.test.jsx`. `ImageViewer.jsx`/`.d.ts` — ✓ added 2026-09-22

## Notes

- The stage size comes from `style`/`className` on the root (a "fixed stage"); the demos set an explicit height.
- Pan bounds use the stage box as an approximation of the scaled element (letterboxing from `object-fit:contain`
  is not separately measured).
