import * as React from "react";

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
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  placeholder?: string;
  /** Options — strings, {value,label,description}, or {group,options} groups. */
  options: Array<string | MultiSelectOption | MultiSelectGroup>;
  /** Controlled selected values. */
  value?: string[];
  /** Uncontrolled initial values. */
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  /** Show a clear-all (×) affix when at least one value is selected. @default false */
  clearable?: boolean;
  disabled?: boolean;
  /** Open the menu upward instead of down (e.g. near a viewport bottom). @default "bottom" */
  placement?: "bottom" | "top";
  /** Render the dropdown in a portal (position:fixed on document.body) so it is never clipped by a
   *  scrolling/overflow-hidden ancestor; auto-flips up near the viewport bottom. @default false */
  portal?: boolean;
  /** Minimum popover width in px when portaled (useful when the control is narrow). @default 0 */
  minWidth?: number;
  /** Composed with the field's open-on-focus behavior — your handler runs first. */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Composed with the field's keyboard navigation (Arrows/Enter/Escape/Backspace) — your handler runs first; call `event.preventDefault()` to suppress it. */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export interface MultiSelectOption {
  value: string;
  label: string;
  /** Optional second line shown under the label. */
  description?: string;
}

/** A group heading with its own options. */
export interface MultiSelectGroup {
  group: string;
  options: Array<string | MultiSelectOption>;
}

export function MultiSelect(props: MultiSelectProps): React.JSX.Element;
