// Compile-only guard for #165 (row generic) and #174 (filter operator types).
// Typechecked by `npm run typecheck` (tests/types is in tsconfig include).
import type {
  DatatableColumn,
  DatatableProps,
  DatatableFilterOp,
  DatatableFilter,
} from "../../src";

type User = { id: number; name: string };

const col: DatatableColumn<User> = {
  field: "name",
  renderCell: (_v, row) => row.name,
  getActions: (row) => [{ label: "Open", onClick: (r) => void r.id }],
};

// @ts-expect-error — `row.nope` doesn't exist on User
const badCol: DatatableColumn<User> = { field: "name", renderCell: (_v, row) => row.nope };

const onRowClick: DatatableProps<User>["onRowClick"] = (row) => void row.id;

const op: DatatableFilterOp = "isAnyOf";
// @ts-expect-error — not a valid operator
const badOp: DatatableFilterOp = "isanyof";

const anyOf = { field: "x", op: "isAnyOf", value: ["a"] } satisfies DatatableFilter;
// @ts-expect-error — isAnyOf requires string[], not string
const badFilter = { field: "x", op: "isAnyOf", value: "a" } satisfies DatatableFilter;

// #45 — controlled pagination props + callbacks.
const paged: DatatableProps<User> = {
  columns: [col],
  rows: [{ id: 1, name: "a" }],
  page: 0,
  pageSize: 25,
  onPageChange: (p: number) => void p,
  onPageSizeChange: (s: number) => void s,
};
// @ts-expect-error — page is a 0-based number, not a string
const badPage: DatatableProps<User> = { columns: [col], rows: [], page: "1" };

void [col, badCol, onRowClick, op, badOp, anyOf, badFilter, paged, badPage];
