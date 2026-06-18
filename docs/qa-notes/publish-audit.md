# QA notes — Pre-publish component audit (2026-06-18)

A full pre-publish audit of all **61 components + 23 hooks**, run as a multi-agent workflow
(285 agents) where every finding was **adversarially verified** (an independent agent re-read the
code and tried to refute it) before being counted. **161 findings confirmed**: 16 major, 114 minor,
31 nit. This note tracks remediation. Companion: [examples-audit.md](examples-audit.md) (the
copy-paste Usage-snippet audit) and the per-component `*.md` notes in this folder.

## Major findings — all fixed ✅

### Functional / RTL bugs
- [x] **Divider** — `align` never worked: `Divider.jsx:35` mapped `start→"left"`/`end→"right"` but the
  CSS only targets `data-align="start"/"end"`. Inverted the mapping so physical aliases canonicalize
  to the logical values the CSS expects. `Divider.jsx:34-35`
- [x] **Slider** — pointer-move/up listeners were only removed on pointerup, so unmounting mid-drag
  leaked window listeners and `fromClientX` then dereferenced a null `trackRef` (crash). Added an
  unmount cleanup that detaches in-flight listeners, plus a null-ref guard. `Slider.jsx:90-119`
- [x] **CurrencyField** — switching currency re-clamped the displayed amount but never called
  `onValueChange`, desyncing a controlled value/formatted string from the display. Now notifies after
  re-clamp. `CurrencyField.jsx:94-101`
- [x] **Switch** — thumb didn't mirror under `dir="rtl"` (physical `left:` + positive `translateX`).
  Switched to `inset-inline-start` + a direction-aware `--_tx` (1 / -1 under RTL). `Switch.jsx`
- [x] **Carousel** — off-screen slides kept focusable content in the tab order, and autoplay only
  paused on mouse hover. Added `inert` to inactive slides and `onFocusCapture/onBlurCapture` pause so
  keyboard users can stop auto-advance. `Carousel.jsx:74-81`
- [x] **useCopyToClipboard** — reported success (`copied=true`, returns `true`) even when the Clipboard
  API was unavailable (SSR/insecure context). Now fails fast and returns `false`. `hooks/index.js:246-261`

### Accessibility
- [x] **Select** — a searchable Select moved focus into its search input on open but never returned it
  to the trigger on close (dropped to `<body>`). Added focus-return guarded to only fire when focus is
  still inside the closing popover. `Select.jsx:191-201`
- [x] **ColorPicker** — the `role="dialog"` popover (portaled to `<body>`) never received focus on open,
  so keyboard users couldn't reach the sliders. Added focus-in-on-open + focus-return-on-close. `ColorPicker.jsx:164-178`
- [x] **DatePicker** — same portal focus issue; added focus-in (first tabbable day) + focus-return. `DatePicker.jsx`
- [x] **DateRangePicker** — calendar day buttons had no accessible name beyond the bare number. Added
  a full `aria-label` (weekday/month/day/year) + `aria-pressed` on range edges. `DateRangePicker.jsx:240-246`
- [x] **Table** — sortable header was mouse-only with no sort state for AT. Made the header label a real
  `<button>` (keyboard-operable) and added `aria-sort` to the `<th>`. `Table.jsx:98-112`

### Docs / examples
- [x] **Button** — summary/tagline claimed "five variants…danger variant…three sizes". Reality: 4
  variants (solid/soft/outline/ghost), `danger` is a **tone**, 4 sizes (xs/sm/md/lg). Corrected.
- [x] **Example snippets** — see [examples-audit.md](examples-audit.md). All 16 non-runnable Usage
  snippets fixed: missing imports/state (via `CodeBlock.buildImports` + data fixes), invalid props
  (Dialog `variant="danger"`→`tone`), undefined data (Breadcrumb `longTrail`, Table `users`), broken
  a11y demo (Field `aria-describedby="<id>-desc"`), and bring-your-own placeholders converted to
  inline SVG icons / inline handlers so every example now runs as pasted.

## Minor bugs — batch fixed ✅

Surgical fixes from the minor tail (each was adversarially verified in the audit):
- [x] **Avatar** — `errored` image state was never reset on `src` change, so a valid new src after a
  failure showed initials forever. Added `key={cleanSrc}` to the `<img>` so a new src remounts and
  re-attempts load. `Avatar.jsx:80`
- [x] **AvatarMenu** — the trigger span had its own Enter/Space `onKeyDown` that double-fired (the
  parent Menu already handles trigger keyboard input), causing duplicate `onOpenChange`. Removed it. `AvatarMenu.jsx`
- [x] **Breadcrumb** — `maxItems={1}` dropped the current page (`maxItems - 1 === 0` → empty tail).
  Clamped the kept tail to ≥1 (`keepTail = Math.max(1, maxItems - 1)`). `Breadcrumb.jsx:48-52`
- [x] **DatePicker** — arrowing toward a disabled (out-of-range) day called `.focus()` on a disabled
  button (no-op), trapping focus. Now keeps stepping in the same direction past out-of-range days
  (capped at 366 iterations); if none is reachable, focus doesn't move. `DatePicker.jsx:238-261`
