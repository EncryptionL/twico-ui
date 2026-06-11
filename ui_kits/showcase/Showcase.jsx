const TW = window.TwicoUiDesignSystem_f2f16a;
const SIcon = window.TwicoIcon;

function PanelButtons() {
  const { Button, IconButton, Badge, Tag, Switch, Spinner } = TW;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Button>Primary</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button loading>Saving</Button>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <IconButton aria-label="a" variant="solid" round icon={<SIcon name="Plus" />} />
        <IconButton aria-label="b" variant="soft" icon={<SIcon name="Heart" />} />
        <IconButton aria-label="c" variant="outline" icon={<SIcon name="Settings" />} />
        <Badge tone="success" dot>Active</Badge>
        <Badge tone="warning" variant="solid">Pending</Badge>
        <Badge tone="info">Beta</Badge>
        <Tag onRemove={() => {}}>react</Tag>
        <Tag onRemove={() => {}}>tailwind</Tag>
        <span style={{ marginLeft: 4 }}><Switch label="Notifications" defaultChecked /></span>
        <Spinner size="sm" />
      </div>
    </div>
  );
}

function PanelForms() {
  const { Input, Select, Checkbox, Radio, Button } = TW;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 620 }}>
      <Input label="Full name" placeholder="Ada Lovelace" leftIcon={<SIcon name="User" size={16} />} />
      <Input label="Email" type="email" placeholder="ada@twico.dev" leftIcon={<SIcon name="Mail" size={16} />} />
      <Select label="Plan" placeholder="Select a plan" options={["Free", "Pro", "Team"]} />
      <Input label="Workspace" placeholder="acme" rightIcon={<SIcon name="Check" size={16} />} />
      <div style={{ gridColumn: "1 / -1", display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
        <Checkbox label="I agree to the terms" defaultChecked />
        <Radio name="bill" label="Monthly" defaultChecked />
        <Radio name="bill" label="Annual" />
        <span style={{ marginLeft: "auto" }}><Button>Create account</Button></span>
      </div>
    </div>
  );
}

function PanelData() {
  const { Table, Pagination, Badge, Avatar } = TW;
  const [page, setPage] = React.useState(1);
  const rows = [
    { id: 1, name: "Jane Cooper", plan: "Pro", status: "Active", mrr: "$120" },
    { id: 2, name: "Wade Warren", plan: "Free", status: "Invited", mrr: "$0" },
    { id: 3, name: "Esther Howard", plan: "Team", status: "Active", mrr: "$480" },
  ];
  const tone = (s) => (s === "Active" ? "success" : s === "Invited" ? "info" : "neutral");
  return (
    <div>
      <Table
        sortable hover rowKey={(r) => r.id}
        columns={[
          { key: "name", header: "Member", render: (v) => (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <Avatar name={v} size="sm" /><strong style={{ fontWeight: 600 }}>{v}</strong>
            </span>) },
          { key: "plan", header: "Plan" },
          { key: "status", header: "Status", render: (v) => <Badge tone={tone(v)} dot>{v}</Badge> },
          { key: "mrr", header: "MRR", align: "right" },
        ]}
        data={rows}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <Pagination page={page} total={8} onChange={setPage} />
      </div>
    </div>
  );
}

function Showcase() {
  const { Tabs } = TW;
  return (
    <section className="twui-container" style={{ paddingTop: 40, paddingBottom: 72 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>See it in action</h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: 17, marginTop: 8 }}>Every component is interactive, themeable, and dark-mode ready.</p>
      </div>

      <div style={{
        borderRadius: "var(--radius-2xl)", border: "1px solid var(--color-border)",
        background: "var(--color-surface)", boxShadow: "var(--shadow-lg)", overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid var(--color-divider)", background: "var(--color-surface-sunken)" }}>
          <span style={{ width: 11, height: 11, borderRadius: 99, background: "var(--color-danger)" }} />
          <span style={{ width: 11, height: 11, borderRadius: 99, background: "var(--color-warning)" }} />
          <span style={{ width: 11, height: 11, borderRadius: 99, background: "var(--color-success)" }} />
          <span style={{ marginLeft: 10, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-text-subtle)" }}>twico-ui/playground.tsx</span>
        </div>
        <div style={{ padding: 26 }}>
          <Tabs
            variant="pill"
            defaultValue="buttons"
            items={[
              { value: "buttons", label: "Buttons", content: <div style={{ paddingTop: 8 }}><PanelButtons /></div> },
              { value: "forms", label: "Forms", content: <div style={{ paddingTop: 8 }}><PanelForms /></div> },
              { value: "data", label: "Data", content: <div style={{ paddingTop: 8 }}><PanelData /></div> },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

window.Showcase = Showcase;
