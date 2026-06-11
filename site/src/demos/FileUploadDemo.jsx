import React, { useState } from "react";
import { FileUpload } from "twico-ui";

export default function FileUploadDemo() {
  const [files, setFiles] = useState([]);
  return (
    <FileUpload
      multiple
      accept="image/*,.pdf"
      value={files}
      onChange={setFiles}
      hint="PNG, JPG or PDF up to 10MB"
    />
  );
}
