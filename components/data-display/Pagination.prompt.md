Page navigation with prev/next and ellipsis truncation.

```jsx
import { Pagination } from "./Pagination";

const [page, setPage] = React.useState(1);
<Pagination page={page} total={12} onChange={setPage} showJumper />
```

Props: `page`, `total`, `onChange(page)`, `siblings`, `boundaries`, `size` (sm/md/lg), `showJumper` (adds a
"Go to" page input), `jumperLabel`.
