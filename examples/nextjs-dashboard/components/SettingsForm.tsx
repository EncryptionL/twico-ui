"use client";

import { useState } from "react";
import { Tabs, Card, Input, Select, Switch, Button, Text, Divider, useColorScheme, useToast } from "twico-ui";

const TIMEZONES = [
  { value: "utc", label: "UTC" },
  { value: "et", label: "Eastern (ET)" },
  { value: "pt", label: "Pacific (PT)" },
  { value: "cet", label: "Central European (CET)" },
];
const DENSITIES = [
  { value: "compact", label: "Compact" },
  { value: "standard", label: "Standard" },
  { value: "comfortable", label: "Comfortable" },
];

export function SettingsForm() {
  const { isDark, setTheme } = useColorScheme();
  const { toast } = useToast();

  const [name, setName] = useState("Twico Workspace");
  const [supportEmail, setSupportEmail] = useState("support@twico.dev");
  const [timezone, setTimezone] = useState("utc");

  const [density, setDensity] = useState("standard");
  const [rtl, setRtl] = useState(false);

  const [notify, setNotify] = useState({ email: true, push: false, digest: true });

  const general = (
    <Card title="Workspace" subtitle="General details">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <Input label="Workspace name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Support email" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
        <Select label="Timezone" value={timezone} onChange={(value) => setTimezone(value ?? "utc")} options={TIMEZONES} />
        <div>
          <Button onClick={() => toast.success("Workspace settings saved")}>Save changes</Button>
        </div>
      </div>
    </Card>
  );

  const appearance = (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <Card title="Appearance" subtitle="Theme, density, and direction">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Switch
            label="Dark mode"
            description="Toggle the whole app between light and dark."
            checked={isDark}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
          />
          <Select label="Density" value={density} onChange={(value) => setDensity(value ?? "standard")} options={DENSITIES} hint="Retunes control heights for the preview below." />
          <Switch
            label="Right-to-left (RTL)"
            description="Mirror the preview for RTL languages."
            checked={rtl}
            onChange={(e) => setRtl(e.target.checked)}
          />
        </div>
      </Card>

      <Card title="Live preview" subtitle="Density and direction apply to this panel only">
        <div data-density={density} dir={rtl ? "rtl" : "ltr"} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <Input label="Sample field" placeholder="Type something" />
          <Select label="Sample select" placeholder="Choose one" options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }]} />
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Button>Primary</Button>
            <Button variant="outline">Secondary</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const notifications = (
    <Card title="Notifications" subtitle="How we reach you">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Switch label="Email notifications" checked={notify.email} onChange={(e) => setNotify((n) => ({ ...n, email: e.target.checked }))} />
        <Switch label="Push notifications" checked={notify.push} onChange={(e) => setNotify((n) => ({ ...n, push: e.target.checked }))} />
        <Switch label="Weekly digest" checked={notify.digest} onChange={(e) => setNotify((n) => ({ ...n, digest: e.target.checked }))} />
        <Divider />
        <div>
          <Button onClick={() => toast.success("Notification preferences saved")}>Save preferences</Button>
        </div>
      </div>
    </Card>
  );

  return (
    <Tabs
      defaultValue="general"
      items={[
        { value: "general", label: "General", content: general },
        { value: "appearance", label: "Appearance", content: appearance },
        { value: "notifications", label: "Notifications", content: notifications },
      ]}
    />
  );
}
