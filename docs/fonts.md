# Webfonts

Twico self-hosts its two OFL families — **Plus Jakarta Sans** (UI) and **JetBrains Mono** (code) — as
variable fonts, so one file covers a whole weight range. There is no CDN (rule §4.2), and the
`@font-face` rules live in the shipped stylesheet, which means the *format* is twico's decision, not the
consumer's: an app cannot change it without re-declaring all three faces against its own copies and
then silently diverging the next time twico updates them.

## Three faces, shipped as WOFF2 (#450)

| Face | Source `.ttf` | Shipped `.woff2` |
| --- | --- | --- |
| PlusJakartaSans-Variable | 172.2 KiB | **59.1 KiB** |
| PlusJakartaSans-Italic-Variable | 178.9 KiB | **64.5 KiB** |
| JetBrainsMono-Variable | 182.8 KiB | **70.0 KiB** |
| | 533.9 KiB | **193.6 KiB** |

They used to ship as `.ttf` with `format("truetype-variations")`. TTF is compressed only by the
*transport*, so the saving depended on the host being configured to compress `font/ttf` at all. WOFF2 is
brotli-compressed **inside the container**, so:

- against a host that gzips fonts (the common case), the two non-italic faces drop from ~167 KiB to
  ~129 KiB — about **38 KiB** per cache-cold visit, and ~58 KiB once italics are used;
- against a host that does *not* compress fonts, the drop is from 534 KiB to 194 KiB;
- either way it no longer depends on host configuration.

Note the realistic figure is ~20–30%, not the "WOFF2 is 60–70% smaller than TTF" rule of thumb — that
number compares against *uncompressed* TTF. Each generated file is nonetheless smaller than a plain
brotli-11 pass over its source, which is how you can tell the `glyf`/`loca` transform actually ran.

`font-display: swap` is already set on all three faces and is correct; Lighthouse flags it as an
opportunity even when present. Subsetting is deliberately **not** done — the outline tables are most of
each file, but variable fonts make it easy to get wrong (dropping `gvar` discards the deltas for every
retained glyph), so it is a separate, careful job if ever.

## Regenerating

The `.woff2` files are **committed artifacts**, like `src/brand-icons.tsx`:

```bash
npm i -D wawoff2          # one-off; already in devDependencies
npm run build:fonts       # .ttf -> .woff2, then mirror into styles/fonts/
npm run build:css         # the @font-face urls live in tokens/fonts.css
```

`scripts/build-fonts.mjs` uses [`wawoff2`](https://github.com/fontello/wawoff2) — Google's own `woff2`
encoder compiled to WebAssembly, so the output is byte-identical to the reference `woff2_compress` with
no native toolchain to build. It is a **devDependency**: the zero-runtime-deps promise and
`npm audit --omit=dev` = 0 are untouched.

It deliberately never runs in CI or on publish. A `wawoff2` version bump would change the output bytes
and fail an unrelated Dependabot PR, so CI validates the committed set instead:

```bash
npm run build:fonts:check
```

which asserts (a) every source `.ttf` has a committed sibling `.woff2`, (b) `styles/fonts/` mirrors
exactly that set plus the OFL licence, byte-for-byte, and ships **no** `.ttf`, and (c) every `url()` in
`tokens/fonts.css` resolves to a file that exists. (c) is the one nothing else would catch — a 404
webfont is a silent fallback to a system font, not a page error, so the headless render-check sees
nothing wrong.

## The two font directories

`assets/fonts/` is the **source** (it keeps the `.ttf` originals, which are what regeneration reads).
`styles/fonts/` is the **shipped** copy that `twico-ui/styles.css` resolves `./fonts/` against, and it
carries only the `.woff2` plus the licence. `build:fonts` is what keeps the two in sync — before it,
CLAUDE.md just asked you to remember.
