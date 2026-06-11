import * as React from "react";

export interface Command {
  /** Stable id. */
  id?: string;
  /** Visible label. */
  label: string;
  /** Secondary description line. */
  description?: string;
  /** Leading icon. */
  icon?: React.ReactNode;
  /** Right-aligned shortcut hint, e.g. "⌘K". */
  shortcut?: string;
  /** Group heading this command appears under. */
  group?: string;
  /** Extra search terms (space-separated). */
  keywords?: string;
  /** Invoked on Enter / click (palette closes after). */
  onSelect?: () => void;
}

/**
 * ⌘K-style command palette — fuzzy-ish search over grouped commands with full
 * keyboard nav (↑/↓, Enter, Esc). Drive `open` yourself (e.g. on Cmd/Ctrl+K).
 */
export interface CommandPaletteProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose?: () => void;
  commands: Command[];
  placeholder?: string;
  emptyText?: string;
}

export function CommandPalette(props: CommandPaletteProps): React.JSX.Element | null;
