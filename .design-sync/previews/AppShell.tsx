import { AppShell, Sidebar, Heading, Text, Button, Stat, Card } from 'twico-ui';

const navIcon = (d: string) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const navItems = [
  { section: 'Workspace' },
  { label: 'Dashboard', active: true, icon: navIcon('M3 12h7V3H3zM14 21h7v-9h-7zM14 3v6h7V3zM3 21h7v-6H3z') },
  { label: 'Projects', icon: navIcon('M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z') },
  { label: 'Reports', icon: navIcon('M3 3v18h18M7 14l4-4 4 4 5-6') },
  { section: 'Account' },
  { label: 'Settings', icon: navIcon('M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 2h-5l-.3 2.6a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L2.6 11a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.3 2.6h5l.3-2.6a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6a7 7 0 0 0 .1-1z') },
];

export const Dashboard = () => (
  <AppShell
    height={440}
    padded
    sidebar={
      <Sidebar
        brand={<>Acme <span style={{ color: 'var(--color-primary)' }}>Inc</span></>}
        items={navItems}
        footer={<span>Jane Doe</span>}
      />
    }
    header={
      <>
        <Heading level={2} size="lg" style={{ margin: 0 }}>Dashboard</Heading>
        <Button size="sm">New project</Button>
      </>
    }
  >
    <Heading level={3} size="md" style={{ marginTop: 0 }}>Welcome back, Jane</Heading>
    <Text tone="muted">Here is what is happening across your workspace today.</Text>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }}>
      <Stat label="Revenue" value="$48,210" delta="+12.5%" helpText="vs last month" />
      <Stat label="Active users" value="2,318" delta="+4.1%" helpText="vs last week" />
      <Stat label="Churn rate" value="1.2%" delta="-0.3%" deltaDirection="down" helpText="vs last month" />
    </div>
    <Card title="Recent activity" subtitle="Last 7 days" style={{ marginTop: 20 }}>
      <Text tone="muted">
        Ada deployed v2.3.0 to production, Bo merged four pull requests, and Cy invited two new teammates.
      </Text>
    </Card>
  </AppShell>
);
