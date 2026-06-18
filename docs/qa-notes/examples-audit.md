# QA notes — Example / Usage-snippet audit (pre-publish)

- **Scope:** the copy-paste **Usage `snippet`** shown on every component page (`site/src/data/components.js`) — "can a consumer actually run this code?"
- **Reviewed:** 2026-06-18
- **Method:** mechanical. Every snippet is extracted and emitted as a `.tsx` file, reproducing the **exact import derivation** the docs site applies in its expanded/copied view (`CodeBlock.jsx` → `buildImports`), then compiled with `tsc --noEmit` against the **real** library types (`twico-ui` aliased to `src/index.ts`). A snippet that references a missing import, a non-existent prop, or a wrong type fails the compile. Result: **60/61 snippets type-check clean**; the remainder are intentional placeholders + one minor TS nit (below).
- **Status:** fixed.

## Root-cause bug (systemic) — fixed

`CodeBlock.jsx` only added the React import when a snippet had **no imports at all**. Every stateful
snippet ships its own `import { X } from "twico-ui"` line, so `hasImports` was true and the
React/hooks import was **never** added — the expanded/copied code threw `useState is not defined`
(or `React is not defined` for the `React.useState` snippets: ColorPicker, FileUpload, Rating,
Slider). Fixed by rewriting the derivation (`buildImports`):

- adds a React import whenever the body uses `React.*` (default import) or bare hooks (named
  import), unless the body already imports from `"react"`;
- **merges** every used Twico export into the snippet's existing `twico-ui` import line (so a
  partial import — e.g. only `Card` while the body also renders `<Button/>` — is completed),
  instead of only adding a fresh line when none existed.

This single fix makes ~13 stateful/compositional snippets runnable. `CodeBlock.jsx:20-55`.

## Per-snippet content bugs — fixed (`site/src/data/components.js`)

- [x] **Dialog** — `<Button variant="danger">` is invalid (`danger` is a **tone**, not a variant
  `solid|soft|outline|ghost`). Changed to `tone="danger"`. Also added the missing
  `const [open, setOpen] = useState(false)` state, a trigger button, and replaced the undefined
  `confirm` handler so the example is self-contained.
- [x] **Combobox** — referenced `country` / `setCountry` that were never declared (the state line
  had been dropped from the snippet, though `Combobox.prompt.md` had it). Restored
  `const [country, setCountry] = useState(null)`.
- [x] **Table** — `rows={users}` with `users` undefined. Added an inline `const users = [...]` whose
  fields match the columns (name/role/status/mrr + a stable `id` for `rowKey`).
- [x] **Currency** — `onValueChange={(n) => setPrice(n)}` with `setPrice` undefined. Made it a
  controlled example (`const [price, setPrice] = useState(0)`, `value={price}`, `onValueChange={setPrice}`).
- [x] **Stepper** — second example used `steps={steps}` / `onStepClick={setActive}` (both undefined).
  Made it controlled with `useState` and inlined its `steps`.
- [x] **Card / Stack** — rendered `<Button>` without importing it; now auto-completed by the
  `buildImports` merge above (no data edit needed).

## Accepted as-is (conventional, not bugs)

- **Bring-your-own placeholders**: snippets that reference the consumer's own icon component
  (`<PlusIcon/>`, `<SearchIcon/>`, …) or handler (`save`, `signOut`, `dismiss`, …). This is the
  standard component-docs convention (cf. MUI's `<DeleteIcon/>`); the snippet's *own* state/data is
  now always complete, so only clearly-external things are placeholders.
- **Datatable (TS only, minor):** `pinned: "left"` widens to `string` when `columns` is extracted to
  a separate `const`, so a strict-TS copy needs an annotation (`const columns: DatatableColumn[]`).
  The JS example (the default) runs as-is, and the live demo compiles. Left as a documented nit
  because the snippet is shared verbatim between the JS and TS toggles.

## How to re-run

The checker is not committed (it lives outside the repo during the audit). To reproduce: extract each
`components.js` `snippet`, prepend the imports `buildImports` would derive, wrap bare-JSX bodies in a
fragment, and run `tsc --noEmit` with `paths: { "twico-ui": ["src/index.ts"] }`. See this file's
method note. A permanent CI version is a candidate follow-up (see `docs/docs-site.md`).
