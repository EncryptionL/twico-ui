import * as React from "react";
import type { ActionTone } from "../_types";

/** One toggle button in a {@link ToggleGroup}. */
export interface ToggleGroupItem {
  /** Unique value emitted through `onValueChange` and matched against `value`/`defaultValue`. */
  value: string;
  /** Visible label (omit for an icon-only toggle, then set `aria-label`). */
  label?: React.ReactNode;
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** Disable just this toggle. */
  disabled?: boolean;
  /** Accessible label — required when the toggle is icon-only. */
  "aria-label"?: string;
}

/**
 * A set of **toggle buttons** (`aria-pressed`) — a tool/mode switch (Allow / Deny / Clear), a formatting bar
 * (bold / italic), or a segmented control. Per WAI-ARIA it is a *group of toggle buttons*, not a radiogroup:
 * with `roving`, arrow keys move focus only; Space/Enter/click toggle. Composes `Button` for its look.
 *
 * @startingPoint section="Buttons" subtitle="Group of toggle buttons" viewport="700x160"
 */
export interface ToggleGroupProps {
  /** The toggles to render. */
  items: ToggleGroupItem[];
  /** `"single"` — one value (`string | null`); clicking the active one deselects. `"multiple"` — a `string[]`.
   *  @default "single" */
  type?: "single" | "multiple";
  /** Controlled value: a `string | null` for `"single"`, a `string[]` for `"multiple"`. Pair with `onValueChange`. */
  value?: string | string[] | null;
  /** Initial value for the uncontrolled case. */
  defaultValue?: string | string[] | null;
  /** Fired with the next value (a `string | null`, or a fresh `string[]`) when a toggle changes. */
  onValueChange?: (value: string | string[] | null) => void;
  /** Button size. @default "md" */
  size?: "xs" | "sm" | "md" | "lg";
  /** Tone applied to the pressed ("on") fill. @default "primary" */
  tone?: ActionTone;
  /** The button variant used for the OFF (unpressed) look. @default "outline" */
  variant?: "solid" | "soft" | "outline" | "ghost";
  /** Opt into roving arrow-key focus (WAI-ARIA) — the group is one Tab stop and arrows move focus between
   *  toggles. Off by default (each toggle is in the native tab order). @default false */
  roving?: boolean;
  /** Layout + roving axis. @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Disable the whole group. @default false */
  disabled?: boolean;
  /** Accessible label for the `role="group"` container. */
  "aria-label"?: string;
  className?: string;
}

export function ToggleGroup(props: ToggleGroupProps): React.JSX.Element;
