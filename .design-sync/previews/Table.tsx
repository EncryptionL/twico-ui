import { Table, Badge } from 'twico-ui';

const users = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer', status: 'Active', mrr: 120 },
  { id: 2, name: 'Alan Turing', role: 'Designer', status: 'Invited', mrr: 90 },
  { id: 3, name: 'Grace Hopper', role: 'Manager', status: 'Active', mrr: 200 },
  { id: 4, name: 'Katherine Johnson', role: 'Analyst', status: 'Active', mrr: 150 },
];

const columns = [
  { field: 'name', headerName: 'Name' },
  { field: 'role', headerName: 'Role' },
  { field: 'status', headerName: 'Status' },
  { field: 'mrr', headerName: 'MRR', align: 'right', renderCell: (v) => `$${v}k` },
];

export const Basic = () => (
  <div style={{ width: 520, maxWidth: '100%' }}>
    <Table columns={columns} rows={users} rowKey={(r) => r.id} />
  </div>
);

export const SortableStriped = () => (
  <div style={{ width: 520, maxWidth: '100%' }}>
    <Table sortable striped columns={columns} rows={users} rowKey={(r) => r.id} defaultSort={{ field: 'mrr', dir: 'desc' }} />
  </div>
);

export const StatusBadges = () => {
  const richColumns = [
    { field: 'name', headerName: 'Name' },
    { field: 'role', headerName: 'Role' },
    { field: 'status', headerName: 'Status', renderCell: (v) => <Badge tone={v === 'Active' ? 'success' : 'neutral'}>{v}</Badge> },
    { field: 'mrr', headerName: 'MRR', align: 'right', renderCell: (v) => `$${v}k` },
  ];
  return (
    <div style={{ width: 520, maxWidth: '100%' }}>
      <Table columns={richColumns} rows={users} rowKey={(r) => r.id} selectedKeys={[3]} />
    </div>
  );
};
