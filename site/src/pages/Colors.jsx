import React from "react";
import { Link } from "react-router-dom";
import { Stack, Heading, Text, Code, useCopyToClipboard } from "twico-ui";
import { indigo, slate, emerald, amber, rose, sky } from "twico-ui/colors";
import CodeBlock from "../components/CodeBlock.jsx";

// The hues, in the same role order as tokens/colors.css. Mirrors Material UI's
// Color page (hue cards + shade rows + hex), adapted to Twico's real palette and
// its real `twico-ui/colors` export.
const HUES = [
  { name: "indigo", scale: indigo, role: "Brand · primary" },
  { name: "slate", scale: slate, role: "Neutral · surfaces, text, borders" },
  { name: "emerald", scale: emerald, role: "Success" },
  { name: "amber", scale: amber, role: "Warning" },
  { name: "rose", scale: rose, role: "Danger" },
  { name: "sky", scale: sky, role: "Info" },
];

// Intent + surface aliases — these are CSS custom properties (they flip in dark
// mode), so the swatches below are live `var(--color-*)` and re-theme with the page.
const INTENTS = [
  { token: "--color-primary", label: "Primary", subtle: "--color-primary-subtle" },
  { token: "--color-success", label: "Success", subtle: "--color-success-subtle" },
  { token: "--color-warning", label: "Warning", subtle: "--color-warning-subtle" },
  { token: "--color-danger", label: "Danger", subtle: "--color-danger-subtle" },
  { token: "--color-info", label: "Info", subtle: "--color-info-subtle" },
];
const SURFACES = [
  { token: "--color-bg", label: "Background" },
  { token: "--color-surface", label: "Surface" },
  { token: "--color-surface-sunken", label: "Sunken" },
  { token: "--color-border", label: "Border" },
  { token: "--color-text", label: "Text" },
  { token: "--color-text-muted", label: "Text muted" },
];

// Pick a readable foreground for a solid hex swatch (relative luminance).
function readableOn(hex) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.62 ? "#0f172a" : "#ffffff";
}

const swatchReset = {
  border: "none", margin: 0, font: "inherit", cursor: "pointer", display: "block", width: "100%",
  boxSizing: "border-box", textAlign: "start",
};

