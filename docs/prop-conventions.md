# Prop conventions

The standard prop vocabulary across Twico UI. New or changed components MUST follow it so the
API is predictable — same concept, same prop name, same value set, everywhere. (Audited and
standardized 2026-06-18; this doc is the source of truth.)

## Sizing — `size`
- Canonical scale: **`"sm" | "md" | "lg"`**, default **`"md"`**. Every sized control supports all three
  — the former gaps `Slider`/`ColorPicker`/`FileUpload` (#220) and `DatePicker`/`DateRangePicker` (#201)
  now map `size` to their control height (`--control-h-*`; Slider scales track/rail/thumb, FileUpload the
  dropzone padding). `md` reproduces the previous fixed rendering exactly.
- Extra steps are allowed **only where domain-justified**, and only as a superset of the canonical
  three: Avatar/IconButton add `"xs"`; Avatar/Spinner add `"xl"`; Dialog/Container add `"full"`.
- Typography (`Heading`/`Text`) uses a font-size scale (`xs|sm|base|lg|xl|…`), not the control scale —
  that's a different axis and is named `size` intentionally.

## Color — `tone` (and rarely `color`)
- **`tone`** is the color/intent axis: the canonical exported **`Tone`** union
  (`"primary" | "success" | "warning" | "danger" | "info" | "neutral"`), default `"primary"` (Alert
  defaults `"info"`, Tag `"neutral"`, Rating `"warning"`). A component documents the subset it
  supports; it never invents new tone names. See [tone-variant-system.md](./tone-variant-system.md).
- **Reuse the exported tone types, don't re-derive them.** The package exports `Tone`, plus the
  purpose-built subsets `ActionTone` (Button/IconButton — brand/danger), `TextTone` (Text — roles +
  full scale), `ToastTone` (Toast), and `BarTone` (Progress/Timeline — scale minus `neutral`). Every
  component's `.d.ts` references one of these rather than inlining a literal union.
- **`color`** (freeform string) appears only where an *arbitrary* color is the point and overrides the
  tone: `Rating.color`, `Kanban` column color. `Spinner` uses `tone` like every other tone-driven
  control (`Spinner.color` is a **deprecated alias**, removed in 2.0). Do not add freeform `color` to
  new components — use `tone`.

## Fill — `variant`
- The visual-fill axis, orthogonal to `tone`. Vocabulary by component family: buttons
  `solid | soft | outline | ghost`; Badge/Tag/Alert `solid | soft | outline`; Card `elevated | outline | soft`;
  Tabs `line | pill`; Skeleton `text | circle | rect`. Default reproduces the prior single look.

## Controlled state — `value` / `defaultValue` / `onChange`
- Stateful controls take **`value`** (controlled) + **`defaultValue`** (uncontrolled) + **`onChange`**.
  Each types its own value (`string`, `number`, `Date | null`, `string[]`, `File[]`, …) — that's expected,
  not an inconsistency.
- **Composite controls** (Select, Combobox, MultiSelect, Slider, Rating, pickers) call
  `onChange(value)`. **Native-input wrappers** (Input, Textarea, Currency) call `onChange(event)` to
  preserve the native event, and may add a parsed callback (`Currency.onValueChange(value, formatted)`).
- **Every stateful control pairs controlled + uncontrolled** — the same `X` / `defaultX` split applies
  beyond `value`, using each control's domain prop name: Accordion `open`/`defaultOpen`, Tabs
  `value`/`defaultValue`, Stepper `active`/`defaultActive`, Carousel `index`/`defaultIndex`, Pagination
  `page`/`defaultPage`, Sidebar `collapsed`/`defaultCollapsed`, TreeView `expanded`/`defaultExpanded`
  **and** `selectedId`/`defaultSelectedId`, Menu/Popover `open`/`defaultOpen`. Native-input wrappers
  (Input/Textarea/Checkbox/Radio/Switch/Currency) inherit `value`/`defaultValue` (or
  `checked`/`defaultChecked`) from the DOM element. **Modal overlays** (Dialog, Drawer, CommandPalette)
  are controlled-only (`open` + `onClose`) by design; **Tooltip** is hover-driven (no `open` prop).

## Collections — `items` (and conventional domain names)
- The generic collection prop is **`items`** (Accordion, Tabs, List, Menu, Timeline, Sidebar, Breadcrumb,
  TreeView). Each types its own item shape.
- Conventional domain names are kept where they read better: `options` (Select/Combobox/MultiSelect),
  `rows` + `columns` (Table/Datatable), `steps` (Stepper), `commands` (CommandPalette), `links` (Navbar).
- Select, Combobox, and MultiSelect share one exported **`Option`** / **`OptionGroup`** type (from
  `components/inputs/options.d.ts`); the per-component names (`SelectOption`, `ComboboxOption`, …) stay
  as structural aliases, so an `Option[]` value type-checks against all three. (CurrencyField's
  `CurrencyOption` is a deliberately narrower, separate shape.)

## Overlays — `open` + close handler, `placement`/`side`
- Disclosure overlays (Menu, Popover) are controllable: **`open` + `onOpenChange`**.
- Modal overlays (Dialog, Drawer, CommandPalette) take **`open` + `onClose`**.
- Positioning: `placement` (Popover/Select) / `side` (Drawer) / `align` (Menu/Popover). Edge/alignment
  values are **logical** (`start`/`center`/`end`) so they mirror under `dir="rtl"`; physical names
  (`left`/`right`/`top`/`bottom`) are used only where the prop *deliberately* names a physical edge
  (Drawer `side`), with logical `start`/`end` offered alongside.

## Alignment — `align` / `justify`
- **`align`** → `align-items` on both `Stack` and `Grid` (consistent).
- **`justify`** diverges by necessity (#216): on **`Stack`** it's `justify-content` (main-axis
  distribution, e.g. `"space-between"`); on **`Grid`** it's `justify-items` (per-cell alignment) —
  flex has no `justify-items`, so Stack's had to be content. `Grid` also exposes `justifyContent`
  (track distribution) and `alignContent`. To make the per-cell axis explicit, **`Grid` now takes a
  `justifyItems` prop** (the canonical name; `justify` stays a backward-compatible alias, and the
  explicit prop wins when both are set). Both `.d.ts` carry a ⚠️ note about the divergence. A future
  major could repoint `Grid.justify` → `justify-content` to fully unify the name (breaking).

## Field props
- **`label`** is a visible field label → `React.ReactNode`. An **accessible name** (rendered into
  `aria-label`) is a `string` (`Spinner.label`, `Datatable.label`) — different concept, different type.
- `hint` and `error` are `React.ReactNode`; `required`, `disabled` are `boolean`; `placeholder` is a string.
- **`required` renders a `.twc-field__req` asterisk** on the visible label (and sets `aria-required` on
  the control) across *every* labeled control — including the toggles Checkbox/Radio/Switch (#219), which
  previously only set `aria-required`. No asterisk is drawn when there is no visible `label`.

## Reduced motion & AT state
- Every animated component collapses its motion under `@media (prefers-reduced-motion: reduce)` (WCAG
  2.3.3) — including Button's ripple, the Tabs indicator, Accordion panels, the Carousel track, and Toast
  slide-in (#218). A loading Spinner is the deliberate exception (its spin conveys state).
- Nav-style active indicators expose state to AT, not just visually: the Carousel's active dot now sets
  `aria-current="true"` (#217), matching Pagination/Breadcrumb/Stepper.
- Toasts announce via **persistent live regions** on `ToastProvider` — a polite + an assertive
  `aria-live` region that exist *before* any toast is pushed, into which each toast's text is mirrored
  (danger/warning → assertive, else polite) — rather than relying on the dynamically-inserted card (WCAG
  4.1.3, #209). Provider-rendered cards therefore carry `role="group"`; a standalone `<Toast>` (no
  provider) keeps its own tone-derived `alert`/`status` role.

## Passthrough & polymorphism
- All components spread `...rest` to their root and accept `className` + `style`. Inline `style` and
  `className` never override component-controlled `data-*`/`aria-*` (those are placed after the spread).
- Polymorphic components take **`as`** (`Box`, `Stack`, `Container`, `Grid`, `Text`, `Heading`, `Code`),
  typed as the exported **`PolymorphicAs`** (`React.ElementType`) so it accepts both a tag name
  (`as="section"`) and a React component (`as={Link}`), whose props flow through `{...rest}`.
  `Button.as` is restricted to `"button" | "a"` because only those two are supported.

## Deprecation policy
- A superseded prop is marked `@deprecated since <minor>, removed in <major> — use ``X``` in its
  `.d.ts`, keeps working until that major, and the canonical (non-deprecated) name always wins when
  both are set.
- In development the component calls `warnOnce` (the shared `components/_warn.js` helper) the first
  time **only** the deprecated prop is supplied — a single, deduped `console.warn` that no-ops in
  production. Current deprecations: `Spinner.color` → `tone` (#222 — realigned to the shared `tone`
  vocabulary), `EmptyState.bordered` → `border`, `Pagination.showJumper` → `showPageJumper` (all
  removed in 2.0).

## Events
- Handlers are `onX` camelCase. The common ones: `onChange`, `onClick`, `onClose`, `onOpenChange`,
  `onFocus`, `onKeyDown`. Domain callbacks follow the same shape (`onRowClick`, `onCardMove`, `onStepClick`, …).
