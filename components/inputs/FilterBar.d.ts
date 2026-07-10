import * as React from "react";
import type { Tone } from "../_types";
import type { MultiSelectOption, MultiSelectGroup } from "./MultiSelect";
import type { Option } from "./options";

/** The kinds of filter control a field can render. */
export type FilterFieldType = "multiselect" | "daterange" | "search" | "text" | "number" | "boolean" | "select";

/** A per-field value map keyed by `field`. Shape depends on the field's `type`. */
export type FilterValues = Record<string, any>;

/** One field in the filter schema. */
export interface FilterField {
  /** Data field key (also the React key and the clause `field`). */
  field: string;
  /** Visible label; defaults to `field`. */
  label?: React.ReactNode;
  /** Which control to render. */
  type: FilterFieldType;
  /** Options for `multiselect`/`select`. A function receives the current values for dependent/cascading options. */
  options?: Array<string | MultiSelectOption | MultiSelectGroup | Option> | ((values: FilterValues) => any[]);
  /** Placeholder for the control. */
  placeholder?: React.ReactNode;
  /** Operator emitted in the clause (overrides the per-type default, e.g. `text`→"contains", `number`→"="). */
  op?: string;
  /** Disable just this field. */
  disabled?: boolean;
  /** Enable type-to-filter for a `select` field. */
  searchable?: boolean;
  /** Portal the `select` popover (escape clipping ancestors). */
  portal?: boolean;
  /** Labels for a `boolean` field's three states. */
  anyLabel?: React.ReactNode;
  trueLabel?: React.ReactNode;
  falseLabel?: React.ReactNode;
}

/** A normalized filter clause emitted to `onChange`. */
export interface FilterClause {
  field: string;
  op: string;
  value: unknown;
}

/**
 * Schema-driven faceted filter bar. Renders a row of controls from a `fields`
 * schema (multi-select, date-range, search/text, number, boolean, select), and
 * emits a **normalized clause list** `[{ field, op, value }]` (`isAnyOf`, `>=`/`<`,
 * `contains`, `=`). Optional per-field clear ✕ and a "Clear all (N)" action; options
 * can be a function of the current values for dependent/cascading facets.
 *
 * @startingPoint section="Inputs" subtitle="Schema-driven filter bar" viewport="900x160"
 */
export interface FilterBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** The filter schema — one entry per facet. */
  fields: FilterField[];
  /** Controlled clause list (the same shape emitted by `onChange`). */
  value?: FilterClause[];
  /** Uncontrolled initial clause list. @default [] */
  defaultValue?: FilterClause[];
  /** Fires with the normalized clause list whenever any field changes. */
  onChange?: (clauses: FilterClause[]) => void;
  /** Also fires with the raw per-field value map (convenience for rehydrating controls). */
  onValuesChange?: (values: FilterValues) => void;
  /** Render a "Clear all (N)" action. @default false */
  showClearAll?: boolean;
  /** Label for the clear-all button. @default "Clear all" */
  clearAllLabel?: React.ReactNode;
  /** Show a per-field clear ✕ next to each active field's label. @default true */
  showFieldClear?: boolean;
  /** Control size for every field. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Accent tone forwarded to the date-range control. @default "primary" */
  tone?: Tone;
  /** Disable the whole bar. @default false */
  disabled?: boolean;
}

export function FilterBar(props: FilterBarProps): React.JSX.Element;
