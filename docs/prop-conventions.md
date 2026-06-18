# Prop conventions

The standard prop vocabulary across Twico UI. New or changed components MUST follow it so the
API is predictable — same concept, same prop name, same value set, everywhere. (Audited and
standardized 2026-06-18; this doc is the source of truth.)

## Sizing — `size`
- Canonical scale: **`"sm" | "md" | "lg"`**, default **`"md"`**. Every sized control supports all three.
- Extra steps are allowed **only where domain-justified**, and only as a superset of the canonical
  three: Avatar/IconButton add `"xs"`; Avatar/Spinner add `"xl"`; Dialog/Container add `"full"`.
- Typography (`Heading`/`Text`) uses a font-size scale (`xs|sm|base|lg|xl|…`), not the control scale —
  that's a different axis and is named `size` intentionally.

## Color — `tone` (and rarely `color`)
- **`tone`** is the color/intent axis: `"primary" | "success" | "warning" | "danger" | "info" | "neutral"`,
  default `"primary"` (Alert defaults `"info"`, Tag `"neutral"`, Rating `"warning"`). A component
  documents the subset it supports; it never invents new tone names. See [tone-variant-system.md](./tone-variant-system.md).
- **`color`** (freeform string) appears only where an *arbitrary* color is the point and overrides the
  tone: `Rating.color`, `Kanban` column color. `Spinner.color` is the enum form of its tone (`tone` is
  the deprecated alias there). Do not add freeform `color` to new components — use `tone`.

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

## Collections — `items` (and conventional domain names)
- The generic collection prop is **`items`** (Accordion, Tabs, List, Menu, Timeline, Sidebar, Breadcrumb,
  TreeView). Each types its own item shape.
- Conventional domain names are kept where they read better: `options` (Select/Combobox/MultiSelect),
  `rows` + `columns` (Table/Datatable), `steps` (Stepper), `commands` (CommandPalette), `links` (Navbar).

## Overlays — `open` + close handler, `placement`/`side`
- Disclosure overlays (Menu, Popover) are controllable: **`open` + `onOpenChange`**.
- Modal overlays (Dialog, Drawer, CommandPalette) take **`open` + `onClose`**.
- Positioning: `placement` (Popover/Select) / `side` (Drawer) / `align` (Menu/Popover). Edge/alignment
  values are **logical** (`start`/`center`/`end`) so they mirror under `dir="rtl"`; physical names
  (`left`/`right`/`top`/`bottom`) are used only where the prop *deliberately* names a physical edge
  (Drawer `side`), with logical `start`/`end` offered alongside.

## Field props
- **`label`** is a visible field label → `React.ReactNode`. An **accessible name** (rendered into
  `aria-label`) is a `string` (`Spinner.label`, `Datatable.label`) — different concept, different type.
- `hint` and `error` are `React.ReactNode`; `required`, `disabled` are `boolean`; `placeholder` is a string.

## Passthrough & polymorphism
- All components spread `...rest` to their root and accept `className` + `style`. Inline `style` and
  `className` never override component-controlled `data-*`/`aria-*` (those are placed after the spread).
- Polymorphic components take **`as`** (`Box`, `Stack`, `Container`, `Grid`, `Text`, `Heading`, `Code`);
  `Button.as` is restricted to `"button" | "a"` because only those two are supported.

## Events
- Handlers are `onX` camelCase. The common ones: `onChange`, `onClick`, `onClose`, `onOpenChange`,
  `onFocus`, `onKeyDown`. Domain callbacks follow the same shape (`onRowClick`, `onCardMove`, `onStepClick`, …).
