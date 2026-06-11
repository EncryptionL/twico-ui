import * as React from "react";

/**
 * Multi-select (MUI-Autocomplete style) — type directly among the chips to
 * filter; the overlay shows checkable options only. Supports grouped options
 * and two-line (title + subtitle) options. Backspace on empty input removes
 * the last chip.
 *
 * @startingPoint section="Selects" subtitle="Multi-select with chips & inline search" viewport="700x180"
 */
export interface MultiSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  placeholder?: string;
  /** Options — strings, {value,label,description}, or {group,options} groups. */
  options: Array<string | MultiSelectOption | MultiSelectGroup>;
  /** Controlled selected values. */
  value?: string[];
  /** Uncontrolled initial values. */
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  disabled?: boolean;
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
