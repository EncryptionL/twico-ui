import * as React from "react";
import type { Tone } from "../_types";
import type { Option, OptionGroup } from "./options";

/**
 * Multi-select (MUI-Autocomplete style) — type directly among the chips to
 * filter; the overlay shows checkable options only. Supports grouped options
 * and two-line (title + subtitle) options. Backspace on empty input removes
 * the last chip.
 *
 * @startingPoint section="Selects" subtitle="Multi-select with chips & inline search" viewport="700x180"
 */
export interface MultiSelectProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "defaultValue" | "onChange"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  /** Control height preset, matching Select/Combobox. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: Tone;
  placeholder?: string;
  /** Options — strings, {value,label,description}, or {group,options} groups. */
  options: Array<string | MultiSelectOption | MultiSelectGroup>;
  /** Controlled selected values. */
  value?: string[];
  /** Uncontrolled initial values. */
  defaultValue?: string[];
  /** Called with the full array of selected values (empty array when none/cleared). */
  onChange?: (values: string[]) => void;
  /** Show a clear-all (×) affix when at least one value is selected. @default false */
  clearable?: boolean;
  disabled?: boolean;
  /** Open the menu upward instead of down (e.g. near a viewport bottom). @default "bottom" */
  placement?: "bottom" | "top";
  /** Render the dropdown in a portal (position:fixed on document.body) so it is never clipped by a
   *  scrolling/overflow-hidden ancestor; auto-flips up near the viewport bottom. Set false to render
   *  inline. @default true */
  portal?: boolean;
  /** Minimum popover width in px when portaled (useful when the control is narrow). @default 0 */
  minWidth?: number;
  /** Show a loading row instead of the option list / empty state. @default false */
  loading?: boolean;
  /** Text shown when no options match. @default "No results found" */
  emptyText?: string;
  /** Name for hidden form fields (one per selected value) for native form submission. */
  name?: string;
  /** Cap the number of selectable values; once reached, unselected options become disabled. */
  max?: number;
  /** Collapse chips after N into a "+K more" pill. */
  maxTagCount?: number;
  /** Virtualize the option list — render only the visible slice (plus `overscan`) for long lists. @default false */
  virtualized?: boolean;
  /** Extra option rows rendered above/below the viewport when `virtualized`, to smooth fast scrolling. @default 8 */
  overscan?: number;
  /** Composed with the field's open-on-focus behavior — your handler runs first. */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Composed with the field's keyboard navigation (Arrows/Enter/Escape/Backspace) — your handler runs first; call `event.preventDefault()` to suppress it. */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

/** Alias of the shared {@link Option} type (kept for backward-compatible imports). */
export type MultiSelectOption = Option;

/** Alias of the shared {@link OptionGroup} type (kept for backward-compatible imports). */
export type MultiSelectGroup = OptionGroup;

export function MultiSelect(props: MultiSelectProps): React.JSX.Element;
