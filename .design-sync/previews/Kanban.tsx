import { Kanban, Avatar, Badge } from 'twico-ui';

const columns = [
  { id: 'todo', title: 'To do', color: 'var(--slate-400)' },
  { id: 'doing', title: 'In progress', color: 'var(--amber-500)' },
  { id: 'done', title: 'Done', color: 'var(--emerald-500)' },
];

export const Board = () => (
  <div style={{ width: '100%', overflowX: 'auto' }}>
    <Kanban
      columns={columns}
      defaultCards={[
        { id: '1', column: 'todo', title: 'Audit color scales', description: 'Reconcile slate vs neutral ramps', tags: ['Design'] },
        { id: '2', column: 'todo', title: 'Write migration guide' },
        { id: '3', column: 'doing', title: 'Datatable column filters', tags: ['Frontend'] },
        { id: '4', column: 'doing', title: 'Tighten focus rings', tags: ['A11y'] },
        { id: '5', column: 'done', title: 'Ship release', description: 'v1.3.0 published', tags: ['Release'] },
      ]}
    />
  </div>
);

export const WithAssignees = () => (
  <div style={{ width: '100%', overflowX: 'auto' }}>
    <Kanban
      columns={columns}
      defaultCards={[
        { id: '1', column: 'todo', title: 'Onboarding flow', tags: ['Design'], footer: <Avatar name="Ada Lovelace" size="xs" /> },
        { id: '2', column: 'doing', title: 'API rate limits', tags: ['Backend'], footer: <Avatar name="Grace Hopper" size="xs" /> },
        { id: '3', column: 'done', title: 'Auth refactor', tags: ['Backend'], footer: <Avatar name="Alan Turing" size="xs" /> },
      ]}
    />
  </div>
);

export const PriorityCards = () => (
  <div style={{ width: '100%', overflowX: 'auto' }}>
    <Kanban
      columns={columns}
      defaultCards={[
        { id: '1', column: 'todo', title: 'Migrate billing API', priority: 'High', tone: 'danger', assignee: 'Ada Lovelace' },
        { id: '2', column: 'doing', title: 'Polish empty states', priority: 'Low', tone: 'neutral', assignee: 'Grace Hopper' },
        { id: '3', column: 'done', title: 'Dark mode pass', priority: 'Med', tone: 'warning', assignee: 'Alan Turing' },
      ]}
      renderCard={(card) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Badge tone={card.tone}>{card.priority}</Badge>
            <Avatar name={card.assignee} size="xs" />
          </div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{card.title}</div>
        </div>
      )}
    />
  </div>
);
