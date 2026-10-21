# QA notes — Input

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[#488] `Input` accepted a ref at runtime but its type denied it** - it read `rest.ref` and merged it with the internal ref `clearable` uses, so the capability looked deliberate, but it was declared `export function Input(props: InputProps)`. `React.InputHTMLAttributes` carries no `ref` (that lives in `RefAttributes`) and a plain function component gets none either, so `<Input ref={...} />` was `error TS2322: Property 'ref' does not exist on type 'IntrinsicAttributes & InputProps'` - while the sibling `Textarea` had been a `ForwardRefExoticComponent` since #68. The single-line field, the one most likely to need imperative access (caret work: insert-at-cursor, custom autocomplete, select-all, restoring the caret after a controlled rewrite), was the one that lost.

  The reporter offered two fixes and called both type-only. **Neither of those is quite right, and the difference matters:** adding `ref?: React.Ref<HTMLInputElement>` to `InputProps` would have matched the `rest.ref` runtime, but `rest.ref` only works on **React 19** - React 18 strips `ref` out of props for a plain function component, so that type would compile on React 18 and do nothing, with React logging "Function components cannot be given refs". Peers are `react >= 18`. So the fix is `React.forwardRef` (a runtime change, not type-only), which works on both majors and matches `Textarea`. The existing code comment already knew this - it said the merge "stays a no-op on React 18" - the gap was that nothing acted on it.

  Audited the rest of the surface while here, since the issue asked: 16 components use `React.forwardRef` at runtime; 10 declare `ForwardRefExoticComponent`/`RefAttributes` and the other 6 are polymorphic, whose `PolymorphicComponent<Own, D>` type already carries `ref?: PolymorphicRef<D>`. No component types a ref it does not forward. `Input` was the only component with an EXPLICIT mismatch. **The first version of this note then called the issue's "possibly the same elsewhere" list clean, which was wrong, and the way it was wrong is worth recording:** the audit detector was the string `rest.ref`, which only finds the explicit case. On React 19 `ref` is an ordinary prop, so any plain function component spreading `{...rest}` onto a host element forwards a ref implicitly - verified: `<Button ref={r} />` lands on the `<button>`, `<Checkbox ref={r} />` on the `<input>` - while React 18 forwards nothing and warns, and the type denies it on both. So those components are #488 again in implicit form, not clean; they are simply no worse than before. The right detector is behavioural ("does `{...rest}` reach a host element?"), not textual. Converting them is a separate change, out of scope here.

  8 runtime tests in `tests/input-ref-forwarding.test.jsx` (object ref, callback ref incl. the null-on-unmount call, the `selectionStart`/`setSelectionRange` case the issue was blocked on, survival across a `clearable` clear, a source guard that `rest.ref` never comes back, and the no-ref path), plus the compile-only fixture `tests/types/input-ref.tsx` - which is the one that matches the reported symptom, since no runtime test can catch a type error. Verified the fixture actually fails against the old declaration: reverting the `.d.ts` reproduces TS2322 on all three `ref` usages. `Input.jsx:88` - fixed 2026-10-21

- [x] **[P1] Textarea styling leakage** — The `twc-textarea__el` selector uses `data-size` and `data-tone` attributes that conflict with Input CSS logic if both exist on same page. The textarea uses inline `data-*` attributes (line 68-69) but Input applies them to a wrapper `.twc-input` div (line 110). When both load, CSS specificity could cause misalignment. _Fix:_ Namespace textarea styles separately or ensure wrapper element always takes precedence. `Input.jsx:110`, `Textarea.jsx:68-69`. — ✓ fixed 2026-06-17

- [x] **[P1] Input renders invisibly under React 19 (shared style-id dedup)** — the core `.twc-input` box
  rules (border/background/focus/tone) lived inside `FIELD_CSS`, injected under the **shared** id
  `twc-field-styles` (7 field-family components). React 19 hoists `<style href precedence>` and keeps the
  **first** content per href, so when a sibling with the shorter `.twc-field*`-only `FIELD_CSS` (DatePicker,
  TimePicker, …) mounted first, Input's `.twc-input` rules were dropped and the input rendered borderless —
  most visibly the **CardGrid search** and any Datatable filter/edit input under React 19 + Tailwind's
  border reset (#234). _Fix:_ moved the `.twc-input*` rules to the **component-unique** `twc-input-extra-styles`
  block; `twc-field-styles` now carries only the identical `.twc-field*` set across all 7. Guarded by
  `tests/scoped-style-id-dedup.test.js` (no id may map to two CSS bodies). See `docs/ssr-styles.md` → Conventions.
  — ✓ fixed 2026-07-14

## Enhancements

- **[#328] `clearable` — trailing clear ✕** — opt-in `clearable` (default false) renders a trailing ✕ button,
  shown only when the field is non-empty and interactive (not `disabled`/`readOnly`). Clicking it empties the
  value and fires `onChange` with `""` for **both** controlled and uncontrolled inputs, via the native
  `HTMLInputElement.prototype.value` setter + a dispatched `input` event (so React's synthetic `onChange` runs),
  then refocuses. `onMouseDown` is prevented so focus doesn't blur first. The ✕ sits **before** `rightIcon` /
  the password reveal eye, so all three coexist. Length tracking for the show/hide test broadens the counter's
  handler guard to `(showCount || clearable)`. An internal `useCallback` ref-merge keeps a consumer-supplied
  `ref` intact (React 19 ref-as-prop) instead of clobbering it. 5 tests in `tests/input-clearable.test.jsx`.
  — added 2026-08-04

- [x] **[#462] the readonly placeholder is 4.34:1, and readonly gets NO SC 1.4.3 exemption** - `[data-readonly]` fills with `--color-surface-sunken` while the placeholder stays `--color-text-subtle`. The classification is the whole point: the sibling `:disabled` rule IS exempt (inactive control) and additionally dims the wrapper, but a readonly field is operable, focusable and copyable - and the readonly rules deliberately apply no opacity, which is exactly why the ratio lands on the failing value. An empty readonly field showing its placeholder is the reachable case. The placeholder is now scoped to `--color-text-muted` on the readonly fill. The affix beside it carries icons, so it clears its own 3:1 floor and stays. `Input.jsx:54` - fixed 2026-10-07

- [x] **[#489] 15 of 17 forwardRef components were not tree-shakeable, and 14 stray `displayName` assignments cost far more** - a function DECLARATION is dropped unconditionally when unused; `export const X = React.forwardRef(...)` is a module-scope CALL, which no bundler may assume is side-effect-free. The repo already knew this (the NOTE at `ImageViewer.jsx:215`, from the #414 regression) but only ImageViewer acted on it. Annotating the other 15 helped; auditing for the sibling hazard the same NOTE describes found 14 components still assigning `displayName` at module scope, which pins them just as effectively and turned out to dominate. Measured with the repo's own `size-limit`: Button-only **11.01 -> 9.55 -> 3.40 kB**, Card-only **9.42 -> 7.98 -> 2.72 kB** brotli (annotations, then displayName). Nothing depends on those assignments - React DevTools names a `forwardRef` from `render.displayName || render.name`, and every inner render function is named, which the ImageViewer NOTE already asserted and is now verified. The tree-shaken budgets were then tightened from 13/11 kB to 4.5/3.6 kB, because a 13 kB budget against a 3.4 kB actual is why #488's 1.16 kB regression sailed through CI. Guarded by `tests/forwardref-pure-annotation.test.js`, which also checks the annotation survives into both built bundles. - fixed 2026-10-21

- [x] **[#490] nine components gained a declared ref; the implicit-forwarding gap is documented rather than hidden** - on React 19 `ref` is an ordinary prop, so any plain function component spreading `{...rest}` onto a host element forwards one implicitly, while React 18 forwards nothing and the type denies it on both. 63 components were in that state. Converted the nine with a realistic imperative use case - `Button`, `IconButton`, `Select`, `Checkbox`, `Switch`, `Radio`, `Combobox`, `MultiSelect`, and `Code` (whose missing declaration was an oversight: it takes `as?: PolymorphicAs` but was never declared `PolymorphicComponent`). The other ~54 are deliberately left: each is a permanent public-API addition and most have no reason to expose their DOM node. Five of the nine already kept an internal ref on the very element that receives `{...rest}`, so `components/_ref.js` (`useMergedRef`) was added rather than writing the merge five more times - it also carries the React 19 cleanup-callback handling from the #488 review, which is the part that is easy to get wrong by hand. `tests/ref-contract.test.jsx` is the agreement check that would have caught #488: it renders each one with a ref, asserts the element it lands on, asserts it is a real `forwardRef` object rather than React 19's pass-through, and cross-checks the `.d.ts`. Compile-time half in `tests/types/targeted-refs.tsx`. - fixed 2026-10-21

## Verified OK

- Controlled/uncontrolled input works with value/defaultValue/onChange
- Password type gets built-in reveal/hide toggle (lines 86-101)
- rightIcon replaces password toggle when provided (lines 87-90)
- Required asterisk renders when required=true (line 107)
- Error state tints border danger + shows error message (lines 119-120, 125)
- Hint text shows when no error (line 125)
- All tones apply to focus ring and border accent (lines 26-31)
- Size variants (sm/md/lg) scale height and padding correctly
- aria-required, aria-invalid, aria-describedby wired properly (lines 118-120)
- Label conditionally rendered with correct htmlFor (lines 105-109)
- Focus ring visible on input element (line 53)
- Disabled state reduces opacity and prevents pointer events
- Password reveal button has proper aria-label and aria-pressed (lines 92)
- SSR-safe: window checks via useInsertionEffect
- RTL-safe: uses padding-inline and gap for spacing
