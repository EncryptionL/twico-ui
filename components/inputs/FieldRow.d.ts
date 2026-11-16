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
}

export declare const FieldRow: React.ForwardRefExoticComponent<
  FieldRowProps & React.RefAttributes<HTMLDivElement>
>;
