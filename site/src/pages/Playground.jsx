import React from "react";
import {
  Stack,
  Grid,
  Box,
  Card,
  Heading,
  Text,
  Code,
  Button,
  Badge,
  Input,
  Switch,
  Avatar,
  Alert,
  Select,
} from "twico-ui";
import CodeBlock from "../components/CodeBlock.jsx";

/* ------------------------------------------------------------------ *
 * Playground config — a small, self-contained description of each
 * component's knobs. Each knob is one of:
 *   - { type: "enum",  options: [...] }  -> rendered as a <Select>
 *   - { type: "bool" }                   -> rendered as a <Switch>
 *   - { type: "text" }                   -> rendered as an <Input>
 * `default` seeds the live state. `render(props)` returns the live node,
 * and `snippet(props)` returns the JSX string shown in the code panel.
 * ------------------------------------------------------------------ */

const CONFIGS = [
  {
    id: "button",
    name: "Button",
    blurb: "Action button with variant × tone, sizes, loading and full-width states.",
    knobs: [
      { prop: "children", type: "text", default: "Get started" },
      { prop: "variant", type: "enum", default: "solid", options: ["solid", "soft", "outline", "ghost"] },
      { prop: "tone", type: "enum", default: "primary", options: ["primary", "danger"] },
      { prop: "size", type: "enum", default: "md", options: ["xs", "sm", "md", "lg"] },
      { prop: "loading", type: "bool", default: false },
      { prop: "fullWidth", type: "bool", default: false },
      { prop: "disabled", type: "bool", default: false },
    ],
    render: (p) => (
      <Button
        variant={p.variant}
        tone={p.tone}
        size={p.size}
        loading={p.loading}
        fullWidth={p.fullWidth}
        disabled={p.disabled}
      >
        {p.children}
      </Button>
    ),
  },
  {
    id: "badge",
    name: "Badge",
    blurb: "Compact status label or count, with tones, fill variants, and an optional dot.",
    knobs: [
      { prop: "children", type: "text", default: "Active" },
      { prop: "tone", type: "enum", default: "primary", options: ["primary", "success", "warning", "danger", "info", "neutral"] },
      { prop: "variant", type: "enum", default: "soft", options: ["soft", "solid", "outline"] },
      { prop: "size", type: "enum", default: "md", options: ["sm", "md", "lg"] },
      { prop: "dot", type: "bool", default: true },
    ],
    render: (p) => (
      <Badge tone={p.tone} variant={p.variant} size={p.size} dot={p.dot}>
        {p.children}
      </Badge>
    ),
  },
  {
    id: "input",
    name: "Input",
    blurb: "Labeled text field with hint, error state, sizes, and required marker.",
    knobs: [
      { prop: "label", type: "text", default: "Email" },
      { prop: "placeholder", type: "text", default: "you@example.com" },
      { prop: "hint", type: "text", default: "We'll never share it." },
      { prop: "size", type: "enum", default: "md", options: ["sm", "md", "lg"] },
      { prop: "required", type: "bool", default: false },
      { prop: "disabled", type: "bool", default: false },
      { prop: "invalid", type: "bool", default: false, label: "error" },
    ],
    render: (p) => (
      <div style={{ width: "100%", maxWidth: 320 }}>
        <Input
          label={p.label}
          placeholder={p.placeholder}
          hint={p.invalid ? undefined : p.hint}
          error={p.invalid ? "Enter a valid email address." : undefined}
          size={p.size}
          required={p.required}
          disabled={p.disabled}
        />
      </div>
    ),
    snippetProps: (p) => ({
      label: p.label,
      placeholder: p.placeholder,
      ...(p.invalid ? { error: "Enter a valid email address." } : { hint: p.hint }),
      size: p.size,
      required: p.required,
      disabled: p.disabled,
    }),
  },
  {
    id: "switch",
    name: "Switch",
    blurb: "Instant on/off toggle with a springy thumb, label, description, and error.",
    knobs: [
      { prop: "label", type: "text", default: "Email notifications" },
      { prop: "description", type: "text", default: "Get a digest every morning." },
      { prop: "size", type: "enum", default: "md", options: ["sm", "md"] },
      { prop: "checked", type: "bool", default: true },
      { prop: "disabled", type: "bool", default: false },
    ],
    render: (p, setSelf) => (
      <Switch
        label={p.label}
        description={p.description}
        size={p.size}
        checked={p.checked}
        disabled={p.disabled}
        onChange={(e) => setSelf("checked", e.target.checked)}
      />
    ),
  },
  {
    id: "avatar",
    name: "Avatar",
    blurb: "Image avatar with initials fallback, sizes, presence status, and a brand ring.",
    knobs: [
      { prop: "name", type: "text", default: "Ada Lovelace" },
      { prop: "size", type: "enum", default: "lg", options: ["xs", "sm", "md", "lg", "xl"] },
      { prop: "status", type: "enum", default: "online", options: ["none", "online", "busy", "away", "offline"] },
      { prop: "square", type: "bool", default: false },
      { prop: "ring", type: "bool", default: true },
    ],
    render: (p) => (
      <Avatar
        name={p.name}
        size={p.size}
        status={p.status === "none" ? undefined : p.status}
        square={p.square}
        ring={p.ring}
      />
    ),
    snippetProps: (p) => ({
      name: p.name,
      size: p.size,
      ...(p.status === "none" ? {} : { status: p.status }),
      square: p.square,
      ring: p.ring,
    }),
  },
  {
    id: "alert",
    name: "Alert",
    blurb: "Inline message banner with semantic tones, an optional title, and dismiss.",
    knobs: [
      { prop: "title", type: "text", default: "Heads up" },
      { prop: "children", type: "text", default: "Your changes have been saved." },
      { prop: "tone", type: "enum", default: "info", options: ["info", "success", "warning", "danger"] },
      { prop: "dismissible", type: "bool", default: true, label: "onClose" },
    ],
    render: (p) => (
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Alert
          tone={p.tone}
          title={p.title || undefined}
          onClose={p.dismissible ? () => {} : undefined}
        >
          {p.children}
        </Alert>
      </div>
    ),
    snippetProps: (p) => ({
      tone: p.tone,
      ...(p.title ? { title: p.title } : {}),
      ...(p.dismissible ? { onClose: "() => {}" } : {}),
      children: p.children,
    }),
  },
];

