import * as React from "react";

export interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Element to render (e.g. a router Link). @default "a" */
  as?: React.ElementType;
  /** Open in a new tab with rel="noopener noreferrer" and a ↗ affix. @default false */
  external?: boolean;
}

export declare const Anchor: React.ForwardRefExoticComponent<AnchorProps & React.RefAttributes<HTMLAnchorElement>>;
