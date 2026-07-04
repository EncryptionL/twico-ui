import * as React from "react";
import type { Tone } from "../_types";

/**
 * Tabbed navigation with a sliding active indicator. Line or pill variant.
 * Controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 *
 * @startingPoint section="Navigation" subtitle="Tabs with sliding indicator" viewport="700x220"
 */
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** @default "line" */
  variant?: "line" | "pill";
  /** Color intent. @default "primary" */
  tone?: Tone;
  /** Layout axis. Vertical stacks the tablist with the indicator on its trailing edge and the panel beside it; ArrowUp/ArrowDown navigate. @default "horizontal" */
  orientation?: "horizontal" | "vertical";
}

export interface TabItem {
  /** Unique value / id. */
  value: string;
  /** Tab label. */
  label: React.ReactNode;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Optional count pill (e.g. `12`, `"99+"`, `"1.2k"`, or an element). Renders whenever `count != null` — pass `undefined` to hide a `0`. */
  count?: React.ReactNode;
  /** Disable the tab: not selectable via click or keyboard; dimmed and `aria-disabled`. */
  disabled?: boolean;
  /** Panel content rendered when active (omit for nav-only tabs). */
  content?: React.ReactNode;
}

export function Tabs(props: TabsProps): React.JSX.Element;