export default function Colors() {
  const { copy } = useCopyToClipboard();
  const [copied, setCopied] = React.useState(null);
  const onCopy = (value) => { copy(value); setCopied(value); };
  React.useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(null), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <Stack as="article" gap={5}>
      <Stack as="section" gap={3}>
        <Text tone="primary" size="xs" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Foundations</Text>
        <Heading level={1}>Color</Heading>
        <Text size="lg" tone="muted">
          Twico UI is built on six color scales. Reach for them two ways: as <strong>CSS custom
          properties</strong> for theming (<Code>var(--color-primary)</Code>), or — when a token is
          awkward, e.g. in charts or inline maths — as <strong>JavaScript</strong> via the
          <Code> twico-ui/colors</Code> export. Click any swatch to copy its hex.
        </Text>
      </Stack>

      {/* ── Palette ─────────────────────────────────────────────────────── */}
      <Stack as="section" gap={3}>
        <Heading level={2} id="palette">Color palette</Heading>
        <Text>
          Given a <em>hue</em> (<Code>indigo</Code>, <Code>slate</Code>, …) and a <em>shade</em>
          {" "}(<Code>500</Code>, <Code>600</Code>, …) you can import the color like this:
        </Text>
        <CodeBlock
          language="jsx"
          code={`import { indigo } from "twico-ui/colors";

const color = indigo[500]; // "#6366f1"`}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--space-4)", marginTop: "var(--space-2)" }}>
          {HUES.map(({ name, scale, role }) => {
            const hero = scale[500];
            const heroFg = readableOn(hero);
            return (
              <div key={name} style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
                <button
                  type="button"
                  onClick={() => onCopy(hero)}
                  aria-label={`Copy ${name} 500, ${hero}`}
                  style={{ ...swatchReset, background: hero, color: heroFg, height: 124, padding: "var(--space-4)", position: "relative" }}
                >
                  <span style={{ fontWeight: 700, fontSize: 15, textTransform: "capitalize" }}>{name}</span>
                  <span style={{ display: "block", fontSize: 12, opacity: 0.85, marginTop: 2 }}>{role}</span>
                  <span style={{ position: "absolute", insetInlineStart: "var(--space-4)", bottom: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>500</span>
                  <span style={{ position: "absolute", insetInlineEnd: "var(--space-4)", bottom: 14, fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {copied === hero ? "Copied!" : hero}
                  </span>
                </button>
                {Object.entries(scale).map(([shade, hex]) => {
                  const fg = readableOn(hex);
                  return (
                    <button
                      key={shade}
                      type="button"
                      onClick={() => onCopy(hex)}
                      aria-label={`Copy ${name} ${shade}, ${hex}`}
                      style={{ ...swatchReset, background: hex, color: fg, padding: "8px var(--space-4)", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{shade}</span>
                      <span style={{ fontFamily: "var(--font-mono)" }}>{copied === hex ? "Copied!" : hex}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Stack>

      {/* ── Tones ───────────────────────────────────────────────────────── */}
      <Stack as="section" gap={3}>
        <Heading level={2} id="tones">Tones</Heading>
        <Text>
          Many components take a <Code>tone</Code> prop that recolors them by intent. These are the six
          tones — each maps to a semantic token family. Each component documents the exact subset it
          supports in its props table (e.g. Button is <Code>primary · danger</Code>; Badge supports all six).
        </Text>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "var(--space-3)" }}>
          {[
            ["primary", "var(--color-primary)", "var(--color-primary-fg)"],
            ["success", "var(--color-success)", "var(--color-success-fg)"],
            ["warning", "var(--color-warning)", "var(--color-warning-fg)"],
            ["danger", "var(--color-danger)", "var(--color-danger-fg)"],
            ["info", "var(--color-info)", "var(--color-info-fg)"],
            ["neutral", "var(--color-text)", "var(--color-surface)"],
          ].map(([name, bg, fg]) => (
            <div key={name} style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--color-border)" }}>
              <div style={{ background: bg, color: fg, padding: "18px 14px", fontWeight: 700, fontSize: 14, textTransform: "capitalize" }}>{name}</div>
              <div style={{ padding: "9px 12px", background: "var(--color-surface)" }}><Code style={{ fontSize: 11 }}>{`tone="${name}"`}</Code></div>
            </div>
          ))}
        </div>
        <Text size="sm" tone="muted">
          Live tone examples appear on each component page (Button, Badge, Alert, Tag, Switch, Checkbox, …).
          Fill is a separate axis — <Code>variant</Code> (e.g. <Code>solid · soft · outline</Code>).
        </Text>
      </Stack>

      {/* ── Semantic tokens ─────────────────────────────────────────────── */}
      <Stack as="section" gap={3}>
        <Heading level={2} id="semantic">Semantic tokens</Heading>
        <Text>
          For application UI, prefer the <strong>semantic aliases</strong> over raw scales — they
          carry intent and automatically flip under <Link to="/docs/dark-mode" style={{ color: "var(--color-primary)", fontWeight: "var(--font-semibold)", textDecoration: "none" }}>dark mode</Link>.
          The JS primitives above are static; these are not. The swatches here are live — toggle the
          theme to watch them re-theme.
        </Text>

        <Text size="sm" weight="bold" tone="muted" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>Intent</Text>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "var(--space-3)" }}>
          {INTENTS.map(({ token, label, subtle }) => (
            <div key={token} style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden", background: "var(--color-surface)" }}>
              <div style={{ height: 56, background: `var(${token})` }} />
              <div style={{ height: 22, background: `var(${subtle})` }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
                <Code style={{ fontSize: 11 }}>{token}</Code>
              </div>
            </div>
          ))}
        </div>

        <Text size="sm" weight="bold" tone="muted" style={{ textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "var(--space-2)" }}>Surfaces &amp; text</Text>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "var(--space-3)" }}>
          {SURFACES.map(({ token, label }) => (
            <div key={token} style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden", background: "var(--color-surface)" }}>
              <div style={{ height: 56, background: `var(${token})`, borderBottom: "1px solid var(--color-border)" }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
                <Code style={{ fontSize: 11 }}>{token}</Code>
              </div>
            </div>
          ))}
        </div>

        <Text>Use a semantic token straight from CSS — no import needed:</Text>
        <CodeBlock
          language="css"
          code={`.cta {
  background: var(--color-primary);
  color: var(--color-primary-fg);
}
.cta:hover { background: var(--color-primary-hover); }`}
        />
        <Text tone="muted" size="sm">
          The full token reference (every alias, light &amp; dark) lives on the
          {" "}<Link to="/docs/theming" style={{ color: "var(--color-primary)", fontWeight: "var(--font-semibold)", textDecoration: "none" }}>Theming</Link> page.
        </Text>
      </Stack>

      {/* ── Accessibility ───────────────────────────────────────────────── */}
      <Stack as="section" gap={3}>
        <Heading level={2} id="accessibility">Accessibility</Heading>
        <Text>
          When pairing a text color with a background, meet <strong>WCAG 2.2 Success Criterion 1.4.3
          (Contrast Minimum)</strong>: at least <strong>4.5:1</strong> for normal text and
          {" "}<strong>3:1</strong> for large text (≥24px, or ≥18.66px bold). Every <Code>--color-*-fg</Code>
          token is pre-paired with its background to clear that bar; the <Code>500</Code>–<Code>600</Code>
          shades generally need white text, while <Code>50</Code>–<Code>300</Code> need a dark foreground.
        </Text>
      </Stack>

      <Text style={{ marginTop: "var(--space-4)", fontWeight: "var(--font-semibold)" }}>
        Next: <Link to="/docs/theming" style={{ color: "var(--color-primary)", fontWeight: "var(--font-semibold)", textDecoration: "none" }}>Theming →</Link>
      </Text>
    </Stack>
  );
}
