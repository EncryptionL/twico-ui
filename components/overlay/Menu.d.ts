import * as React from "react";

export interface MenuItemDef {
  /** Item label (also used for a heading when `heading` is true). */
  label?: React.ReactNode;
  /** Leading icon. */
  icon?: React.ReactNode;
  /** Click handler — menu closes after it runs. */
  onClick?: () => void;
  /** Right-aligned shortcut hint (mono). */
  shortcut?: string;
  /** Render in danger color. */
  danger?: boolean;
  disabled?: boolean;
  /** Render a divider line (ignores other fields). */
  separator?: boolean;
  /** Render as an uppercase section heading. */
  heading?: boolean;
}

/**
 * Dropdown menu. Provide a `trigger` element and an `items` array. Renders in a
 * portal (never clipped), auto-flips near the viewport edge, supports an optional
 * rich `header`, and is keyboard-navigable (↑/↓, Enter, Esc). Closes on outside
 * click, Esc, or item selection.
 *
 * @startingPoint section="Overlay" subtitle="Dropdown menu with headings & shortcuts" viewport="700x360"
 */
export interface MenuProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Clickable trigger (e.g. a Button or IconButton). */
  trigger: React.ReactNode;
  items: MenuItemDef[];
  /** Horizontal alignment to the trigger. @default "start" */
  align?: "start" | "end";
  /** Optional rich header node rendered above the items (e.g. user info). */
  header?: React.ReactNode;
  /** Fixed menu width in px (defaults to max(200, trigger width)). */
  width?: number;
}

export function Menu(props: MenuProps): React.JSX.Element;
