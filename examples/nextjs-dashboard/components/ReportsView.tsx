"use client";

import { Tabs, Card, Chart, Table, Progress, Text } from "twico-ui";

// Client component: holds the Tabs + panels. The data-display components here
// take function props (Table's rowKey), which a Server Component may not pass
// across the RSC boundary — so this lives on the client.

const REVENUE = [
  { label: "Jan", revenue: 32 },
  { label: "Feb", revenue: 38 },
  { label: "Mar", revenue: 41 },
  { label: "Apr", revenue: 45 },
  { label: "May", revenue: 52 },
  { label: "Jun", revenue: 48 },
];

const USAGE = [
  { label: "Mon", calls: 4200 },
  { label: "Tue", calls: 5100 },
  { label: "Wed", calls: 4800 },
  { label: "Thu", calls: 6200 },
  { label: "Fri", calls: 7100 },
  { label: "Sat", calls: 3200 },
  { label: "Sun", calls: 2900 },
];

const CUSTOMERS = [
  { id: 1, name: "Acme Corp", plan: "Enterprise", mrr: 4200, seats: 120 },
  { id: 2, name: "Globex", plan: "Pro", mrr: 1800, seats: 45 },
  { id: 3, name: "Initech", plan: "Pro", mrr: 1500, seats: 38 },
  { id: 4, name: "Umbrella", plan: "Team", mrr: 900, seats: 20 },
  { id: 5, name: "Soylent", plan: "Team", mrr: 740, seats: 16 },
];

const FUNNEL: Array<[string, number]> = [
  ["Signed up", 100],
  ["Verified email", 82],
  ["Created a project", 61],
  ["Invited a teammate", 34],
  ["Upgraded to paid", 18],
];

function RevenuePanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <Card title="Monthly revenue" subtitle="$ thousands · last 6 months">
        <Chart type="bar" series={["revenue"]} data={REVENUE} height={240} ariaLabel="Monthly revenue" />
      </Card>
      <Card title="Top customers">
        <Table
          sortable
          striped
          rowKey={(row) => row.id}
          columns={[
            { field: "name", headerName: "Customer", sortable: true },
            { field: "plan", headerName: "Plan" },
            { field: "mrr", headerName: "MRR ($)", align: "right", sortable: true },
            { field: "seats", headerName: "Seats", align: "right", sortable: true },
          ]}
          rows={CUSTOMERS}
        />
      </Card>
    </div>
  );
}

function UsagePanel() {
  return (
    <Card title="API calls" subtitle="This week">
      <Chart type="line" series={["calls"]} data={USAGE} height={260} ariaLabel="API calls this week" />
    </Card>
  );
}

function FunnelPanel() {
  return (
    <Card title="Activation funnel">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {FUNNEL.map(([label, value]) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text size="sm">{label}</Text>
              <Text size="sm" tone="muted">
                {value}%
              </Text>
            </div>
            <Progress value={value} />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ReportsView() {
  return (
    <Tabs
      defaultValue="revenue"
      items={[
        { value: "revenue", label: "Revenue", content: <RevenuePanel /> },
        { value: "usage", label: "Usage", content: <UsagePanel /> },
        { value: "funnel", label: "Funnel", content: <FunnelPanel /> },
      ]}
    />
  );
}
