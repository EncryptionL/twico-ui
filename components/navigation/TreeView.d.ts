import * as React from "react";

export interface TreeNode {
  /** Unique id. */
  id: string;
  /** Row label. */
  label: React.ReactNode;
  /** Leading icon. */
  icon?: React.ReactNode;
  /** Trailing meta (count, etc.). */
  badge?: React.ReactNode;
  /** Child nodes (presence makes the row expandable). */
  children?: TreeNode[];
}

/**
 * Hierarchical tree with expand/collapse carets, indentation, icons, and a
 * selected row. Good for file explorers and nested navigation.
 *
 * @startingPoint section="Navigation" subtitle="Hierarchical tree view" viewport="700x340"
 */
export interface TreeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TreeNode[];
  /** Node ids expanded on first render (uncontrolled). */
  defaultExpanded?: string[];
  /** Controlled expanded node ids (pair with `onExpandedChange`). */
  expanded?: string[];
  /** Fired with the next expanded ids whenever a row expands or collapses. */
  onExpandedChange?: (ids: string[]) => void;
  /** Controlled selected node id. */
  selectedId?: string | null;
  /** Fired with the node when a row is clicked. */
  onSelect?: (node: TreeNode) => void;
}

export function TreeView(props: TreeViewProps): React.JSX.Element;
