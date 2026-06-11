import * as React from "react";
import { MenuItemDef } from "../overlay/Menu";

/**
 * Avatar that opens a dropdown menu of account options — the classic user menu.
 * Shows the user's avatar (optionally with name/email), and a portaled menu with
 * a rich header (avatar + name + email) above the items.
 *
 * @startingPoint section="Data display" subtitle="Avatar account menu" viewport="700x320"
 */
export interface AvatarMenuProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "title"> {
  /** User's full name (drives initials + header). */
  name?: string;
  /** Avatar image URL. */
  src?: string;
  /** Email shown in the header (and trigger when `showName`). */
  email?: string;
  /** Subtitle override for the header/trigger (defaults to `email`). */
  subtitle?: React.ReactNode;
  /** Presence dot. */
  status?: "online" | "busy" | "away" | "offline";
  /** Trigger avatar size. @default "sm" */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Menu items (same shape as Menu's items). */
  items: MenuItemDef[];
  /** Show name/email next to the avatar in the trigger. @default false */
  showName?: boolean;
  /** Show a chevron in the trigger (defaults to `showName`). */
  showChevron?: boolean;
  /** Menu alignment to the trigger. @default "end" */
  align?: "start" | "end";
}

export function AvatarMenu(props: AvatarMenuProps): React.JSX.Element;
