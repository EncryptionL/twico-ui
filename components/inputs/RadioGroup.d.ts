import * as React from "react";
import type { Tone } from "../_types";

export interface RadioGroupOption {
  /** Submitted value for this choice. */
  value: string;
  /** Visible label. */
  label?: React.ReactNode;
  /** Secondary text under the label. */
  description?: React.ReactNode;
  /** Disable just this option. */
  disabled?: boolean;
}

/**
 * Grouped radios with one controlled value, a `role="radiogroup"` container, a hoisted
 * group label/hint/error, and a shared `name`. Provide choices via `options` or by passing
 * `<Radio>` children (their `name`/`checked`/`onChange` are injected). Native inputs give
 * roving tabindex + Arrow-key selection for free.
 *
 * @startingPoint section="Inputs" subtitle="Grouped radios with one value" viewport="700x220"
 */
export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Shared `name` for the radios (auto-generated when omitted). */
  name?: string;
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Called with the newly-selected value. */
  onChange?: (value: string) => void;
  /** Choices (alternative to passing `<Radio>` children). */
  options?: RadioGroupOption[];
  /** `<Radio>` children (alternative to `options`); their group props are injected. */
  children?: React.ReactNode;
  /** Group label (rendered as the radiogroup's accessible name). */
  label?: React.ReactNode;
  /** Helper text below the group. */
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
  /** Error text below the group; sets `aria-invalid` and is announced once for the whole group. */
  error?: React.ReactNode;
  /** Lay the radios in a column or a wrapping row. @default "vertical" */
  orientation?: "vertical" | "horizontal";
  /** Disable every radio in the group. @default false */
  disabled?: boolean;
  /** Mark the group required (native `required` on the radios + `aria-required`). @default false */
  required?: boolean;
  /** Control size applied to each radio. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Color intent applied to each radio. @default "primary" */
  tone?: Tone;
}

export function RadioGroup(props: RadioGroupProps): React.JSX.Element;
