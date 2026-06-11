import React from "react";
import {
  Stack,
  Grid,
  Box,
  Container,
  Heading,
  Text,
  Code,
  Divider,
  Button,
  IconButton,
  Badge,
  Alert,
  Card,
  Input,
  Select,
  Switch,
  Radio,
  Slider,
  ColorPicker,
  Tabs,
  Table,
  Tooltip,
  useCopyToClipboard,
} from "twico-ui";
import { Highlight, themes } from "prism-react-renderer";

/* ------------------------------------------------------------------ *
 * Theme math — everything derives from a handful of control values.   *
 * ------------------------------------------------------------------ */

const BRAND_PRESETS = [
  "#6366F1", // indigo (default)
  "#7C3AED", // violet
  "#0EA5E9", // sky
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#EC4899", // pink
  "#14B8A6", // teal
];

// Radius presets map a single base value onto the whole sm…2xl scale,
// matching the proportions of the shipped tokens (6/10/14/18/24).
const RADIUS_SCALE = { sm: 0.6, md: 1, lg: 1.4, xl: 1.8, "2xl": 2.4 };

function radiusTokens(base) {
  const r = (m) => `${Math.round(base * m)}px`;
  return {
    "--radius-sm": r(RADIUS_SCALE.sm),
    "--radius-md": r(RADIUS_SCALE.md),
    "--radius-lg": r(RADIUS_SCALE.lg),
    "--radius-xl": r(RADIUS_SCALE.xl),
    "--radius-2xl": r(RADIUS_SCALE["2xl"]),
  };
}

// Font scale multiplies the type ramp from a base size (in px).
const FONT_STEPS = {
  "--text-xs": 0.75,
  "--text-sm": 0.875,
  "--text-base": 1,
  "--text-lg": 1.125,
  "--text-xl": 1.25,
  "--text-2xl": 1.5,
  "--text-3xl": 1.875,
};

function fontTokens(basePx) {
  const out = {};
  for (const [token, mult] of Object.entries(FONT_STEPS)) {
    out[token] = `${+(basePx * mult).toFixed(2)}px`;
  }
  return out;
}

// Brand color drives primary + every interactive/subtle derivative via
// color-mix, so hover/active/subtle/border all stay on-brand. Components
// reference these exact tokens, so overriding them re-themes the whole UI.
function brandTokens(hex, isDark) {
  if (isDark) {
    return {
      "--color-primary": hex,
      "--color-primary-hover": `color-mix(in srgb, ${hex} 80%, white)`,
      "--color-primary-active": `color-mix(in srgb, ${hex} 62%, white)`,
      "--color-primary-fg": "#ffffff",
      "--color-primary-subtle": `color-mix(in srgb, ${hex} 18%, transparent)`,
      "--color-primary-subtle-fg": `color-mix(in srgb, ${hex} 70%, white)`,
      "--color-primary-border": `color-mix(in srgb, ${hex} 38%, transparent)`,
      "--color-ring": `color-mix(in srgb, ${hex} 55%, transparent)`,
    };
  }
  return {
    "--color-primary": hex,
    "--color-primary-hover": `color-mix(in srgb, ${hex} 88%, black)`,
    "--color-primary-active": `color-mix(in srgb, ${hex} 76%, black)`,
    "--color-primary-fg": "#ffffff",
    "--color-primary-subtle": `color-mix(in srgb, ${hex} 12%, white)`,
    "--color-primary-subtle-fg": `color-mix(in srgb, ${hex} 78%, black)`,
    "--color-primary-border": `color-mix(in srgb, ${hex} 32%, white)`,
    "--color-ring": `color-mix(in srgb, ${hex} 45%, transparent)`,
  };
}

// The full set of tokens applied inline to the preview wrapper.
function buildThemeStyle({ brand, radius, fontBase, isDark }) {
  return {
    ...brandTokens(brand, isDark),
    ...radiusTokens(radius),
    ...fontTokens(fontBase),
    // Drive component font-size off the scaled base so it visibly changes.
    fontSize: `${fontBase}px`,
  };
}

