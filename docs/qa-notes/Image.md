# QA notes — Image

- **Group:** data-display
- **Reviewed:** 2026-09-11
- **Status:** clean

## Open issues

- [x] **[#378] `fit` silently overrode `width`/`height`** — `.twc-image[data-fit] { width: 100%; height: 100% }`
  beats the `width`/`height` **presentational attributes** (a presentational attribute loses to any real CSS
  rule), so `<Image width={56} height={56} fit="cover" />` ignored the size and filled its container — or, with
  an auto-sized parent, rendered at the image's **intrinsic** dimensions (a 4000px upload blew out the layout).
  Data-dependent and silent: fine for small test images, catastrophic for a camera-resolution photo. Fixed with
  the issue's preferred option: **when `fit` is set**, explicit `width`/`height` are also emitted as **inline
  style** (which beats the stylesheet rule), so the props mean what they say while `object-fit` still crops
  within that box. They stay attributes (intrinsic-size / CLS hint), and a caller's own `style` still wins
  (spread last). The inline emission is **gated on `fit`** — that's the only case with the overriding rule — so
  the no-`fit` path stays attribute-only and a consumer's own CSS/className can still override the size. 7 tests
  in `tests/image-fit-size.test.jsx`. `Image.jsx` — ✓ fixed 2026-09-11

## Verified OK

- `alt` is required (typed); `""` allowed for decorative images.
- `loading` defaults to `"lazy"`; `fallback` swaps in on error via `onError` (once, guarded by `failed`).
- `radius` maps to `var(--radius-*)`; `aspectRatio` passes through to CSS `aspect-ratio` (reserves space, avoids CLS).
- Scoped `<style>` rendered via `useScopedStyles` (SSR-safe, deduped by id).
