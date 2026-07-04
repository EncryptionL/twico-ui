# The tone × variant system

How color and fill are applied **consistently** across Twico UI components, and how to extend it.
This is the contract behind the library-wide "every component can take a color and a fill" pass.

> **Material UI parity.** This mirrors MUI's `color` (primary/secondary/error/…) + `variant`
> (text/outlined/contained, filled/outlined, …) model. Twico's `color` axis is named **`tone`**
> and draws from the design system's six intents. See [[colors.md]] for the underlying tokens and
> the standing "cross-reference Material UI" guidance.

## 1. Two orthogonal axes

| Axis | Prop | Meaning | Vocabulary |
| --- | --- | --- | --- |
| **Color** | `tone` | *which* semantic color | `primary · success · warning · danger · info · neutral` |
| **Fill** | `variant` | *how* the color is applied | depends on the component (e.g. `solid · soft · outline · ghost`) |

The six tones map 1:1 to the semantic token families: `primary`→`--color-primary*`,
`success`→`--color-success*`, `warning`→`--color-warning*`, `danger`→`--color-danger*`,
`info`→`--color-info*`, and `neutral`→ the slate/text tokens. There is no `secondary`
(Twico has no secondary brand token); use `neutral` for a low-emphasis action.

## 2. The `--_accent` implementation pattern

Every tone-aware component resolves its tone to a private set of CSS custom properties, then styles
its accent surfaces through those vars — so adding a tone is "define the vars once," not "edit every
rule." This is the model in `Button.jsx`, and now everywhere:

```css
/* default = primary; one rule per non-default tone re-points the accent set */
.twc-x { --_accent: var(--color-primary); --_accent-fg: var(--color-primary-fg);
  --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg);
  --_accent-border: var(--color-primary-border); }
.twc-x[data-tone="success"] { --_accent: var(--color-success); /* …success tokens… */ }
/* …warning, danger, info, neutral… */
```

- The component carries **`data-tone={tone}`** (and `data-variant`) on its root; variants/states are
  `data-*` attributes, never class toggles (house style).
- **`tone="primary"` (or each component's documented default) reproduces the pre-existing look** —
  the default rule just points `--_accent` at the same tokens the component already hardcoded. Every
  tone addition in this library has been **additive / non-breaking**.
- `neutral` maps accent→`--color-text`, accent-fg→`--color-surface`, subtle→`--color-surface-sunken`,
  subtle-fg→`--color-text-muted`, border→`--color-border-strong`.
- **Fields** add a `--_ring` var alongside `--_accent` (focus glow). Default `--_ring` is `var(--ring)`
  (primary); other tones build the ring from the accent via `color-mix(... 32%)`, mirroring the
  existing invalid-state ring. The error/invalid state always wins over tone (higher specificity).

## 3. What got which axis

**Already had `tone`:** Button, IconButton, Badge, Progress, Timeline.

**Gained `tone` (color intents) in this pass:**
- *Selection controls* — Checkbox, Radio, Switch, Slider (the checked/filled accent).
- *Navigation* — Tabs (active indicator + label), Stepper (active/complete marker + connector).
- *Field family* — Input, Textarea, Select, Combobox, MultiSelect, Currency, CurrencyField,
  DatePicker, DateRangePicker, FileUpload, ColorPicker (the focus/open border + ring).
- *Other* — Rating (filled-star color; default `warning`/gold, freeform `color` still overrides).

**Gained / kept a `variant` axis:**
- Tag — new `variant` `soft · solid · outline` (+ `tone`); default `soft`/`neutral` reproduces the old chip.
- Alert — new `variant` `soft · solid · outline`; default `soft` reproduces the old tinted banner.

**Tone vocabularies normalized to the full six intents:** Alert (added `primary`/`neutral`),
Text (added `success`/`warning`/`info`/`neutral` alongside its text-role tones), Spinner (added
`success`/`warning`/`danger`/`info`). Text's colored intents use the readable `-subtle-fg` tokens
where the base hue is too light for text contrast.

**Intentionally NOT given a color/variant axis** (no meaningful concept; MUI doesn't either): layout
primitives (Box, Stack, Grid, Container, Divider), surfaces/overlays (Card, Dialog, Drawer, Menu,
Popover, Tooltip, CommandPalette), and structural/display components (Table, Datatable, List, Navbar,
Sidebar, Breadcrumb, TreeView, Heading, Code, Avatar, Stat, Carousel, Chart, Kanban, Pagination,
Skeleton, EmptyState). The per-item `danger` boolean on Menu items / Datatable actions is a separate
"this item is destructive" flag, not a component color axis.

## 3a. Exported tone types

The tone unions are exported from the package root so consumers name them instead of re-deriving, and
every component's `.d.ts` references one (source: `components/_types.d.ts`):

| Type | Members | Used by |
| --- | --- | --- |
| `Tone` | `primary · success · warning · danger · info · neutral` | Badge, Tag, Alert + the field/selection/nav controls (Checkbox, Radio, Switch, Slider, Input, Textarea, Select, Combobox, MultiSelect, Currency, CurrencyField, DatePicker, DateRangePicker, FileUpload, ColorPicker, Rating, Tabs, Stepper) |
| `ActionTone` | `primary · danger` | Button, IconButton |
| `TextTone` | `default · muted · subtle` + `Tone` | Text |
| `ToastTone` | `default · neutral · success · warning · danger · info` | Toast, ToastProvider |
| `BarTone` | `Tone` minus `neutral` | Progress, Timeline |

`Spinner.color` / `.tone` are `"current" | Tone | "white"`. These are a **non-breaking naming pass**:
each alias resolves to the exact members already accepted, so no consumer breaks. Unifying
`default`↔`neutral` or adding a neutral bar state is a separate design decision, deliberately not done here.

## 4. Adding tone to a new component

1. Inject the `--_accent` block (default = the tone you want to reproduce the current look) into the
   component's scoped CSS; for fields also add `--_ring`.
2. Swap the hardcoded `--color-primary*` accent refs to `var(--_accent*)`. Leave non-accent primary
   usage and invalid/error rules alone.
3. Add `tone = "primary"` to the props and `data-tone={tone}` to the root element.
4. Update `<Name>.d.ts` (`@default`), `<Name>.prompt.md`, the docs-site `components.js` props row, and
   ideally a "Tones" entry in `<Name>Variations.jsx`.
5. `npm run build && npm run typecheck`; verify `tone="primary"` is pixel-identical to before.