/* --------------------------- snippet builder --------------------------- */

function fmtValue(v) {
  if (typeof v === "string") {
    // raw expression markers (e.g. arrow handlers) start with "() =>"
    if (/^\(\)\s*=>/.test(v) || v === "true" || v === "false") return `{${v}}`;
    return `"${v}"`;
  }
  return `{${String(v)}}`;
}

function buildSnippet(name, props) {
  const entries = Object.entries(props);
  const childrenEntry = entries.find(([k]) => k === "children");
  const attrs = entries.filter(([k, v]) => {
    if (k === "children") return false;
    if (v === undefined || v === null || v === "") return false;
    if (v === false) return false; // omit falsy booleans, matches default
    return true;
  });

  const attrStr = attrs
    .map(([k, v]) => {
      if (v === true) return k; // boolean shorthand
      return `${k}=${fmtValue(v)}`;
    })
    .map((s) => `  ${s}`)
    .join("\n");

  const children = childrenEntry ? String(childrenEntry[1]) : "";

  if (!children) {
    return attrStr ? `<${name}\n${attrStr}\n/>` : `<${name} />`;
  }
  if (!attrStr) {
    return `<${name}>${children}</${name}>`;
  }
  return `<${name}\n${attrStr}\n>\n  ${children}\n</${name}>`;
}

/* ----------------------------- controls ----------------------------- */

function Knob({ knob, value, onChange }) {
  const label = knob.label || knob.prop;

  if (knob.type === "enum") {
    return (
      <Select
        label={<KnobLabel name={label} type="enum" />}
        size="sm"
        value={value}
        options={knob.options}
        onChange={(v) => onChange(knob.prop, v)}
      />
    );
  }

  if (knob.type === "bool") {
    return (
      <Stack gap={1} style={{ minHeight: 54, justifyContent: "flex-end" }}>
        <KnobLabel name={label} type="boolean" />
        <Switch
          checked={Boolean(value)}
          size="sm"
          onChange={(e) => onChange(knob.prop, e.target.checked)}
        />
      </Stack>
    );
  }

  // text
  return (
    <Input
      label={<KnobLabel name={label} type="string" />}
      size="sm"
      value={value ?? ""}
      onChange={(e) => onChange(knob.prop, e.target.value)}
    />
  );
}