// The copy-pasteable :root override. Only the meaningful, brand-derived
// tokens — not the per-component plumbing.
function buildCss({ brand, radius, fontBase }) {
  const rt = radiusTokens(radius);
  const ft = fontTokens(fontBase);
  return `:root {
  /* Brand */
  --color-primary:         ${brand};
  --color-primary-hover:   color-mix(in srgb, ${brand} 88%, black);
  --color-primary-active:  color-mix(in srgb, ${brand} 76%, black);
  --color-primary-subtle:  color-mix(in srgb, ${brand} 12%, white);
  --color-primary-border:  color-mix(in srgb, ${brand} 32%, white);
  --color-ring:            color-mix(in srgb, ${brand} 45%, transparent);

  /* Radius scale */
  --radius-sm:  ${rt["--radius-sm"]};
  --radius-md:  ${rt["--radius-md"]};
  --radius-lg:  ${rt["--radius-lg"]};
  --radius-xl:  ${rt["--radius-xl"]};
  --radius-2xl: ${rt["--radius-2xl"]};

  /* Type scale (base ${fontBase}px) */
  --text-sm:   ${ft["--text-sm"]};
  --text-base: ${ft["--text-base"]};
  --text-lg:   ${ft["--text-lg"]};
  --text-xl:   ${ft["--text-xl"]};
}

.dark:root {
  --color-primary-hover:  color-mix(in srgb, ${brand} 80%, white);
  --color-primary-active: color-mix(in srgb, ${brand} 62%, white);
}`;
}

/* ------------------------------------------------------------------ *
 * Small UI helpers                                                    *
 * ------------------------------------------------------------------ */

function ControlGroup({ label, hint, children }) {
  return (
    <Stack gap={2}>
      <Stack gap={0}>
        <Text size="sm" weight="semibold">{label}</Text>
        {hint ? <Text size="xs" tone="muted">{hint}</Text> : null}
      </Stack>
      {children}
    </Stack>
  );
}

