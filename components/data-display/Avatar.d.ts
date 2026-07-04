import * as React from "react";

/**
 * User avatar — image with graceful fallback to initials, optional status dot.
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to initials on error or when absent. */
  src?: string;
  /** Full name — used for initials and the accessible label. */
  name?: string;
  /** @default "md" */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Rounded-square instead of circle. */
  square?: boolean;
  /** Presence indicator. */
  status?: "online" | "busy" | "away" | "offline";
  /** Accessible text for the presence dot, folded into the avatar's spoken name (e.g. "Jane Doe, Online"). Defaults to a capitalized `status`. */
  statusLabel?: string;
  /** Localized presence labels keyed by status value. */
  statusLabels?: Partial<Record<"online" | "busy" | "away" | "offline", string>>;
  /** Adds a brand ring around the avatar. */
  ring?: boolean;
}

export function Avatar(props: AvatarProps): React.JSX.Element;
