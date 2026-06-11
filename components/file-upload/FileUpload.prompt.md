Drag-and-drop file upload with click-to-browse and a removable file list.

```jsx
import { FileUpload } from "./FileUpload";

const [files, setFiles] = React.useState([]);
<FileUpload multiple accept="image/*,.pdf" value={files} onChange={setFiles}
  hint="PNG, JPG or PDF up to 10MB" />
```

Props: `accept`, `multiple`, `disabled`, `hint`, `value` (File[]), `onChange`.
Supports drag-drop onto the zone or click to open the file dialog.
