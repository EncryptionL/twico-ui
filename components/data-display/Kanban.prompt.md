Drag-and-drop Kanban board — drag cards between columns.

```jsx
import { Kanban } from "./Kanban";

<Kanban
  columns={[
    { id: "todo", title: "To do", color: "var(--slate-400)" },
    { id: "doing", title: "In progress", color: "var(--amber-500)" },
    { id: "done", title: "Done", color: "var(--emerald-500)" },
  ]}
  cards={[
    { id: "1", column: "todo", title: "Design tokens", tags: ["Design"], footer: <Avatar name="Ada" size="xs" /> },
    { id: "2", column: "doing", title: "Datatable filters" },
  ]}
  onCardMove={(id, to) => save(id, to)}
/>
```

Columns: `{ id, title, color?, ariaLabel? }`. Cards: `{ id, column, title?, description?, tags?, footer?, ariaLabel? }`.
Use `renderCard` for custom cards. The board is a labeled `role="group"` (name via `aria-label`, default
"Board"); each card is a named draggable button — supply `getCardLabel`/`ariaLabel` when the card content
is graphical, and `ariaLabel` on a column whose `title` is a non-string node.
