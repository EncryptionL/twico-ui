import * as React from "react";

/**
 * Currency input with a fixed currency defined in code. Shows the symbol as a
 * prefix and the currency code as a suffix, and enforces decimal precision
 * (e.g. precision 2 accepts 2.25 but not 2.259).
 *
 * @startingPoint section="Inputs" subtitle="Currency input with symbol + code" viewport="700x140"
 */
export interface CurrencyProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "defaultValue" | "onChange"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  size?: "sm" | "md" | "lg";
  /** Currency code (key in the built-in table), e.g. "USD", "EUR", "IDR", "JPY". @default "USD" */
  currency?: string;
  /** Override the currency's decimal precision (number of digits after the decimal). */
  precision?: number;
  /** Override the displayed prefix symbol. */
  symbol?: string;
  /** Override the displayed suffix code. */
  code?: string;
  /** Controlled string value. */
  value?: string | number;
  /** Uncontrolled initial value. */
  defaultValue?: string | number;
  /** Native change handler (receives the event). */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Convenience callback with the parsed numeric value and the formatted string. */
  onValueChange?: (value: number | null, formatted: string) => void;
}

export function Currency(props: CurrencyProps): React.JSX.Element;
