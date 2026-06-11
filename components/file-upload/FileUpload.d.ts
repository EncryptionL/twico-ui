import * as React from "react";

/**
 * Drag-and-drop file upload (dropzone) with a click-to-browse fallback and a
 * removable selected-file list. Controlled via `value` (File[]) + `onChange`,
 * or uncontrolled.
 *
 * @startingPoint section="Inputs" subtitle="Drag & drop file upload" viewport="700x320"
 */
export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Accepted file types (input accept string, e.g. "image/*,.pdf"). */
  accept?: string;
  /** Allow selecting multiple files. @default false */
  multiple?: boolean;
  disabled?: boolean;
  /** Hint line under the prompt (defaults to the accept types). */
  hint?: React.ReactNode;
  /** Controlled list of selected files. */
  value?: File[];
  onChange?: (files: File[]) => void;
}

export function FileUpload(props: FileUploadProps): React.JSX.Element;
