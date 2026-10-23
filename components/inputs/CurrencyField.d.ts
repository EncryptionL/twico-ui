import * as React from "react";
import type { Tone } from "../_types";

export interface CurrencyOption { value: string; label: string; }

/**
 * Currency input where the USER selects the currency from a dropdown. The chosen
 * currency drives the prefix symbol, the suffix code, and the enforced decimal
 * precision.
 *
 * @startingPoint section="Inputs" subtitle="Currency input with selectable currency" viewport="700x140"
 */
export interface CurrencyFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "defaultValue" | "onChange"> {
  label?: React.ReactNode;
  /** Helper text below the field; linked to the input via aria-describedby. */
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
  /** Error text below the field; sets aria-invalid and is linked via aria-describedby (takes precedence over hint). */
  error?: React.ReactNode;
  /** Intercepted to render the label asterisk, and forwarded to the native input as `required`. @default false */
  required?: boolean;
  size?: "sm" | "md" | "lg";
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: Tone;
  /** Controlled selected currency code. */
  currency?: string;
  /** Uncontrolled initial currency code. @default "USD" */
  defaultCurrency?: string;
  /** Called when the user picks a different currency. */
  onCurrencyChange?: (code: string) => void;
  /** Limit the selectable currencies (codes or {value,label}); defaults to the full built-in list. */
  currencies?: Array<string | CurrencyOption>;
  /** Controlled amount (string or number). For numeric state, read the parsed value back from `onValueChange` — NOT from the `onChange` event, whose `e.target.value` is a string. */
  value?: string | number;
  /** Uncontrolled initial amount. */
  defaultValue?: string | number;
  /** Escape hatch for the native DOM event. `e.target.value` is a **string** (the raw input), not a number — the field then clamps the displayed value to the currency precision. For controlled numeric state use `onValueChange`. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Primary value callback: the parsed number (`number | null`), the clamped formatted string, and the active currency code. Use this — not `onChange` — for controlled numeric state. */
  onValueChange?: (value: number | null, formatted: string, currency: string) => void;
}

export function CurrencyField(props: CurrencyFieldProps): React.JSX.Element;