- [x] **IconButton** — `soft` variant hover set the same background as resting (no feedback). Added a
  `filter: brightness(0.97)` hover plus a `.dark … brightness(1.25)` rule, mirroring Button. `IconButton.jsx:45-46`
- [x] **Menu** — wide content broke align/clamp math (only `minWidth` was set) and a long menu
  overflowed the viewport. Added `width: pos.width`, a computed `maxHeight` from the available vertical
  space, and `overflow-y: auto` on `.twc-menu`. `Menu.jsx`
- [x] **Progress** — `value={NaN}` propagated to `aria-valuenow`/width. Coerce non-finite to 0 before
  the percentage. `Progress.jsx:53`
- [x] **Select** — pressing Tab while open left the dropdown open. Added a Tab branch that closes it
  without `preventDefault` so focus still moves on. `Select.jsx:216`
- [x] **Slider** — tick `left` was NaN with a single tick (`ticks - 1 === 0`). Guarded the divisor. `Slider.jsx:153`
- [x] **Stat** — a negative *number* delta (e.g. `-3.2`) was inferred "up" because the minus check was
  gated on `typeof delta === "string"`. Now stringifies before the minus check. `Stat.jsx:48`
- [x] **Tag** — the remove button's `onClick` didn't `stopPropagation`, so clicking × also fired the
  Tag root `onClick`. Added `stopPropagation` (still passes the event to `onRemove`). `Tag.jsx:63`
- [x] **ToastProvider** — over-limit toasts were pushed to state but never mounted (sliced at render),
  so they never auto-dismissed and could resurrect. Now capped at push time via a stable `limitRef`. `ToastProvider.jsx`
- [x] **Tooltip** — the open-delay `setTimeout` was never cleared on unmount. Added a mount-scoped
  cleanup effect. `Tooltip.jsx:52`
- [x] **useClickOutside** — re-attached listeners every render because the default `events` array is a
  new identity. Changed the dep to `events.join(",")`. `hooks/index.js`
- [x] **useEventListener** — re-bound when `options` was an inline object/boolean. Destructured to
  primitive deps (`capture`/`passive`/`once`), behavior unchanged. `hooks/index.js`
- [x] **useScrollLock** — no ref-count, so nested locks (Dialog over Drawer) clobbered the saved
  overflow. Added a module-level counter + single saved value: first lock saves+sets, last restores. `hooks/index.js`
- [x] **Datatable (docs)** — documented the server-mode caveat on `batchActions`/`onBatchUpdate`: the
  resolved `selectedRows`/`changedRows` argument holds only the loaded page's rows, so handlers should
  use `selectedKeys` (+ server-side re-fetch) for cross-page selections. `Datatable.d.ts`, `Datatable.prompt.md`

## Type-contract (`.d.ts`) gaps — fixed ✅

- [x] **`as="a"` + `href` untyped** — Box, Stack, Container, Grid, Heading, Text, Code all run
  `safeHref` for `as="a"` at runtime but extended only `HTMLAttributes`, so `href`/`target`/`rel`
  were type errors for TS consumers. Added `href?: string`, `target?`, `rel?` (with the
  scheme-sanitization note) to all seven `.d.ts`. Verified with `npm run check:exports`.

## Remaining: lower-risk tail — next iteration

All consumer-impacting code is fixed (bugs, a11y, RTL mirroring, runnable examples, anchor contract).
What's left is documentation-accuracy and minor typing polish, none of which affects runtime behavior:
- **Doc accuracy (largest):** the systemic "root element" propsRows wording — for many input
  components `id`/`style`/`...rest` land on the inner control, not the root. This is generated by
  `site/scripts/enrich-props.mjs` from each `.d.ts` root element, so the correct fix is per-component
  generator metadata (not a hand edit). Plus the changelog-as-description propsRows strings and a few
  remaining count claims (Alert tones, Badge sizes).
- **Minor typing:** size unions; Kanban `cards` required-ness; Combobox/Select `null` in `onChange`;
  ToastProvider `viewportProps`; Tooltip handler overrides; Drawer `start`/`end`.
- **RTL polish:** Kanban/Sidebar chevron mirroring; DateRangePicker corner radii. (Box `px/mx`/`pl/pr`
  are intentionally physical, matching the Tailwind/Chakra `pl`-is-left convention — left as-is.)
- **Minor bug:** `useColorScheme` SSR initial-value nuance.

## Verification (all green)

- Library: `npm run build`, `typecheck`, `check:exports`, `build:css:check` all exit 0; **96/96 vitest pass**.
- Docs site: `npm run build` clean; `enrich-props --check` no drift.
- Snippet type-check (faithful to the docs' `buildImports` import derivation): **60/61 snippets compile**
  against the real types (the 1 is the documented Datatable TS-widening nit; the JS example runs).
- Behavioral gates on the final build: **render-check 69/69, interaction-sweep ✓, behavior-check 34/34**.
