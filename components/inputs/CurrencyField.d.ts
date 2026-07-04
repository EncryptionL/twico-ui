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
  /** Controlled amount string. */
  value?: string | number;
  /** Uncontrolled initial amount. */
  defaultValue?: string | number;
  /** Native change handler (receives the event); fires alongside onValueChange, matching Currency. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Callback with the parsed number, formatted string, and active currency code. */
  onValueChange?: (value: number | null, formatted: string, currency: string) => void;
}

export function CurrencyField(props: CurrencyFieldProps): React.JSX.Element;
