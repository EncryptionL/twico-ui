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

Each tone family gained a **`-graphic`** member in #455 — `--color-primary-graphic` and friends — for a
fill or stroke that IS the information (a Progress bar, a Toast edge stripe, an Avatar status dot).
Those owe 3:1 under SC 1.4.11 and the plain light-mode tones missed it, so they are the same hue at a
step that clears it; use the plain tone for a fill that carries `--color-*-fg` text on top. Note the
family is incomplete by design: there is no `--color-neutral-graphic`, because `neutral` maps to the
slate/text tokens rather than to a `--color-neutral*` family. The two **control** tokens
(`--color-control-border`, `--color-control-track`, plus the static `--color-control-thumb`) sit
outside the tone system entirely — an unchecked control has no tone. See `docs/colors.md`.

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
| `Tone` | `primary · success · warning · danger · info · neutral` | **Button, IconButton (#504)**, Badge, Tag, Alert + the field/selection/nav controls (Checkbox, Radio, Switch, Slider, Input, Textarea, Select, Combobox, MultiSelect, Currency, CurrencyField, DatePicker, DateRangePicker, FileUpload, ColorPicker, Rating, Tabs, Stepper) |
| `ActionTone` | `primary · danger` | *(no component — a convenience alias since #504)* |
| `TextTone` | `default · muted · subtle` + `Tone` | Text |
| `ToastTone` | `default · neutral · success · warning · danger · info` | Toast, ToastProvider |
| `BarTone` | `Tone` minus `neutral` | Progress, Timeline |

`Spinner.color` / `.tone` are `"current" | Tone | "white"`. These are a **non-breaking naming pass**:
each alias resolves to the exact members already accepted, so no consumer breaks. Unifying
`default`↔`neutral` or adding a neutral bar state is a separate design decision, deliberately not done here.

### 3b. Why `ActionTone` stopped being a ceiling (#504)

Button and IconButton accepted only `primary | danger` until #504. The case that broke it: a
row-level confirm sitting beside a `danger` sibling, reading as "yes / no". Semantically the yes is
a **success** action, but it came out the same blue as every neutral action on the page — exactly
the distinction the colour was carrying. `Text`, `Badge` and `Tag` all took the full scale, so the
only workarounds were to drop the button affordance or drop the colour.

`ActionTone` is still exported and still names the two intents most actions want. It is no longer
the type of any component prop.

**The step rule is "move away from the ink", not "light darker, dark lighter".** `primary` and
`danger` carry white ink, so their hover darkens in light mode. `warning` and `info` carry **dark**
ink (`--color-warning-fg` is `amber-950`, `--color-info-fg` is `sky-950`), so darkening moves the
background *towards* the ink and cuts contrast — the first cut of #504 did exactly that and put
light `info` `solid:active` at **2.34:1**. Their light-mode steps go *lighter* instead.

`neutral` has no accent ramp anywhere — there is no `--color-neutral`. It follows Badge's existing
mapping: `--color-text` on `--color-surface` for `solid`, `--color-surface-sunken` with
`--color-text-muted` for `soft`, and a `color-mix` hover since there is no `--color-text-hover` to
point at. `variant="ghost"` and `variant="outline"` already express a quiet action, so those remain
the first thing to reach for.

### 3c. The plain tones now clear their own ink (#505)

Measuring #504's new pairs surfaced six that had been failing all along — not introduced by it, and
shipping through every solid Badge and Tag:

| pair | was | now |
| --- | --- | --- |
| light `primary` solid | 4.47:1 | **6.29:1** |
| light `success` solid | 3.77:1 | **5.48:1** |
| light `danger` solid | 3.67:1 | **4.70:1** |
| dark `primary` solid / hover / active | 4.47 / 2.98 / 1.99:1 | **5.36 / 8.02 / 10.72:1** |

They were breaking the rule stated two sections up — the plain tone is the one designated for *fills
that carry text on top* — so this was a broken contract rather than a trade-off.

**Light** needed the fill one step darker, same hue, because the ink is white: `primary`
`brand-500`→`brand-600`, `success` `emerald-600`→`emerald-700`, `danger` `rose-500`→`rose-600`.

**Dark `primary` needed the opposite.** It was the only tone in that theme still carrying white ink —
`success`, `warning`, `danger` and `info` all use dark ink on a bright fill — and its steps went
*lighter*, towards the ink, which is where 1.99:1 came from. Darkening it would have cleared the text
bar and failed a different one: `brand-600` is only **2.84:1** against the slate-900 page, below the
3:1 a fill needs to be distinguishable at all, and worse than the 4.00 it had. Joining the existing
dark-ink pattern clears both — **5.36** text, **5.98** fill.

Every tone × variant pair in both themes now clears 4.5:1, worst case **4.58:1**, enforced by
`tests/tone-accent-contrast.test.js`. Its `KNOWN_PREEXISTING` allow-list is deliberately empty, and a
companion test fails if an entry is added that no longer corresponds to a real failure.

One knock-on: `tests/tokens-a11y.test.js` used to assert `--color-primary` does **not** clear AA as
text, as the evidence for the fill-only rule. That is now false in both themes. The convention stands
— `--color-primary-subtle-fg` is still the text token — but it is a style choice now, not an
accessibility necessity, and the test records the new measurement instead.

## 4. Adding tone to a new component

1. Inject the `--_accent` block (default = the tone you want to reproduce the current look) into the
   component's scoped CSS; for fields also add `--_ring`.
2. Swap the hardcoded `--color-primary*` accent refs to `var(--_accent*)`. Leave non-accent primary
   usage and invalid/error rules alone.
3. Add `tone = "primary"` to the props and `data-tone={tone}` to the root element.
4. Update `<Name>.d.ts` (`@default`), `<Name>.prompt.md`, the docs-site `components.js` props row, and
   ideally a "Tones" entry in `<Name>Variations.jsx`.
5. `npm run build && npm run typecheck`; verify `tone="primary"` is pixel-identical to before.
