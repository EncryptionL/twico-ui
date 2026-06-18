import React from "react";
import { FileUpload } from "twico-ui";

function FileUploadAllProps() {
  const [files, setFiles] = React.useState([]); // or defaultValue for uncontrolled
  return (
    <FileUpload
      label="Project assets"
      required
      tone="info"            // primary | success | warning | danger | info | neutral
      multiple
      accept="image/*,.pdf"
      hint="PNG, JPG or PDF up to 10MB"
      // error="File too large"  // when set, replaces the hint and turns the border red
      disabled={false}
      value={files}          // controlled — or defaultValue={[]} for uncontrolled
      onChange={setFiles}
    />
  );
}

const variations = [
  {
    title: "Default",
    description: "Uncontrolled dropzone. Click to browse or drag files in; the hint defaults to accepted types.",
    code: `<FileUpload />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <FileUpload />
      </div>
    ),
  },
  {
    title: "Multiple with accept + hint",
    description: "Allow several files, restrict to images and PDFs, and show a custom hint line.",
    code: `<FileUpload
  multiple
  accept="image/*,.pdf"
  hint="PNG, JPG or PDF up to 10MB"
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <FileUpload multiple accept="image/*,.pdf" hint="PNG, JPG or PDF up to 10MB" />
      </div>
    ),
  },
  {
    title: "Single file",
    description: "Without multiple, selecting a new file replaces the previous one.",
    code: `<FileUpload accept=".csv" hint="One CSV file" />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <FileUpload accept=".csv" hint="One CSV file" />
      </div>
    ),
  },
  {
    title: "Disabled",
    description: "Non-interactive state, dimmed and not focusable.",
    code: `<FileUpload disabled hint="Uploads are paused" />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <FileUpload disabled hint="Uploads are paused" />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every FileUpload prop in one place — label/required, tone accent, multiple + accept, the hint line (error replaces it and reddens the border), the disabled flag, and the controlled value + onChange pair (use defaultValue instead for uncontrolled).",
    code: `const [files, setFiles] = React.useState([]); // or defaultValue for uncontrolled

<FileUpload
  label="Project assets"
  required
  tone="info"            // primary | success | warning | danger | info | neutral
  multiple
  accept="image/*,.pdf"
  hint="PNG, JPG or PDF up to 10MB"
  // error="File too large"  // when set, replaces the hint and turns the border red
  disabled={false}
  value={files}          // controlled — or defaultValue={[]} for uncontrolled
  onChange={setFiles}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <FileUploadAllProps />
      </div>
    ),
  },
];

export default variations;
