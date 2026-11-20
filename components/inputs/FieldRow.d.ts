import * as React from "react";

/**
 * A row of form controls aligned by their **control box** rather than their outer box, with one
 * shared footer lane beneath.
 *
 * #494's `reserveFooter` closed the field-vs-field case: a `hint` on one field in a row made that
 * field taller, so `align="flex-end"` lifted its control above its neighbours. #508 is the half that
 * fix could not reach — a **non-field control in the same row** (a `Menu` trigger, a `Button`, an
 * `IconButton`) has no footer to reserve, so it still rode up as soon as a sibling field grew one.
 * An "insert at the cursor" button beside the box it writes into, or a remove button at the end of a
 * condition row, make that shape at least as common as a row of fields alone.
 *
 * `FieldRow` owns the row instead of asking every child to opt in, so *field vs button* stops being
 * something the host has to know:
 *
 * ```jsx
 * <FieldRow>
 *   <Input label="…to this value" error={tooLong ? "28 characters; the limit is 24." : undefined} />
 *   <Menu items={items} trigger={<Button size="sm" variant="outline">Insert</Button>} />
 * </FieldRow>
 * ```
 *
 * Children need no props. Fields share the row's width (`flex: 1`) and plain controls keep their
 * natural size, which absorbs the `<Box sx={{ flex: 1 }}>` wrappers such a row would otherwise need.
 *
 * The lane is built the way #494 builds it — generated content at `--text-xs` after the same
 * `--space-1-5` gap — so it matches a real footer by construction rather than by a length that
 * drifts when a token changes, and `:has()` decides per cell at ANY depth, so a cell holding
 * something that already ends in a footer gets no extra lane.
 *
 * There is exactly ONE lane and one place it can come from: the cell. The first cut of this
 * component also set `data-reserve-footer` on the row, switching on #494's *descendant* rule,
 * while testing `:has(> .twc-field)` — a *direct-child* rule — to decide whether to draw its own.
 * The two disagreed precisely where it mattered (#519): a field behind a `Tooltip` or a host
 * `<div>` satisfied one and failed the other, so it got BOTH lanes and rode up 24px — #508 again,
 * in the other direction. The row now sets no attribute, and the lane test looks at any depth.
 *
 * Width works the same way round: every cell stretches by DEFAULT, and only a cell holding an
 * inline-level control keeps its natural size. That list is derived rather than curated — every
 * single-class `.twc-*` rule in the library declaring `display: inline-flex`, minus the three
 * overlay wrappers — and `tests/fieldrow-natural-roots.test.jsx` re-derives it and fails on drift.
 * Stretch-by-default is what makes an unknown child (a host wrapper, a third-party control, a
 * component added later) land on the right answer with no list to maintain.
 *
 * For a row the host already lays out itself, `reserveFooter` on each field still works; this is the
 * version for when the row is yours to shape. The two compose: a field opting in for itself keeps
 * its own lane and its cell draws none, and a `FieldRow` inside a `data-reserve-footer` ancestor
 * suppresses the inherited lane, so either way there is exactly one.
 *
 * `null`, `false`, `""` and `0` children are dropped rather than left as an empty cell that would
 * still draw a lane and take part in the gap. A fragment child is flattened into one cell per
 * field; a *component* returning a fragment is still one cell, since nothing sees through a render.
 */
