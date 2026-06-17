import * as React from "react";

/**
 * Searchable single-select (MUI-Autocomplete style) — type directly in the
 * field to filter; the overlay shows only options. Supports grouped options
 * and two-line (title + subtitle) options.
 * Keyboard: ↑/↓ to move, Enter to select, Esc to close.
 *
 * @startingPoint section="Selects" subtitle="Searchable single-select dropdown" viewport="700x160"
 */
export interface ComboboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "defaultValue" | "onChange"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  size?: "sm" | "md" | "lg";
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
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
  /** Open the menu upward instead of down (e.g. near a viewport bottom). @default "bottom" */
  placement?: "bottom" | "top";
  /** Render the dropdown in a portal (position:fixed on document.body) so it is never clipped by a
   *  scrolling/overflow-hidden ancestor; auto-flips up near the viewport bottom. @default false */
  portal?: boolean;
  /** Minimum popover width in px when portaled (useful when the control is narrow). @default 0 */
  minWidth?: number;
  /** Composed with the field's open-on-focus behavior — your handler runs first. */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Composed with the field's keyboard navigation (Arrows/Enter/Escape) — your handler runs first; call `event.preventDefault()` to suppress it. */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
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
