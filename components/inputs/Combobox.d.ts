import * as React from "react";

/**
 * Searchable single-select (MUI-Autocomplete style) — type directly in the
 * field to filter; the overlay shows only options. Supports grouped options
 * and two-line (title + subtitle) options.
 * Keyboard: ↑/↓ to move, Enter to select, Esc to close.
 *
 * @startingPoint section="Selects" subtitle="Searchable single-select dropdown" viewport="700x160"
 */
export interface ComboboxProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange" | "defaultValue"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  size?: "sm" | "md" | "lg";
  /** Field placeholder. */
  placeholder?: string;
  /** Options — strings, {value,label,description}, or {group,options} groups. */
  options: Array<string | ComboboxOption | ComboboxGroup>;
  /** Controlled selected value. */
  value?: string | null;
  /** Uncontrolled initial value. */
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  /** Show a clear (×) affix when a value is selected. */
  clearable?: boolean;
  disabled?: boolean;
}

export interface ComboboxOption {
  value: string;
  label: string;
  /** Optional second line shown under the label. */
  description?: string;
}

/** A group heading with its own options. */
export interface ComboboxGroup {
  group: string;
  options: Array<string | ComboboxOption>;
}

export function Combobox(props: ComboboxProps): React.JSX.Element;
