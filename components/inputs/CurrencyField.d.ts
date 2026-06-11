import * as React from "react";

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
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  size?: "sm" | "md" | "lg";
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
  /** Callback with the parsed number, formatted string, and active currency code. */
  onValueChange?: (value: number | null, formatted: string, currency: string) => void;
}

export function CurrencyField(props: CurrencyFieldProps): React.JSX.Element;