function CssBlock({ code }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <Box style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <Stack
        direction="row"
        justify="space-between"
        align="center"
        gap={2}
        style={{ padding: "8px 8px 8px 14px", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}
      >
        <Stack direction="row" gap={2} align="center">
          <Badge size="sm" tone="neutral" variant="soft">CSS</Badge>
          <Text size="xs" tone="muted">Paste after <Code>import "twico-ui/styles.css"</Code></Text>
        </Stack>
        <Button size="sm" variant="soft" onClick={() => copy(code)} aria-label="Copy theme CSS">
          {copied ? "Copied!" : "Copy"}
        </Button>
      </Stack>
      <Box style={{ background: "#0b1021", colorScheme: "dark" }}>
        <Highlight code={code} language="css" theme={themes.nightOwl}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              style={{
                ...style,
                background: "transparent",
                margin: 0,
                padding: "16px 20px",
                overflowX: "auto",
                textAlign: "left",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.65,
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, k) => (
                    <span key={k} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ *
 * The live preview gallery — re-themes from inherited tokens only.    *
 * ------------------------------------------------------------------ */

const TABLE_COLUMNS = [
  { key: "plan", header: "Plan" },
  { key: "seats", header: "Seats", align: "right" },
  {
    key: "status",
    header: "Status",
    render: (v) => (
      <Badge size="sm" tone={v === "Active" ? "success" : "neutral"} variant="soft" dot>
        {v}
      </Badge>
    ),
  },
];

const TABLE_DATA = [
  { plan: "Starter", seats: 5, status: "Active" },
  { plan: "Growth", seats: 25, status: "Active" },
  { plan: "Scale", seats: 120, status: "Paused" },
];

function PreviewGallery() {
  const [tab, setTab] = React.useState("buttons");
  const [agree, setAgree] = React.useState(true);
  const [plan, setPlan] = React.useState("growth");

  return (
    <Stack gap={4}>
      <Stack direction="row" gap={2} align="center" wrap>
        <Heading level={4} style={{ margin: 0 }}>Acme Console</Heading>
        <Badge tone="primary" variant="solid">Pro</Badge>
        <Box style={{ flex: 1 }} />
        <Button variant="ghost" size="sm">Docs</Button>
        <Button size="sm">Upgrade</Button>
      </Stack>

      <Divider />

      <Tabs
        value={tab}
        onChange={setTab}
        variant="pill"
        items={[
          { value: "buttons", label: "Actions" },
          { value: "form", label: "Form" },
          { value: "data", label: "Data" },
        ]}
      />

      {tab === "buttons" ? (
        <Stack gap={4}>
          <Stack direction="row" gap={2} wrap align="center">
            <Button>Solid</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </Stack>
          <Stack direction="row" gap={2} wrap align="center">
            <Badge tone="primary">Primary</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
            <Badge tone="info">Info</Badge>
            <Badge tone="neutral" variant="outline">Neutral</Badge>
          </Stack>
          <Alert tone="info" title="On-brand by default">
            Buttons, badges, focus rings, and accents all derive from a single brand token.
          </Alert>
        </Stack>
      ) : null}

      {tab === "form" ? (
        <Grid columns={2} gap={4} style={{ alignItems: "start" }}>
          <Input label="Workspace" defaultValue="acme-inc" hint="Lowercase, no spaces." />
          <Select
            label="Plan"
            value={plan}
            onChange={(v) => setPlan(v || "growth")}
            options={[
              { value: "starter", label: "Starter" },
              { value: "growth", label: "Growth" },
              { value: "scale", label: "Scale" },
            ]}
          />
          <Box style={{ gridColumn: "1 / -1" }}>
            <Switch
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              label="Email me product updates"
              description="A short, occasional changelog — no spam."
            />
          </Box>
          <Box style={{ gridColumn: "1 / -1" }}>
            <Button>Save changes</Button>
          </Box>
        </Grid>
      ) : null}

      {tab === "data" ? (
        <Stack gap={4}>
          <Grid columns={2} gap={4}>
            <Card title="Monthly revenue" subtitle="vs. last month">
              <Stack direction="row" align="baseline" gap={2}>
                <Heading level={3} style={{ margin: 0 }}>$48.2k</Heading>
                <Badge tone="success" variant="soft" size="sm">+12.4%</Badge>
              </Stack>
            </Card>
            <Card variant="soft" title="Active seats" subtitle="across all plans">
              <Heading level={3} style={{ margin: 0 }}>150</Heading>
            </Card>
          </Grid>
          <Table columns={TABLE_COLUMNS} data={TABLE_DATA} rowKey={(r) => r.plan} size="sm" />
        </Stack>
      ) : null}
    </Stack>
  );
}

/* ------------------------------------------------------------------ *
 * Page                                                                *
 * ------------------------------------------------------------------ */

export default function ThemeBuilder() {
  const [brand, setBrand] = React.useState("#6366F1");
  const [radius, setRadius] = React.useState(10);
  const [fontBase, setFontBase] = React.useState(16);
  const [density, setDensity] = React.useState(""); // "", "compact", "comfortable"
  const [dir, setDir] = React.useState("ltr"); // "ltr" | "rtl"
  const [isDark, setIsDark] = React.useState(false);

  const themeStyle = React.useMemo(
    () => buildThemeStyle({ brand, radius, fontBase, isDark }),
    [brand, radius, fontBase, isDark]
  );
  const css = React.useMemo(
    () => buildCss({ brand, radius, fontBase }),
    [brand, radius, fontBase]
  );

  function reset() {
    setBrand("#6366F1");
    setRadius(10);
    setFontBase(16);
    setDensity("");
    setDir("ltr");
    setIsDark(false);
  }

  return (
    <Container size="lg">
      <Stack as="article" gap={6}>
        {/* Hero */}
        <Stack as="section" gap={3}>
          <Text tone="primary" size="xs" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Showcase
          </Text>
          <Heading level={1}>Theme builder</Heading>
          <Text size="lg" tone="muted">
            Dial in your brand color, corner radius, type scale, density, and direction — the whole
            component gallery re-themes live. Every change is just CSS custom properties; copy the
            generated <Code>:root</Code> override to rebrand your app with zero component edits.
          </Text>
        </Stack>

        {/* Builder: controls + preview */}
        <Grid columns={3} gap={5} style={{ alignItems: "start" }}>
          {/* Controls */}
          <Box style={{ gridColumn: "span 1" }}>
            <Card
              variant="outline"
              padding="lg"
              title="Controls"
              subtitle="Live, scoped to the preview"
              footer={
                <Button variant="ghost" size="sm" fullWidth onClick={reset}>
                  Reset to defaults
                </Button>
              }
            >
              <Stack gap={5}>
                <ControlGroup label="Brand color" hint="Sets --color-primary + derivatives">
                  <ColorPicker value={brand} onChange={setBrand} presets={BRAND_PRESETS} />
                </ControlGroup>

                <Divider />

                <ControlGroup label={`Corner radius — ${radius}px`} hint="Scales the radius ramp">
                  <Slider
                    min={0}
                    max={24}
                    step={1}
                    value={radius}
                    onChange={setRadius}
                    showValue={false}
                    formatValue={(v) => `${v}px`}
                  />
                </ControlGroup>

                <ControlGroup label={`Font scale — ${fontBase}px base`} hint="Multiplies the type ramp">
                  <Slider
                    min={13}
                    max={20}
                    step={1}
                    value={fontBase}
                    onChange={setFontBase}
                    showValue={false}
                    formatValue={(v) => `${v}px`}
                  />
                </ControlGroup>

                <Divider />

                <ControlGroup label="Density" hint='data-density on the wrapper'>
                  <Select
                    value={density}
                    onChange={(v) => setDensity(v || "")}
                    options={[
                      { value: "compact", label: "Compact" },
                      { value: "", label: "Default" },
                      { value: "comfortable", label: "Comfortable" },
                    ]}
                  />
                </ControlGroup>

                <ControlGroup label="Direction" hint="Sets dir on the wrapper">
                  <Stack direction="row" gap={4}>
                    <Radio
                      name="tb-dir"
                      label="LTR"
                      checked={dir === "ltr"}
                      onChange={() => setDir("ltr")}
                    />
                    <Radio
                      name="tb-dir"
                      label="RTL"
                      checked={dir === "rtl"}
                      onChange={() => setDir("rtl")}
                    />
                  </Stack>
                </ControlGroup>

                <Divider />

                <Switch
                  checked={isDark}
                  onChange={(e) => setIsDark(e.target.checked)}
                  label="Dark mode"
                  description="Toggles dark tokens on the preview only"
                />
              </Stack>
            </Card>
          </Box>

          {/* Preview */}
          <Box style={{ gridColumn: "span 2" }}>
            <Stack gap={2}>
              <Stack direction="row" justify="space-between" align="center">
                <Text size="sm" weight="semibold" tone="muted" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Live preview
                </Text>
                <Stack direction="row" gap={1} align="center">
                  <Badge size="sm" variant="soft" tone="neutral">{isDark ? "Dark" : "Light"}</Badge>
                  <Badge size="sm" variant="soft" tone="neutral">{dir.toUpperCase()}</Badge>
                  <Badge size="sm" variant="soft" tone="neutral">{density || "default"}</Badge>
                </Stack>
              </Stack>

              {/* The themed surface. All tokens are inherited from here. */}
              <Box
                dir={dir}
                data-density={density || undefined}
                data-theme={isDark ? "dark" : undefined}
                style={{
                  ...themeStyle,
                  background: "var(--color-bg)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-6, 28px)",
                  transition: "background var(--duration-200, .2s) var(--ease-standard, ease)",
                }}
              >
                <PreviewGallery />
              </Box>

              <Text size="xs" tone="subtle">
                Everything above inherits from a single wrapper — no per-component theming.
              </Text>
            </Stack>
          </Box>
        </Grid>

        {/* Export */}
        <Stack as="section" gap={3}>
          <Stack gap={1}>
            <Heading level={2} id="export">Export your theme</Heading>
            <Text tone="muted">
              Drop this into your global stylesheet (after <Code>twico-ui/styles.css</Code>) and the
              whole library rebrands. No build step, no component overrides.
            </Text>
          </Stack>
          <CssBlock code={css} />
        </Stack>

        {/* How it works */}
        <Stack as="section" gap={3}>
          <Heading level={2} id="how">How it works</Heading>
          <Grid columns={3} gap={4}>
            <Card variant="soft" title="Inherited tokens">
              <Text size="sm" tone="muted">
                Components read <Code>--color-primary</Code>, <Code>--radius-md</Code>,{" "}
                <Code>--text-base</Code> and friends. Set them on any wrapper and the subtree retheme.
              </Text>
            </Card>
            <Card variant="soft" title="Density & direction">
              <Text size="sm" tone="muted">
                <Code>data-density</Code> retunes every control height; <Code>dir="rtl"</Code> flips
                layout. Both cascade with zero per-component code.
              </Text>
            </Card>
            <Card variant="soft" title="Dark mode">
              <Text size="sm" tone="muted">
                The same tokens have dark values under <Code>data-theme="dark"</Code> — scoped here to
                the preview, or put it on <Code>&lt;html&gt;</Code> app-wide.
              </Text>
            </Card>
          </Grid>
        </Stack>
      </Stack>
    </Container>
  );
}
