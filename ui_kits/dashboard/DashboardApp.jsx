const TW = window.TwicoUiDesignSystem_f2f16a;
const DIcon = window.TwicoIcon;

function DashboardApp() {
  const { Navbar, Sidebar, Stat, Datatable, Badge, Avatar, Timeline, IconButton, Button, CommandPalette, Card, Chart } = TW;
  const [dark, setDark] = React.useState(false);
  const [cmdOpen, setCmdOpen] = React.useState(false);

  React.useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen(true); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  // Dark mode tokens are scoped to <html>.dark / [data-theme] — toggle on the
  // document root so EVERY surface (body, scroll area, portaled menus) re-themes,
  // not just elements inside this component's subtree.
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    return () => root.classList.remove("dark");
  }, [dark]);

  const toneFor = (s) => (s === "Active" ? "success" : s === "Invited" ? "info" : "danger");
  const members = window.DASH_MEMBERS;

  const logo = <span style={{ width: 28, height: 28, borderRadius: "var(--radius-md)", background: "var(--color-primary)", color: "#fff", display: "grid", placeItems: "center" }}><DIcon name="Blocks" size={17} /></span>;

  return (
    <div className="dash">
      <Sidebar
        brand={<>{logo}<span>Twico <span style={{ color: "var(--color-primary)" }}>UI</span></span></>}
        items={[
          { section: "Main" },
          { label: "Dashboard", icon: <DIcon name="LayoutDashboard" />, active: true },
          { label: "Members", icon: <DIcon name="Users" />, badge: members.length },
          { label: "Billing", icon: <DIcon name="CreditCard" /> },
          { label: "Reports", icon: <DIcon name="ChartBar" /> },
          { section: "Workspace" },
          { label: "Integrations", icon: <DIcon name="Plug" /> },
          { label: "Settings", icon: <DIcon name="Settings" /> },
        ]}
        footer={<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 6px" }}>
          <Avatar name="Ada Park" size="sm" status="online" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>Ada Park</div>
            <div style={{ fontSize: 11, color: "var(--color-text-subtle)" }}>Admin</div>
          </div>
        </div>}
      />

      <div className="dash__main">
        <Navbar
          brand={null}
          links={[
            { label: "Overview", active: true },
            { label: "Analytics" },
            { label: "Audit log" },
          ]}
          actions={<>
            <Button variant="outline" size="sm" leftIcon={<DIcon name="Search" size={15} />} onClick={() => setCmdOpen(true)}>
              Search <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-subtle)", marginLeft: 6 }}>⌘K</span>
            </Button>
            <IconButton aria-label="Notifications" variant="ghost" icon={<DIcon name="Bell" />} />
            <IconButton aria-label="Toggle theme" variant="ghost" onClick={() => setDark((d) => !d)} icon={<DIcon name={dark ? "Sun" : "Moon"} />} />
          </>}
        />

        <div className="dash__scroll">
          <div className="dash__head">
            <h1>Good morning, Ada</h1>
            <p>Here's what's happening across your workspace today.</p>
          </div>

          <div className="dash__kpis">
            <Stat label="Monthly revenue" value="$48,200" delta="+12.5%" helpText="vs last month" icon={<DIcon name="DollarSign" />} />
            <Stat label="Active members" value="1,840" delta="+4.1%" helpText="this week" icon={<DIcon name="Users" />} />
            <Stat label="Seats used" value="312" delta="+18" helpText="of 400" icon={<DIcon name="Armchair" />} />
            <Stat label="Churn rate" value="2.1%" delta="-0.4%" deltaDirection="up" helpText="improved" icon={<DIcon name="TrendingDown" />} />
          </div>

          <div className="dash__card">
            <div className="dash__card-h"><h2>Revenue · last 7 days</h2><Badge tone="success" dot>+12.5%</Badge></div>
            <div style={{ padding: "18px 20px 8px" }}>
              <Chart type="bar" height={200} valueFormat={(v) => "$" + v.toLocaleString()} data={[
                { label: "Mon", value: 5200 }, { label: "Tue", value: 6100 }, { label: "Wed", value: 5800 },
                { label: "Thu", value: 8200 }, { label: "Fri", value: 7400 }, { label: "Sat", value: 4300 }, { label: "Sun", value: 5100 },
              ]} />
            </div>
          </div>
          <div className="dash__panels">
            <div className="dash__card">
              <div className="dash__card-h">
                <h2>Members</h2>
                <Button size="sm" leftIcon={<DIcon name="Plus" size={15} />}>Invite</Button>
              </div>
              <div style={{ padding: 12 }}>
                <Datatable
                  rows={members}
                  rowKey={(r) => r.id}
                  checkboxSelection
                  pageSize={6}
                  pageSizeOptions={[6, 12]}
                  height={360}
                  showExport
                  exportFilename="members"
                  batchActions={[
                    { label: "Email", icon: <DIcon name="Mail" size={15} /> },
                    { label: "Delete", icon: <DIcon name="Trash2" size={15} />, tone: "danger" },
                  ]}
                  columns={[
                    { field: "name", headerName: "Member", width: 200, renderCell: (v) => (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}><Avatar name={v} size="sm" /><strong style={{ fontWeight: 600 }}>{v}</strong></span>) },
                    { field: "role", headerName: "Role", width: 110, valueOptions: ["Admin", "Editor", "Viewer"] },
                    { field: "status", headerName: "Status", width: 130, valueOptions: ["Active", "Invited", "Suspended"], renderCell: (v) => <Badge tone={toneFor(v)} dot>{v}</Badge> },
                    { field: "seats", headerName: "Seats", type: "number", width: 90, aggregation: "sum" },
                    { field: "mrr", headerName: "MRR", type: "number", width: 100, aggregation: "sum", valueFormatter: (v) => `$${v}` },
                    { field: "actions", type: "actions", width: 110, pinned: "right", getActions: (row) => [
                      { label: "Edit", icon: <DIcon name="Pencil" size={15} /> },
                      { label: "Email", icon: <DIcon name="Mail" size={15} /> },
                      { label: "Suspend", icon: <DIcon name="Ban" size={15} />, menu: true },
                      { label: "Delete", icon: <DIcon name="Trash2" size={15} />, tone: "danger", menu: true },
                    ] },
                  ]}
                />
              </div>
            </div>

            <div className="dash__card">
              <div className="dash__card-h"><h2>Recent activity</h2><IconButton aria-label="More" variant="ghost" icon={<DIcon name="EllipsisVertical" />} /></div>
              <div style={{ padding: "18px 20px" }}>
                <Timeline items={window.DASH_ACTIVITY.map((a) => ({ title: a.title, time: a.time, tone: a.tone, icon: <DIcon name={a.icon} size={14} /> }))} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} commands={[
        { group: "Navigation", label: "Go to Dashboard", icon: <DIcon name="LayoutDashboard" size={18} />, shortcut: "G D" },
        { group: "Navigation", label: "Go to Members", icon: <DIcon name="Users" size={18} />, shortcut: "G M" },
        { group: "Navigation", label: "Go to Billing", icon: <DIcon name="CreditCard" size={18} /> },
        { group: "Actions", label: "Invite teammate", icon: <DIcon name="UserPlus" size={18} />, keywords: "add member", shortcut: "I" },
        { group: "Actions", label: "Export members CSV", icon: <DIcon name="Download" size={18} /> },
        { group: "Preferences", label: "Toggle dark mode", icon: <DIcon name="Moon" size={18} />, onSelect: () => setDark((d) => !d) },
      ]} />
    </div>
  );
}

window.DashboardApp = DashboardApp;
