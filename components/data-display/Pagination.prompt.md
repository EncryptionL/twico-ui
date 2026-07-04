Page navigation with prev/next and ellipsis truncation.

```jsx
import { Pagination } from "./Pagination";

const [page, setPage] = React.useState(1);
<Pagination page={page} total={12} onChange={setPage} showPageJumper />
```

Props: `page`, `total`, `onChange(page)`, `siblings`, `boundaries`, `size` (sm/md/lg), `showPageJumper`
(adds a "Go to" page input; `showJumper` is a deprecated alias, removed in 2.0), `jumperLabel`,
`getPageLabel` (i18n the numbered buttons' `aria-label`; default `Page N`).