const TYPE_TONE = {
  enum: "info",
  boolean: "warning",
  string: "success",
};

function KnobLabel({ name, type }) {
  return (
    <Stack direction="row" gap={1.5} align="center" inline>
      <Code>{name}</Code>
      <Badge tone={TYPE_TONE[type]} variant="soft" size="sm">
        {type}
      </Badge>
    </Stack>
  );
}

/* --------------------------- one playground --------------------------- */

function PlaygroundCard({ config }) {
  const initial = React.useMemo(() => {
    const s = {};
    for (const k of config.knobs) s[k.prop] = k.default;
    return s;
  }, [config]);

  const [state, setState] = React.useState(initial);
  const set = React.useCallback((prop, val) => setState((s) => ({ ...s, [prop]: val })), []);
  const reset = React.useCallback(() => setState(initial), [initial]);

  const snippetProps = config.snippetProps ? config.snippetProps(state) : state;
  const snippet = buildSnippet(config.name, snippetProps);

  return (
    <Card variant="outline" padding="none">
      <Stack gap={0}>
        {/* header */}
        <Stack
          direction="row"
          justify="space-between"
          align="flex-start"
          gap={3}
          wrap
          style={{ padding: "var(--space-4) var(--space-5)" }}
        >
          <Stack gap={1} style={{ flex: "1 1 260px", minWidth: 0 }}>
            <Stack direction="row" gap={2} align="center">
              <Heading level={3} size="lg">{config.name}</Heading>
              <Badge tone="neutral" variant="soft" size="sm">
                {config.knobs.length} props
              </Badge>
            </Stack>
            <Text tone="muted" size="sm">{config.blurb}</Text>
          </Stack>
          <Button size="xs" variant="ghost" onClick={reset}>Reset</Button>
        </Stack>

        {/* live preview stage */}
        <Box
          style={{
            background:
              "radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0) 0 0 / 16px 16px",
            backgroundColor: "var(--color-surface-sunken)",
            borderTop: "1px solid var(--color-border)",
            borderBottom: "1px solid var(--color-border)",
            padding: "var(--space-7) var(--space-5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 120,
          }}
        >
          {config.render(state, set)}
        </Box>

        {/* controls */}
        <Box style={{ padding: "var(--space-5)" }}>
          <Stack gap={3}>
            <Text size="xs" weight="bold" tone="muted" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Props
            </Text>
            <Grid minChildWidth={180} gap={4} align="end">
              {config.knobs.map((knob) => (
                <Knob
                  key={knob.prop}
                  knob={knob}
                  value={state[knob.prop]}
                  onChange={set}
                />
              ))}
            </Grid>
          </Stack>
        </Box>

        {/* live code */}
        <Box style={{ padding: "0 var(--space-5) var(--space-5)" }}>
          <CodeBlock code={snippet} />
        </Box>
      </Stack>
    </Card>
  );
}

/* ------------------------------- page ------------------------------- */

export default function Playground() {
  return (
    <Stack as="article" gap={6}>
      <Stack as="section" gap={3}>
        <Text tone="primary" size="xs" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Try it live
        </Text>
        <Heading level={1}>Playground</Heading>
        <Text size="lg" tone="muted">
          Tweak a component's props with real Twico UI controls and watch it update in place. The
          code panel below each preview reflects exactly what you'd write to reproduce it — copy it
          straight into your app.
        </Text>
      </Stack>

      <Alert tone="info" title="How it works">
        Every knob is itself a Twico UI component — enums use{" "}
        <Code>Select</Code>, booleans use <Code>Switch</Code>, and text uses <Code>Input</Code>.
        The whole page is className-free and styled entirely from design tokens.
      </Alert>

      <Stack as="section" gap={6}>
        {CONFIGS.map((config) => (
          <PlaygroundCard key={config.id} config={config} />
        ))}
      </Stack>

      <Card variant="soft">
        <Stack gap={2}>
          <Heading level={3} size="md">Want more knobs?</Heading>
          <Text tone="muted">
            Every component ships a typed props contract (<Code>.d.ts</Code>) and a usage guide. See
            the full reference for the complete prop list, accessibility notes, and live examples for
            all 60 components.
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
