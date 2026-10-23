import * as React from "react";
import type { Tone } from "../_types";

/** Metadata describing one built-in currency. */
export interface CurrencyMeta {
  /** ISO-style currency code, e.g. "USD". */
  code: string;
  /** Display symbol used as the input prefix, e.g. "$". */
  symbol: string;
  /** Number of decimal digits the currency allows, e.g. 2 (JPY/KRW use 0). */
  precision: number;
  /** Human-readable currency name, e.g. "US Dollar". */
  label: string;
}

/** Built-in currency metadata table keyed by code (USD, EUR, GBP, JPY, IDR, …). */
export const CURRENCIES: Record<string, CurrencyMeta>;

/** The built-in currencies as { value, label } options, ready for a Select. */
export const CURRENCY_OPTIONS: Array<{ value: string; label: string }>;

/** Clamp a raw input string to the given decimal precision (e.g. precision 2: "2.259" → "2.25"). */
export function clampPrecision(str: string | number | null | undefined, precision: number): string;

/**
 * Currency input with a fixed currency defined in code. Shows the symbol as a
 * prefix and the currency code as a suffix, and enforces decimal precision
 * (e.g. precision 2 accepts 2.25 but not 2.259).
 *
 * @startingPoint section="Inputs" subtitle="Currency input with symbol + code" viewport="700x140"
 */
export interface CurrencyProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "defaultValue" | "onChange"> {
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
  /** Currency code (key in the built-in table), e.g. "USD", "EUR", "IDR", "JPY". @default "USD" */
  currency?: string;
  /** Override the currency's decimal precision (number of digits after the decimal). */
  precision?: number;
  /** Override the displayed prefix symbol. */
  symbol?: string;
  /** Override the displayed suffix code. */
  code?: string;
  /** Controlled value (string or number). For numeric state, read the parsed value back from `onValueChange` — NOT from the `onChange` event, whose `e.target.value` is a string. */
  value?: string | number;
  /** Uncontrolled initial value. */
  defaultValue?: string | number;
  /** Escape hatch for the native DOM event. `e.target.value` is a **string** (the raw input the user typed), not a number — the field then clamps the displayed value to the currency precision. For controlled numeric state use `onValueChange` instead. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Primary value callback: the parsed numeric value (`number | null`) plus the clamped, formatted display string. Use this — not `onChange` — for controlled numeric state. */
  onValueChange?: (value: number | null, formatted: string) => void;
}

export function Currency(props: CurrencyProps): React.JSX.Element;
