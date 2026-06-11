import * as React from "react";

export interface KanbanColumn {
  /** Unique column id (matches a card's `column`). */
  id: string;
  /** Column heading. */
  title: React.ReactNode;
  /** Dot color for the heading. */
  color?: string;
}

export interface KanbanCard {
  id: string;
  /** Which column the card is in. */
  column: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Small uppercase tag chips. */
  tags?: React.ReactNode[];
  /** Footer node (e.g. an Avatar / due date). */
  footer?: React.ReactNode;
  [key: string]: any;
}

/**
 * Drag-and-drop Kanban board — columns of cards you can drag between columns.
 * Controlled via `cards` + `onCardMove`, or uncontrolled. Supply `renderCard`
 * for custom card content.
 *
 * @startingPoint section="Data display" subtitle="Drag-and-drop Kanban board" viewport="900x420"
 */
export interface KanbanProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  /** Fired when a card is dropped in a new column: (cardId, toColumn, nextCards). */
  onCardMove?: (cardId: string, toColumn: string, nextCards: KanbanCard[]) => void;
  /** Custom card renderer. */
  renderCard?: (card: KanbanCard) => React.ReactNode;
}

export function Kanban(props: KanbanProps): React.JSX.Element;