export interface FieldRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gap between children — a spacing step (`3` → `var(--space-3)`) or any CSS length. @default 3 */
  gap?: number | string;
  /** Allow children to wrap onto more lines when the row runs out of width. @default false */
  wrap?: boolean;
  /**
   * Minimum width a stretching cell may shrink to before `wrap` breaks the line — a number is `px`,
   * a string passes through, the same semantics as `Grid`'s prop of this name. It lands on the
   * **cell**, which is the flex item, so it is not something a consumer can set from the outside
   * (#524): `minWidth` on the field is overridden by the cell's own `min-inline-size`, and a wrapper
   * div is the thing `FieldRow` exists to remove.
   *
   * Only meaningful with `wrap`. Equal widths are preserved — `flex-basis` stays `0`, so cells that
   * share a line still share it evenly. @default "10rem"
   *
   * In a wrapping row the floor also reaches the fields **inside** a fragment cell, and that cell
   * wraps within itself (#530). A *component* returning a fragment is one cell — nothing sees
   * through a render — so before this, a row whose fields all came from one shared component had a
   * single flex item, nothing to break against, and no way to ask for a floor on the fields: a
   * 520px row with `minChildWidth="15rem"` measured `[168, 168, 168]`, 72px under its own floor,
   * where the hand-laid equivalent gives `[256, 256, 520]`. It now matches the hand-laid row.
   *
   * Three things follow from the break happening *inside* the cell:
   *
   * - **The group breaks against its own share of the row, not the row's width.** Once the fragment
   *   cell has siblings this is visibly not the same as three cells: measured at 760px, a trio plus
   *   one sibling field goes from one line of `[120, 120, 120, 376]` to three stacked 376px fields.
   *   Honouring the floor is the point — 120px was already half of it — but it is a reflow.
   * - **A fragment cell that also holds a plain control is deliberately untouched**, because such a
   *   cell hugs its content instead of filling the row, and a floor inside it would break a line the
   *   row still has room for. Both the depth-1 and depth-2 forms measured byte-identical.
   * - **`gap` now also spaces the cell's inner lines**, since a fragment cell inherits the row's
   *   gap — so tuning the horizontal gap of a wrapping row tunes something one level deeper too.
   *
   * The floor reaches the **fields** in that cell, not every child (#536). A child that is neither a
   * field nor an inline-level control — the 12px word in a range row,
   * `<Input/><Text>to</Text><Input/>` — is not something a readable-width floor applies to. Flooring
   * it measured 2 lines and 190px at 520px with `minChildWidth="15rem"` where 1 line and 91px is
   * right, and only once `floor x children` passed the container width, i.e. exactly when a host set
   * the prop because they needed it. A field behind a `Tooltip` or a host `div` **does** keep the
   * floor: that wrapper is the flex item, so it is the thing the floor has to land on.
   *
   * With no `minChildWidth` the default `10rem` floor applies at both levels, so a wrapping row with
   * a fragment child and `gap={2}` breaks below ~496px where it used to squash. At 500px and above
   * nothing moves.
   *
   * **To get real per-cell behaviour, pass the group as a value rather than as a component.**
   * Children are flattened through fragments and arrays, so this needs no duplication at the call
   * site and is the answer for every shape above:
   *
   * ```jsx
   * const trio = () => (<><Select … /><Select … /><Input … /></>);
   * <FieldRow wrap minChildWidth="15rem">{trio()}</FieldRow>   // three real cells
   * ```
   */
  minChildWidth?: number | string;
  /**
   * How many lines of footer the shared lane holds open. @default 1
   *
   * A non-wrapping row lays its cells out as a three-track grid — label, control, footer —
   * so the footer track sizes to the TALLEST footer in the row and every control bottom lands on one
   * line by construction (#527). `footerLines` is that track's FLOOR: the band never shrinks below
   * the lane it replaced, so a row's height does not move until a footer genuinely needs more.
   *
   * Before #527 the lane reserved whole lines per cell, so a field whose `hint` wrapped past the
   * reserve was taller than its siblings and `align-items: flex-end` lifted its control by the
   * difference (#526) — measured 0px out with a one-line hint and 54px when it wrapped to four.
   * Because it tracked the cell's *rendered width*, no reserve could bound it.
   *
   * Three shapes still behave as they did, because the band cannot take their parts apart without a
   * wrapper inside another component: `Slider`, `FileUpload`, and a `Field` holding two controls.
   * A **wrapping** row keeps the flex path entirely, since grid has no `flex-wrap` and
   * `minChildWidth` is a flex-basis floor.
   *
   * A fourth shape was listed here and should not have been — a fragment cell that also holds a
   * plain control. It was recorded as "measured identical to base, so nothing regresses", which was
   * true and the wrong test: base was already **24px** out, because the fragment lane rule can only
   * reach a `.twc-field` and so the plain control got no lane at all. Fixed in #531 — that control
   * now takes the lane's height as margin — in both the band and the wrapping path.
   *
   * `footerLines` reaches **all four** places that reserve footer space (#537). The two inside a
   * fragment cell — the `::after` its field children draw and the margin its other children take —
   * were a constant one line, so a shared group's plain control sat `(n - 1) x 18px` out the moment
   * a host passed the prop: measured 0 / 18 / 36px at `footerLines` 1 / 2 / 3, while a row of
   * all-field cells held 0px at every value. At the default it reduces to the old value, so nothing
   * moves for a caller not passing it.
   *
   * On the band path a fragment cell no longer uses a lane at all: since #538 each of its children
   * is placed in the row's control track by `grid-row`, the same way a single-child cell's child is.
   * That cell used to drop out of the row template entirely and carry only its own 24px lane, so a
   * **sibling's** wrapping footer moved the row's footer track without moving it — 18px out at
   * 760px, 54px at 520px, and 0px only when nothing in the row had a footer.
   *
   * A child can no longer veto that lane (#543). `Text` and `Heading` reset their UA margins with
   * an **inline** style, which beats every stylesheet rule whatever its specificity, so a word
   * between two inputs in a range row sat one lane low on the wrapping path — 24px, with its
   * computed margin reading `0px` instead of the `calc()`. Those resets are now scoped stylesheet
   * rules at `(0,1,0)`, and the lane is `(0,3,0)`. The band path never had the problem, because
   * placement is layout rather than an offset.
   */
  footerLines?: number;
}

export declare const FieldRow: React.ForwardRefExoticComponent<
  FieldRowProps & React.RefAttributes<HTMLDivElement>
>;
