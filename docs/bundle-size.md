# Bundle size — what the package actually ships

How the published size is measured, where it went, and the one non-obvious thing that was costing
14% of it.

Related: [build.md](./build.md) · [design-sync.md](./design-sync.md) · [documentation.md](./documentation.md)

---

## The budget

`npm run size` (size-limit, `@size-limit/preset-small-lib`) measures the built bundle **minified and
brotli'd**, which is what a consumer's network actually pays:

| entry | limit | today |
| --- | --- | --- |
| ESM, full barrel (`dist/index.mjs`) | **126 kB** | 119.68 kB |
| `{ Button }`, tree-shaken | 4.5 kB | 3.10 kB |
| `{ Card }`, tree-shaken | 3.6 kB | 3.08 kB |

The full-barrel limit was **140 kB** and sat at 139.84 kB — 0.16 kB spare, so any CSS addition failed
CI. It is now 126 kB: ~6 kB of room for real additions, and tight enough that the 20 kB described
below **fails the build if it ever creeps back**.

---

## #534 — CSS comments were shipping to every consumer

Every component renders its own scoped CSS from a **JS template literal** passed to
`useScopedStyles(id, css)`. A comment inside a template literal is **string content, not a comment**,
so no minifier removes it: tsup, esbuild and terser all strip `//` and `/* */` from *code* and leave
string bytes untouched.

The library was therefore shipping its own CSS commentary — some of the best documentation in the
repo — to every consumer who installed it.

```
/* */ comment bytes in dist/index.mjs:   96,366      (8.5% of the raw bundle)
```

| | minified + brotli |
| --- | --- |
| before | 139.84 kB |
| after | **119.68 kB** |
| **saving** | **20.26 kB (14.5%)** |

For scale, that is about **four times** the `twico-ui/colors` and `twico-ui/icons` entry points
combined.

The shipped stylesheet had the same problem, since `tokens/*.css` and `base.css` are commented too
and `styles/twico-ui.css` is concatenated from them verbatim:

| `styles/twico-ui.css` | raw | brotli |
| --- | --- | --- |
| before | 29,244 | 7.41 kB |
| after | 16,762 | **3.37 kB** |

### Where the stripping happens

**`scripts/strip-css-comments.mjs`**, wired into `tsup.config.ts` as an `esbuildPlugins` entry, and
`stripComments()` inside `scripts/build-css.mjs` for the stylesheet.

It runs at **load** time, not as a post-build rewrite of `dist/`, so esbuild generates the sourcemaps
from the stripped text and each map stays self-consistent — it embeds the same source it points
into. Rewriting a finished map past thousands of removed lines is the alternative, and
`scripts/add-use-client.mjs` only has to shift by one line because it prepends one line.

**The comments stay in `components/**` exactly as written.** The source is what contributors and the
guard tests read; only the shipped copy loses them.

### It is a lexer, not a regex — and that matters

A regex over the file cannot distinguish:

| | |
| --- | --- |
| a block comment in real JS | esbuild already removes these |
| a block comment inside a CSS literal | what we are here for |
| `content: "/*"` | a CSS **string** that merely contains the delimiter |
| `url(//host/path)` | a protocol-relative URL, **not** a line comment |
| `${...}` | code again, and it may nest a further literal |

Two of those are live in this repo: `components/_upload.js:11` has the code string `"/*"`, and
`components/buttons/Button.jsx:41` explains a rule using escaped backticks *inside* a CSS comment.

Getting it wrong does not fail loudly — it produces a subtly broken stylesheet at runtime.

### Three rules the implementation follows

1. **A comment containing `${` is kept.** A template literal knows nothing about CSS comments, so an
   interpolation written inside one is evaluated and substituted for real. The values this library
   puts there are plain string constants, so removing them would in fact be safe — but "this comment
   is prose" and "this expression has no effect" are different claims, and only the first is ours to
   make. Several comments in `FieldRow.jsx` quote `${ROW}` and `${SOLO}` while explaining a rule.
2. **`//` is never a comment inside a literal.** CSS has no line comments.
3. **A run's boundaries keep one whitespace character if they had any.** The walker hands the
   transform one run per gap between interpolations, so a run's edges sit against a `${...}` or the
   literal's own delimiter — and squeezing an edge away splices two CSS tokens together. Harmless in
   `{ ${rules} }`, fatal in `margin: ${top} ${left}` → `10px10px`.

Rule 3 was **shipped wrong in the first attempt** and caught by diffing the two bundles, not by a
test. There are now four tests for it.

### How equivalence was proved

Counting bytes proves nothing about correctness. The check that matters renders **113 components**
from each bundle, extracts every `<style>` block, normalises it, and hashes the result:

| bundle | components | style blocks | normalised CSS | sha256 |
| --- | --- | --- | --- | --- |
| pre-change | 113 | 79 | 407,921 | `cc707cb22dd30c67` |
| stripped | 113 | 79 | 407,921 | `cc707cb22dd30c67` |

**Byte-identical.** The CSS the browser receives is unchanged.

A first attempt at this comparison normalised both bundles with a naive
`/\/\*[\s\S]*?\*\//g` and reported a false difference in `FileUpload` — because that regex ate the
code string `"/*"` in `_upload.js` and swallowed real CSS after it. The same trap the lexer exists to
avoid, in the script written to validate the lexer.

### The one CI caught and the local run could not

`build:css:check` passed locally and **failed on CI**. With `core.autocrlf=true` this working copy is
CRLF while the Linux runner checks out LF, and a token source line like

```css
  color-scheme: light; /* a note */
```

ends in a carriage return. Once the comment is removed the line ends in a **space followed by that
CR** — and a trailing-whitespace strip anchored at end-of-string cannot see the space, because the CR
is last. The generated stylesheet therefore differed between the two checkouts, and the guard — which
compares after its *own* CRLF normalisation — still saw a real structural difference.

Both strippers now drop CR before splitting lines, so the artifact is byte-identical either way
(verified by regenerating from an LF copy of every source: 15,954 bytes both sides). Four tests pin
it, including the exact line shape that broke.

The pre-existing generator was immune because it only concatenated; the comment stripper is what
introduced the sensitivity.

### Guards

- `tests/strip-css-comments.test.js` — 20 tests: the delimiter-in-a-string case, `url(//…)`, escaped
  sequences, interpolations, a literal nested inside an interpolation, idempotence, the three
  boundary rules, and a sweep asserting every one of the 80+ component sources stays brace-balanced
  with every interpolation intact, plus four for line-ending determinism.
- `npm run size` at 126 kB, which fails if the comments return.
- `npm run build:css:check`, which fails if `styles/twico-ui.css` drifts from a stripped regeneration.
