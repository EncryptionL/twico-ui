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
  /**
   * #494: always render the footer lane, empty when there is nothing to say, so this field is the
   * same height as one that has a `hint`, an `error` or a counter.
   *
   * A row of fields aligned with `align="flex-end"` splits onto two lines the moment ONE of them
   * has a hint: that field grows a footer, the others do not, and the caption ends up moving a
   * *different* control. `align` cannot fix it - `flex-start` lines up the labels instead, so the
   * controls part company as soon as one label wraps at a narrow width.
   *
   * Set it per field, or once on any ancestor for everything inside, which is the safer habit in a
   * row - with a per-field prop alone, adding a field later and forgetting it brings the
   * misalignment straight back:
   *
   * ```jsx
   * <Stack direction="row" align="flex-end" data-reserve-footer>
   *   <Select label="Filter" … />
   *   <Select label="Comparison" hint="Matches the whole value." … />
   *   <Input  label="Value" … />
   * </Stack>
   * ```
   *
   * The lane is held open by generated content, so it matches the real footer by construction -
   * same font metrics, same flex gap - rather than by a height that drifts when a token changes.
   * It adds no text to the accessibility tree.
   *
   * @default false
   */
  reserveFooter?: boolean;
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
  /** Seed the search *text* with this string each time the menu opens (caret placed at the end), without emitting it as
   *  an `onInputChange`. It is matched against option labels/descriptions like any typed query — not the option
   *  `value` — so to open a cell editor pre-filled on the current selection, pass its **label** (e.g. `"Japan"`),
   *  not its value (`"jp"`). */
  defaultQuery?: string;
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
  /** Called with `true` when the menu opens and `false` when it closes (including when `close()` silently resets the
   *  typed query) — a host staging that query (e.g. a cell editor) can withdraw it on close. */
  onOpenChange?: (open: boolean) => void;
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
  /** Let long option labels/descriptions wrap onto multiple lines instead of truncating to one line with an
   *  ellipsis — useful when options share a long prefix and differ only in a truncated tail. Takes precedence
   *  over `virtualized` (wrapped rows aren't a fixed height). @default false */
  wrapOptions?: boolean;
  /** #326: render a custom option row body (twico keeps the checkmark, keyboard nav, and ARIA wiring). For
   *  lightweight cases prefer the additive `icon`/`hint` fields on an option instead. Disables `virtualized`
   *  (custom rows aren't a fixed height). */
  renderOption?: (option: ComboboxOption, state: { selected: boolean; active: boolean }) => React.ReactNode;
  /** Composed with the field's open-on-focus behavior — your handler runs first. */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Composed with the field's keyboard navigation (Arrows/Enter/Escape) — your handler runs first; call `event.preventDefault()` to suppress it. */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

/** Alias of the shared {@link Option} type (kept for backward-compatible imports). */
export type ComboboxOption = Option;

/** Alias of the shared {@link OptionGroup} type (kept for backward-compatible imports). */
export type ComboboxGroup = OptionGroup;

/**
 * #490: forwards `ref` to the text `<input>`, merged with the internal ref used for focus and caret handling.
 *
 * Declared rather than left to React 19's implicit pass-through: on React 19 `ref` is an ordinary
 * prop, so `{...rest}` would land one on the element anyway, but React 18 strips it and the type
 * denied it on both. `forwardRef` works on both majors — see #488.
 */
export declare const Combobox: React.ForwardRefExoticComponent<
  ComboboxProps & React.RefAttributes<HTMLInputElement>
>;
