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
  /** Control size — scales the dropzone padding. @default "md" */
  size?: "sm" | "md" | "lg";
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
  /** #406: headless mode — render only this element (a camera badge, an "Attach" IconButton, …) instead of the
   *  dropzone + file list. A click opens the picker and the same accept/maxSize/maxFiles/onReject validation
   *  still runs; track the files yourself via `value`/`onChange`. */
  trigger?: React.ReactNode;
  /** #406: also accept dropped files onto the `trigger` (headless mode only). @default false */
  dropOnTrigger?: boolean;
  children?: React.ReactNode;
}

/** #406: imperative handle exposed via a ref — `open()` opens the native file picker. */
export interface FileUploadHandle {
  open(): void;
}

export const FileUpload: React.ForwardRefExoticComponent<FileUploadProps & React.RefAttributes<FileUploadHandle>>;
