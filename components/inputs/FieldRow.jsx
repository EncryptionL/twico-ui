import React from "react";
import { useScopedStyles } from "../_styles.js";

// Maps a numeric gap step to the spacing token; a string passes through. Same helper Stack uses.
function space(v) {
  if (v == null) return undefined;
  if (typeof v === "number") return `var(--space-${String(v).replace(".", "-")})`;
  return v;
}

const FIELDROW_CSS = `
/* #508: a row of fields PLUS one control - an "insert at the cursor" button beside the box it writes
   into, a remove button at the end of a condition row - which is arguably the more common shape than
   a row of fields alone. #494's reserveFooter closed the field-vs-field half, but its selector is
   .twc-field, and a trailing button's root is .twc-btn, so the button still rode up by a footer's
   height the moment a sibling field grew one.

   This owns the row instead of asking every child to opt in. Each child sits in a cell that is a flex
   COLUMN ending in a footer lane, so everything aligns by its control box rather than by its outer
   box, whatever the child is:

     - a .twc-field child reserves its own lane through #494's ancestor selector, which this row
       turns on by carrying data-reserve-footer;
     - a cell holding anything else gets the lane from the cell itself, built the same way #494
       builds it - generated content at --text-xs after the same --space-1-5 gap - so it matches the
       real footer by construction rather than by a length that drifts when a token changes.

   A field that already has a hint/error keeps its own footer and no lane is added; :has() decides,
   exactly as in #494, so no child has to report anything. */
.twc-fieldrow { display: flex; align-items: flex-end; }
.twc-fieldrow[data-wrap="true"] { flex-wrap: wrap; }
.twc-fieldrow__cell { display: flex; flex-direction: column; gap: var(--space-1-5); min-width: 0; }
/* Fields share the row's width; a plain control keeps its natural size. This is what absorbs the
   <Box sx={{ flex: 1 }}> wrappers a host would otherwise write around every field. */
.twc-fieldrow__cell:has(> .twc-field) { flex: 1 1 0; }
.twc-fieldrow__cell:not(:has(> .twc-field)) { flex: 0 0 auto; }
/* The lane for a non-field cell. A button's own ::after would land INSIDE its box and simply make the
   button taller, so the lane belongs to the cell around it. */
.twc-fieldrow__cell:not(:has(> .twc-field))::after {
  content: "\\00a0"; font-size: var(--text-xs); user-select: none; }
`;

export const FieldRow = /*#__PURE__*/ React.forwardRef(function FieldRow({
  gap = 3,
  wrap = false,
  className = "",
  style,
  children,
  ...rest
}, ref) {
  const __twcStyles = useScopedStyles("twc-fieldrow-styles", FIELDROW_CSS);
  return (
    <div
      ref={ref}
      className={`twc-fieldrow ${className}`.trim()}
      data-wrap={wrap || undefined}
      /* #494's ancestor form: every .twc-field inside reserves a lane without a per-field prop, so a
         field added to this row later is covered with no edit. */
      data-reserve-footer=""
      style={{ gap: space(gap), ...style }}
      {...rest}
    >
      {__twcStyles}
      {React.Children.map(children, (child) =>
        // null/false children would otherwise get an empty cell that still draws a lane and takes
        // part in the gap, leaving a hole where a conditionally-rendered field is hidden.
        child == null || child === false ? null : <div className="twc-fieldrow__cell">{child}</div>
      )}
    </div>
  );
});
