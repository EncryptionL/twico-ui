import * as React from "react";
import type { Tone } from "../_types";

/**
 * Drag-and-drop file upload (dropzone) with a click-to-browse fallback and a
 * removable selected-file list. Controlled via `value` (File[]) + `onChange`,
 * or uncontrolled.
 *
 * @startingPoint section="Inputs" subtitle="Drag & drop file upload" viewport="700x320"
 */
export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Accepted file types (input accept string, e.g. "image/*,.pdf"). */
  accept?: string;
  /** Allow selecting multiple files. @default false */
  multiple?: boolean;
  disabled?: boolean;
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: Tone;
  /** Field label rendered above the dropzone. */
  label?: React.ReactNode;
  /** Hint line under the prompt (defaults to the accept types). */
  hint?: React.ReactNode;
  /** Error message shown below the dropzone — turns the border red (sets `aria-invalid`). */
  error?: React.ReactNode;
  /** Marks the field required (adds an asterisk to the label). @default false */
  required?: boolean;
  /** Controlled list of selected files. */
  value?: File[];
  /** Uncontrolled initial file list. @default [] */
  defaultValue?: File[];
  /** Max size per file in bytes; larger files are rejected (drag + browse). */
  maxSize?: number;
  /** Max number of files retained (multiple mode); extra files are rejected. */
  maxFiles?: number;
  /** Called with the files that failed validation: `{ file, reason }` where reason is "type" | "size" | "count". */
  onReject?: (rejections: Array<{ file: File; reason: "type" | "size" | "count" }>) => void;
  onChange?: (files: File[]) => void;
}

export function FileUpload(props: FileUploadProps): React.JSX.Element;
