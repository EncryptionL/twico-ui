import * as React from "react";

export interface TimelineItem {
  /** Event title. */
  title: React.ReactNode;
  /** Muted timestamp shown to the right of the title. */
  time?: React.ReactNode;
  /** Supporting description. */
  description?: React.ReactNode;
  /** Icon inside the node dot. */
  icon?: React.ReactNode;
  /** Node color. */
  tone?: "primary" | "success" | "warning" | "danger";
}

/**
 * Vertical timeline of events — node dots connected by a rail, each with title,
 * time, and description.
 *
 * @startingPoint section="Data display" subtitle="Vertical event timeline" viewport="700x340"
 */
export interface TimelineProps extends React.HTMLAttributes<HTMLUListElement> {
  items: TimelineItem[];
}

export function Timeline(props: TimelineProps): React.JSX.Element;
