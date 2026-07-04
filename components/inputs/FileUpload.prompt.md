Drag-and-drop file upload with click-to-browse and a removable file list.

```jsx
import { FileUpload } from "./FileUpload";

const [files, setFiles] = React.useState([]);
<FileUpload multiple accept="image/*,.pdf" value={files} onChange={setFiles}
  hint="PNG, JPG or PDF up to 10MB" />
```

Props: `accept`, `multiple`, `disabled`, `hint`, `value` (File[]), `onChange`, `maxSize`, `maxFiles`, `onReject`.
Supports drag-drop onto the zone or click to open the file dialog. Drag-dropped files are filtered by
`accept` (like the browse dialog); `maxSize`/`maxFiles` reject oversize/over-count files and re-adding an
identical file is a no-op — rejects surface via `onReject((rejections) => …)` where each is `{ file, reason }`
with reason `"type" | "size" | "count"`.
Set `tone` (`primary` | `success` | `warning` | `danger` | `info` | `neutral`) to recolor the focus/open accent.
