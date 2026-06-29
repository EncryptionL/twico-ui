import { Tabs } from 'twico-ui';

const items = [
  { value: 'overview', label: 'Overview', content: <p style={{ margin: 0 }}>Project overview and key metrics.</p> },
  { value: 'activity', label: 'Activity', count: 12, content: <p style={{ margin: 0 }}>Recent activity feed.</p> },
  { value: 'settings', label: 'Settings', content: <p style={{ margin: 0 }}>Workspace settings.</p> },
];

export const Line = () => (
  <div style={{ width: 420, maxWidth: '100%' }}>
    <Tabs variant="line" defaultValue="overview" items={items} />
  </div>
);

export const Pill = () => (
  <div style={{ width: 420, maxWidth: '100%' }}>
    <Tabs variant="pill" defaultValue="activity" items={items} />
  </div>
);
