import * as React from "react";

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
}

export interface TabItem {
  /** Unique value / id. */
  value: string;
  /** Tab label. */
  label: React.ReactNode;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Optional count pill. */
  count?: number;
  /** Panel content rendered when active (omit for nav-only tabs). */
  content?: React.ReactNode;
}

export function Tabs(props: TabsProps): React.JSX.Element;
