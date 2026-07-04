import * as React from "react";
import type { Tone } from "../_types";
import type { Option, OptionGroup } from "./options";

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
  tone?: Tone;
  /** Field placeholder. */
  placeholder?: string;
  /** Options — strings, {value,label,description}, or {group,options} groups. */
  options: Array<string | ComboboxOption | ComboboxGroup>;
  /** Controlled selected value. */
  value?: string | null;
  /** Uncontrolled initial value. */
  defaultValue?: string | null;
  /** Called with the chosen option's value, or `null` when cleared via `clearable`. */
  onChange?: (value: string | null) => void;
  /** Show a clear (×) affix when a value is selected. */
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
  /** Called with the raw query on every keystroke — drive a debounced remote fetch (with `loading` + `filter={false}`). */
  onInputChange?: (query: string) => void;
  /** Client-side filtering: `false` shows options as-is (server-ranked); a function replaces the default label/description match. */
  filter?: boolean | ((option: ComboboxOption, query: string) => boolean);
  /** Show a loading row instead of the option list / empty state. @default false */
  loading?: boolean;
  /** Text shown when no options match. @default "No results found" */
  emptyText?: string;
  /** Name for a hidden form field so the selected value participates in native form submission. */
  name?: string;
  /** Virtualize the option list — render only the visible slice (plus `overscan`) for long lists. @default false */
  virtualized?: boolean;
  /** Extra option rows rendered above/below the viewport when `virtualized`, to smooth fast scrolling. @default 8 */
  overscan?: number;
  /** Composed with the field's open-on-focus behavior — your handler runs first. */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Composed with the field's keyboard navigation (Arrows/Enter/Escape) — your handler runs first; call `event.preventDefault()` to suppress it. */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

/** Alias of the shared {@link Option} type (kept for backward-compatible imports). */
export type ComboboxOption = Option;

/** Alias of the shared {@link OptionGroup} type (kept for backward-compatible imports). */
export type ComboboxGroup = OptionGroup;

export function Combobox(props: ComboboxProps): React.JSX.Element;
