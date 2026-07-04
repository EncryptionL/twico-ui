import * as React from "react";

export interface NavbarLink {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Top application bar — brand, inline nav links (hidden on small screens), and
 * a right-aligned actions slot. Sticky + translucent by default.
 *
 * @startingPoint section="Layout" subtitle="Top app bar / navbar" viewport="900x80"
 */
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Brand/logo node at the left. */
  brand?: React.ReactNode;
  /** If set, the brand becomes a link to this URL (sanitized). Otherwise the brand is a
   *  plain, non-navigating element unless `onBrandClick` is given. */
  brandHref?: string;
  /** Click handler for the brand; renders it as a button when `brandHref` is not set. */
  onBrandClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Center nav links. */
  links?: NavbarLink[];
  /** Right-aligned actions (buttons, avatar, etc.). */
  actions?: React.ReactNode;
  /** Stick to the top with a translucent blur. @default true */
  sticky?: boolean;
  /** Hamburger handler shown on small screens. */
  onMenuClick?: () => void;
  /** Drives the hamburger's `aria-expanded` and its "Open menu"/"Close menu" accessible name. */
  menuOpen?: boolean;
  /** Id of the menu/drawer the hamburger controls (`aria-controls`). */
  menuControls?: string;
  /** Accessible name for the links `<nav>` landmark. @default "Primary" */
  navLabel?: string;
}

export function Navbar(props: NavbarProps): React.JSX.Element;
