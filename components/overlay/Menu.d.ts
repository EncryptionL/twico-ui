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
  /** Turns the item into a link: renders `<a role="menuitem" href>`. Sanitized against javascript:/data:/vbscript:. `onClick` (if also set) still fires, then the menu closes. */
  href?: string;
  /** Anchor target when `href` is set (e.g. "_blank"). */
  target?: string;
  /** Anchor rel when `href` is set — pair "_blank" with "noopener noreferrer". */
  rel?: string;
  /** Render a divider line (ignores other fields). */
  separator?: boolean;
  /** Render as an uppercase section heading. */
  heading?: boolean;
}

/**
 * Dropdown menu. Provide a `trigger` element and an `items` array. Renders in a
 * portal (never clipped), auto-flips near the viewport edge, supports an optional
 * rich `header`, and is keyboard-navigable (↑/↓, Home/End, Enter/Space, Esc).
 * Closes on outside click, Esc, or item selection.
 *
 * @startingPoint section="Overlay" subtitle="Dropdown menu with headings & shortcuts" viewport="700x360"
 */
export interface MenuProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Clickable trigger (e.g. a Button or IconButton). **Pass a single focusable control** (a `Button`/`IconButton`, or any element
   *  that is already a button/link). A passed element is CLONED to carry `tabIndex`, `aria-expanded`,
   *  `aria-haspopup`, `aria-controls` and the open handler, and those are only valid on a control:
   *  `aria-expanded` is prohibited on a plain `div`'s implicit `role="generic"` (#447). A non-control
   *  element still works - it is given `role="button"` and Enter/Space - but wrapping the real button in
   *  a `Box`/`Stack` to overlay a badge produces TWO tab stops for one control, so put the decoration
   *  outside the trigger instead. An explicit `role` you set is always preserved. A wrapping `Tooltip`
   *  must go OUTSIDE this component, not inside `trigger` - see docs/overlays.md. */
  trigger: React.ReactNode;
  items: MenuItemDef[];
  /** Horizontal alignment to the trigger. @default "start" */
  align?: "start" | "end";
  /** Optional rich header node rendered above the items (e.g. user info). */
  header?: React.ReactNode;
  /** Fixed menu width in px (defaults to max(200, trigger width)). */
  width?: number;
  /** Open on first render in uncontrolled mode. @default false */
  defaultOpen?: boolean;
  /** Controlled open state — pair with `onOpenChange`. Omit for internal (uncontrolled) state. */
  open?: boolean;
  /** Called with the requested open state on trigger click, item select, Esc, or outside click. */
  onOpenChange?: (open: boolean) => void;
  /** Accessible name for the `role="menu"` popup. When omitted and a `header` is set, the header labels the popup. */
  "aria-label"?: string;
  /** Id(s) of element(s) that label the popup; overrides the header fallback. */
  "aria-labelledby"?: string;
}

export function Menu(props: MenuProps): React.JSX.Element;
