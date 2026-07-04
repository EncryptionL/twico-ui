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
