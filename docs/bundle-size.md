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

The same step was applied to the shipped stylesheet, since `tokens/*.css` and `base.css` are
commented too and `styles/twico-ui.css` is concatenated from them verbatim. That half was **wrong**,
and #539 undid it — see [Two stylesheets, not one](#539--two-stylesheets-not-one) below.

### Where the stripping happens

**`scripts/strip-css-comments.mjs`**, wired into `tsup.config.ts` as an `esbuildPlugins` entry. The
stylesheet is handled separately by `scripts/css-minify.mjs` (#539), which rewrites only the
`.min.css` copy.
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
(verified at the time by regenerating from an LF copy of every source: 15,954 bytes both sides —
the authoring copy is 28,893 bytes again since #539, and `styles/twico-ui.min.css` is the file that
regeneration now has to match). Four tests pin it, including the exact line shape that broke.

The pre-existing generator was immune because it only concatenated; the comment stripper is what
introduced the sensitivity.

### Guards

- `tests/strip-css-comments.test.js` — 20 tests: the delimiter-in-a-string case, `url(//…)`, escaped
  sequences, interpolations, a literal nested inside an interpolation, idempotence, the three
  boundary rules, and a sweep asserting every one of the 80+ component sources stays brace-balanced
  with every interpolation intact, plus four for line-ending determinism.
- `npm run size` at 126 kB, which fails if the comments return.
- `npm run build:css:check`, which fails if **either** stylesheet drifts from a regeneration.
- `tests/css-minify.test.js` — 21 tests (see #539 below).

---

## #539 — two stylesheets, not one

#534's bundle half was free: `dist/index.mjs` is machine-read, so a comment in it is pure cost. Its
stylesheet half was not, and the numbers are why.

`styles/twico-ui.css` is the documented **authoring** surface — the file someone opens to re-skin the
library. Stripping it took 144 comments with it:

| `styles/twico-ui.css` | 1.51.1 | 1.51.2 (#534) |
| --- | --- | --- |
| bytes | 28,541 | 15,954 |
| comments | 152 | **8** |

The 8 survivors were the banner and the seven `/* ===== tokens/<name>.css ===== */` separators.
Everything that said *why* a value is what it is went, including **16** comments carrying a contrast
ratio:

```
/* was brand-500: white ink on it is 4.47:1, under 4.5 */
/* dark ink on amber-500 = 6.97:1 (white was 2.15:1) */
```

and the signpost a re-skinner is actually looking for:

```
/* Brand alias — remap these to re-skin the whole library */
```

So someone remapping `--color-primary` had no in-file signal that the old value was picked to clear
WCAG 1.4.3, and the #454/#455 notes about an unchecked `Checkbox`/`Switch` boundary being the
control's only affordance were gone from the place where someone would recolour it.

The consumer-side saving was real, though — an app importing the stylesheet in its root layout
served 12,648 fewer bytes on every page. **The objection was to there being one copy**, not to the
saving. So there are now two:

| file | export | bytes | brotli | comments |
| --- | --- | --- | --- | --- |
| `styles/twico-ui.css` | `twico-ui/styles.css` | 28,960 | 7.69 kB | **153** |
| `styles/twico-ui.min.css` | `twico-ui/styles.min.css` | 12,796 | **2.99 kB** | 1 (its own header) |

Both are generated by one `npm run build:css` from the same string, and `--check` guards both, so
they cannot describe different stylesheets. The min copy is **smaller than #534's stripped single
copy** (12,796 vs 15,954 bytes; 2.99 vs 3.28 kB brotli), because comment removal was only half of
what a `.min.css` name promises.

`twico-ui/styles.css` stays the default in the README and every example: a consumer who reads nothing
gets the documented, legible file, and opting into `styles.min.css` is a one-word change at the one
import site.

### What the minifier will not do

`scripts/css-minify.mjs` is the same string-aware walker as #534's, plus a whitespace and
punctuation pass. Every transform leaves the **CSSOM byte-for-byte identical**. It does not reorder,
merge, dedupe, shorten colours, or drop "redundant" declarations, and it never touches:

- a **string** — `content: "/*"` is a string that merely contains the delimiter;
- an **unquoted `url()`** — `url(//host/path)` is protocol-relative, not a line comment, and a
  `data:` URI carries `:` `;` and `,` that are not punctuation there;
- a **custom property's value**.

The last one is the interesting carve-out. A custom property's value is an opaque token stream, and
Chrome's CSSOM hands back the **original text** for it — so collapsing the newline inside

```css
--font-sans: "Plus Jakarta Sans",
      ui-sans-serif, system-ui, …;
```

produces a stylesheet that renders identically and *compares* different. Measured, leaving all 312 of
them verbatim costs **601 bytes** of 12.8 kB: 560 from the whitespace runs, 41 from commas and
parens. That buys the difference between "equivalent, if you accept an argument about CSS
tokenisation" and "identical, and here is the diff" — at 5% of a 56% saving. Leading and trailing
whitespace *around* the value is still dropped, because the CSSOM trims exactly that.

Combinator spaces are kept too (`.a > .b`, not `.a>.b`). At depth 0 those three characters are
selector combinators and inside `calc()` they are operators; telling them apart needs a grammar this
file deliberately does not have, and the whole saving forgone is 4 bytes.

### How equivalence was proved

Not by a byte count. `.work/css/cssom.mjs` loads **both** files in headless Chromium and walks
`document.styleSheets` rule by rule, comparing each selector against its full declaration list —
property name, resolved value and `!important` flag — including inside every at-rule:

| | bytes | top-level rules | CSSOM nodes |
| --- | --- | --- | --- |
| `twico-ui.css` | 28,893 | 36 | 74 |
| `twico-ui.min.css` | 12,792 | 36 | 74 |

**CSSOM identical.** A first run reported a difference, and it was this real one: the custom-property
values above. The carve-out is what that measurement bought.

### Guards

- `tests/css-minify.test.js` — 21 tests: the delimiter-in-a-string case, `url(//…)`, an unquoted
  `data:` URI, the depth-0 `:` that must not be tightened (`a :hover` and `a:hover` are different
  selectors), `;}` → `}`, combinator and `!important` spacing, the three custom-property rules,
  idempotence, line-ending determinism, a NUL-byte refusal, and — the drift guard — that
  `styles/twico-ui.min.css` is exactly what the minifier produces from the authoring copy.
- `npm run build:css:check` — fails if either file is stale.
- A **3,300 B brotli budget** on `styles/twico-ui.min.css` (`MIN_BROTLI_BUDGET` in
  `scripts/build-css.mjs`, today 2,988 B), so the loading copy has the budget #534 noted it was
  missing. It lives in the generator, not in `size-limit`: that preset runs every `path` it is given
  through rolldown, and a `.css` entry is not a JS module. The authoring copy deliberately has no
  budget — legibility is its job.

---

## #551 — 59 components were re-declaring a font the document already supplies

Not a size story, but it lives next to #534/#539 because it is the same shape: something shipped to
every consumer that said nothing.

`base.css` sets `font-family: var(--font-sans)` on `body`, and `font-family` is **inherited**, so it
reaches every descendant without any component declaring it. 59 components declared it anyway, 73
times. Each one was:

- **redundant** when nobody is overriding — measured identical with and without the declaration; and
- **blocking** when somebody is. A declaration that *matches* the element beats an inherited value at
  **any** specificity, so a consumer's `.content { font-family: Georgia }` on a wrapper reached
  nothing inside it.

That is #543's defect class — the library vetoing an override — at library scale, and #547 had only
fixed two components.

### The reset `base.css` was missing

Deleting all 73 on its own would have been a **regression**, and this is the part worth recording:
form controls do **not** inherit `font-family`. The UA stylesheet gives `<button>`, `<input>`,
`<select>`, `<textarea>` and `<optgroup>` their own, and `base.css` had no

```css
button, input, select, textarea, optgroup { font-family: inherit; }
```

That missing rule is *why* 59 components each re-declared the font: without it, anything rooted on a
control would fall back to the UA face. The reset is `inherit` rather than the token deliberately —
by default it resolves through `body` to the same `--font-sans`, so nothing moves, but a container
font now reaches the controls inside. `font-size` is left alone: components set their own from the
type scale, and making controls inherit 16px would resize every one of them.

### The latent bug this uncovered

The parity probe reported 84 elements changing — and the **direction** was the finding:

```
Arial  ->  "Plus Jakarta Sans", ui-sans-serif, …
```

Those 84 were rendering in the **UA form-control font in the published build**, across 12
components, because the component declared the font on its *root* while the control inside it is a
`<button>` that does not inherit: `button.twc-page` in `Pagination`, `CardGrid` and `DiffTable`
(the page-number buttons — three of them carry visible text), `button.twc-cb__chev` in `Combobox`,
`button.twc-dt__menu-btn`, `input.twc-check__input`, and the `<svg>`/`<path>` children that inherit
from them.

So the brand font was never reaching a visible pagination control, and nothing caught it because no
test and no baseline looked at `font-family`.

### Measured

Three scenarios, 113 components rendered from each bundle and compared element-for-element on
computed `font-family` (`.work/probe/ff-ssr.jsx` + `ff-diff.mjs`):

| scenario | result |
| --- | --- |
| **control** — the published bundle against itself | 724 elements, **0 changed** (the probe is calibrated) |
| **no ancestor font** — parity | 640 identical, **84 gained** the brand font, **0 regressions** |
| **with an ancestor font** — the point of #551 | **611 elements now pick it up**, 0 moved the wrong way |

The `--font-mono` declarations are untouched — 8 across 6 files. `base.css` sets mono on
`code, pre, kbd, samp` **by tag**, so a component rendering a `<div>` or `<span>` would lose it.
Same reasoning that kept `Heading`'s `font-weight`/`color`/`line-height` as class rules in #547
while its `font-family` could go.

### Two things the probe caught that review would not have

1. **A counting checker cannot tell a fix from a regression.** The first run printed
   `PARITY BROKEN — 84 elements differ` for 84 elements moving *toward* the brand font. The tool now
   takes the expected target on the command line, because "good direction" is the opposite in the
   two scenarios: without an ancestor font nothing may *lose* the brand font, and with one the
   components *should* lose it.
2. **A tidy-up regex quietly reformatted files.** `/ {2,}([a-z-]+:)/` also matches line-start
   indentation, so it reindented every continuation line of the multi-line rules — `FieldRow.jsx`'s
   source-text tests caught it. There is now no whitespace tidying at all: a leftover double space
   inside a CSS string costs nothing. A second pass then found the whole-rule pattern consuming the
   `\n` of a **CRLF** pair and orphaning the `\r`, which made git report two files as entirely
   rewritten; the script normalises to LF and restores the file's own ending, like
   `scripts/build-css.mjs`. Both were found by diffing the files line-by-line rather than by reading
   the diff.
