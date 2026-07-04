import * as React from "react";
import type { Tone } from "../_types";
import type { Option, OptionGroup } from "./options";

/**
 * Custom select with a rounded popover (no native browser dropdown). Supports
 * grouped options and two-line (title + subtitle) options. Keyboard navigable.
 *
 * @startingPoint section="Selects" subtitle="Custom select with grouped options" viewport="700x160"
 */
export interface SelectProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange" | "defaultValue"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  size?: "sm" | "md" | "lg";
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: Tone;
  placeholder?: string;
  /** Placeholder for the in-popover search box. @default "Search…" */
  searchPlaceholder?: string;
  /** Show a search box inside the dropdown to filter options. Omit to auto-enable when there are >5 options. */
  searchable?: boolean;
  /** Options — strings, {value,label,description}, or {group,options} groups. */
  options: Array<string | SelectOption | SelectGroup>;
  /** Controlled selected value. */
  value?: string | null;
  /** Uncontrolled initial value. */
  defaultValue?: string | null;
  /** Called with the chosen option's value, or `null` when cleared via `clearable`. */
  onChange?: (value: string | null) => void;
  /** Show a clear (×) affix when a value is selected; Delete/Backspace on the closed trigger also clears. @default false */
  clearable?: boolean;
  disabled?: boolean;
  /** Composed with the trigger's open/close toggle — your handler runs first; call `event.preventDefault()` to keep the menu from toggling. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Composed with the trigger's keyboard navigation (Enter/Space/Arrows/Escape) — your handler runs first; call `event.preventDefault()` to suppress it. */
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  /** Open the menu upward instead of down (e.g. near a viewport bottom). @default "bottom" */
  placement?: "bottom" | "top";
  /** Render the dropdown in a portal (position:fixed on document.body) so it is never clipped by a
   *  scrolling/overflow-hidden ancestor; auto-flips up near the viewport bottom. Set false to render
   *  inline. @default true */
  portal?: boolean;
  /** Minimum popover width in px when portaled (useful when the trigger is narrow). @default 0 */
  minWidth?: number;
}

/** Alias of the shared {@link Option} type (kept for backward-compatible imports). */
export type SelectOption = Option;

/** Alias of the shared {@link OptionGroup} type (kept for backward-compatible imports). */
export type SelectGroup = OptionGroup;

export function Select(props: SelectProps): React.JSX.Element;
