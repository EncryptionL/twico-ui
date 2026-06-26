import { Datatable } from 'twico-ui';

const columns = [
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'role', headerName: 'Role', width: 140 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'mrr', headerName: 'MRR', type: 'number', width: 110, valueFormatter: (v) => `$${v}k` },
];

const rows = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer', status: 'Active', mrr: 120 },
  { id: 2, name: 'Alan Turing', role: 'Researcher', status: 'Active', mrr: 135 },
  { id: 3, name: 'Grace Hopper', role: 'Architect', status: 'On leave', mrr: 128 },
  { id: 4, name: 'Katherine Johnson', role: 'Analyst', status: 'Active', mrr: 98 },
  { id: 5, name: 'Linus Pauling', role: 'Scientist', status: 'Active', mrr: 110 },
];

export const Default = () => (
  <div style={{ maxWidth: 680 }}>
    <Datatable columns={columns} rows={rows} rowKey={(r) => r.id} checkboxSelection rowNumbers pageSize={5} />
  </div>
);
