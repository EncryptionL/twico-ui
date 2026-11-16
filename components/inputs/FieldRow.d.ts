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
 * drifts when a token changes, and `:has()` decides per child, so a field that already has a
 * `hint` or `error` keeps its own footer and gets no extra lane.
 *
 * For a row the host already lays out itself, `reserveFooter` on each field still works; this is the
 * version for when the row is yours to shape.
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
