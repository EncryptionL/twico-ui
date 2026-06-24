import React from "react";
import { Link } from "react-router-dom";
import { Stack, Heading, Text, Code, Input, Badge, useCopyToClipboard } from "twico-ui";
import {
  // Curated sample of the full Lucide set (1,600+ icons), shown by their *Icon alias.
  HomeIcon, SearchIcon, SettingsIcon, UserIcon, UsersIcon, BellIcon, HeartIcon, StarIcon,
  CheckIcon, XIcon, PlusIcon, MinusIcon, ChevronRightIcon, ChevronDownIcon, ArrowRightIcon,
  MenuIcon, Trash2Icon, PencilIcon, DownloadIcon, UploadIcon, CalendarIcon, ClockIcon,
  MailIcon, LockIcon, EyeIcon, EyeOffIcon, SunIcon, MoonIcon, FilterIcon, EllipsisIcon,
  ExternalLinkIcon, CopyIcon, InfoIcon, BookmarkIcon, FolderIcon, FileIcon, ImageIcon,
  ShoppingCartIcon, CreditCardIcon, ZapIcon,
  // Brand icons — added by twico-ui (Lucide ships none), zero extra dependency.
  brandIcons,
} from "twico-ui/icons";
import CodeBlock from "../components/CodeBlock.jsx";

// A representative slice of the Lucide catalogue, by *Icon-suffixed name.
const LUCIDE_SAMPLE = [
  ["HomeIcon", HomeIcon], ["SearchIcon", SearchIcon], ["SettingsIcon", SettingsIcon],
  ["UserIcon", UserIcon], ["UsersIcon", UsersIcon], ["BellIcon", BellIcon],
  ["HeartIcon", HeartIcon], ["StarIcon", StarIcon], ["CheckIcon", CheckIcon],
  ["XIcon", XIcon], ["PlusIcon", PlusIcon], ["MinusIcon", MinusIcon],
  ["ChevronRightIcon", ChevronRightIcon], ["ChevronDownIcon", ChevronDownIcon],
  ["ArrowRightIcon", ArrowRightIcon], ["MenuIcon", MenuIcon], ["Trash2Icon", Trash2Icon],
  ["PencilIcon", PencilIcon], ["DownloadIcon", DownloadIcon], ["UploadIcon", UploadIcon],
  ["CalendarIcon", CalendarIcon], ["ClockIcon", ClockIcon], ["MailIcon", MailIcon],
  ["LockIcon", LockIcon], ["EyeIcon", EyeIcon], ["EyeOffIcon", EyeOffIcon],
  ["SunIcon", SunIcon], ["MoonIcon", MoonIcon], ["FilterIcon", FilterIcon],
  ["EllipsisIcon", EllipsisIcon], ["ExternalLinkIcon", ExternalLinkIcon], ["CopyIcon", CopyIcon],
  ["InfoIcon", InfoIcon], ["BookmarkIcon", BookmarkIcon], ["FolderIcon", FolderIcon],
  ["FileIcon", FileIcon], ["ImageIcon", ImageIcon], ["ShoppingCartIcon", ShoppingCartIcon],
  ["CreditCardIcon", CreditCardIcon], ["ZapIcon", ZapIcon],
];

const linkStyle = { color: "var(--color-primary)", fontWeight: "var(--font-semibold)", textDecoration: "none" };

const cellReset = {
  border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", background: "var(--color-surface)",
  margin: 0, font: "inherit", cursor: "pointer", display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 8px", minHeight: 92,
  color: "var(--color-text)", textAlign: "center", transition: "border-color .15s ease, background .15s ease",
};

// A copy-to-clipboard icon tile. `name` is the exported component name; clicking copies it.
function IconTile({ name, Icon, copiedName, onCopy }) {
  const isCopied = copiedName === name;
  return (
    <button
      type="button"
      onClick={() => onCopy(name)}
      title={`Copy "${name}"`}
      aria-label={`Copy icon name ${name}`}
      style={{ ...cellReset, borderColor: isCopied ? "var(--color-primary)" : "var(--color-border)" }}
    >
      <Icon size={22} aria-hidden />
      <span style={{ fontSize: 11, color: isCopied ? "var(--color-primary)" : "var(--color-text-muted)", fontFamily: "var(--font-mono)", wordBreak: "break-word", lineHeight: 1.3 }}>
        {isCopied ? "Copied!" : name}
      </span>
    </button>
  );
}

const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(118px, 1fr))", gap: "var(--space-3)" };

export default function Icons() {
  const { copy } = useCopyToClipboard();
  const [copiedName, setCopiedName] = React.useState(null);
  const [query, setQuery] = React.useState("");

  const onCopy = (name) => { copy(name); setCopiedName(name); };
  React.useEffect(() => {
    if (!copiedName) return undefined;
    const t = setTimeout(() => setCopiedName(null), 1200);
    return () => clearTimeout(t);
  }, [copiedName]);

  const q = query.trim().toLowerCase();
  const lucideShown = q ? LUCIDE_SAMPLE.filter(([n]) => n.toLowerCase().includes(q)) : LUCIDE_SAMPLE;
  const brandsShown = q
    ? brandIcons.filter((b) => b.name.toLowerCase().includes(q) || b.label.toLowerCase().includes(q))
    : brandIcons;

  return (
    <Stack as="article" gap={5}>
      <Stack as="section" gap={3}>
        <Text tone="primary" size="xs" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Foundations</Text>
        <Heading level={1}>Icons</Heading>
        <Text size="lg" tone="muted">
          Twico UI re-exports the entire <strong>Lucide</strong> icon set (1,600+ crisp, consistent
          icons) from one subpath — <Code>twico-ui/icons</Code> — and adds a curated set of
          <strong> brand icons</strong> Lucide deliberately omits. Every icon is a plain SVG React
          component: tree-shakeable, themeable with <Code>currentColor</Code>, and safe in React
          Server Components.
        </Text>
      </Stack>

      {/* ── Install ─────────────────────────────────────────────────────── */}
      <Stack as="section" gap={3}>
        <Heading level={2} id="install">Install</Heading>
        <Text>
          The Lucide icons come from <Code>lucide-react</Code>, an <strong>optional peer
          dependency</strong> — twico-ui core stays at zero runtime dependencies, so you install it
          only if you use those icons. (The brand icons below need nothing extra; they ship inside
          twico-ui.)
        </Text>
        <CodeBlock language="bash" code={`npm install lucide-react`} />
      </Stack>

      {/* ── Usage ───────────────────────────────────────────────────────── */}
      <Stack as="section" gap={3}>
        <Heading level={2} id="usage">Usage</Heading>
        <Text>
          Import any icon by name from <Code>twico-ui/icons</Code> and drop it in. Names use the
          <Code> Icon</Code> suffix (e.g. <Code>SettingsIcon</Code>). Icons accept Lucide&apos;s props —
          <Code>size</Code>, <Code>color</Code>, <Code>strokeWidth</Code> — and inherit the current
          text color by default, so they re-theme with dark mode for free.
        </Text>
        <CodeBlock
          language="jsx"
          code={`import { Button } from "twico-ui";
import { SettingsIcon, GithubIcon } from "twico-ui/icons";

export function Toolbar() {
  return (
    <>
      <Button leftIcon={<SettingsIcon size={16} />}>Settings</Button>
      {/* Brand icon — no extra dependency */}
      <Button variant="outline" leftIcon={<GithubIcon size={16} />}>
        Star on GitHub
      </Button>
    </>
  );
}`}
        />
        <Text>
          Pair them with <Link to="/components/icon-button" style={linkStyle}>IconButton</Link>,
          {" "}<Link to="/components/input" style={linkStyle}>Input</Link> adornments,
          {" "}<Link to="/components/menu" style={linkStyle}>Menu</Link> items — anywhere a component
          takes an <Code>icon</Code>, <Code>leftIcon</Code>, or <Code>rightIcon</Code> prop.
        </Text>
      </Stack>

      {/* ── Live filter ─────────────────────────────────────────────────── */}
      <Stack as="section" gap={3}>
        <Heading level={2} id="browse">Browse</Heading>
        <Text>
          Click any icon to copy its component name. Use the filter to search across the Lucide
          sample and every brand icon.
        </Text>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter icons… (e.g. arrow, user, github)"
          leftIcon={<SearchIcon size={16} />}
          aria-label="Filter icons"
        />
      </Stack>

      {/* ── Lucide sample ───────────────────────────────────────────────── */}
      <Stack as="section" gap={3}>
        <Stack direction="row" align="center" gap={2}>
          <Heading level={3} id="lucide">Lucide</Heading>
          <Badge tone="neutral" variant="soft" size="sm">sample of 1,600+</Badge>
        </Stack>
        <Text size="sm" tone="muted">
          A small slice of the catalogue. Browse and search the full set at{" "}
          <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" style={linkStyle}>lucide.dev/icons</a>
          {" "}— every icon there is importable from <Code>twico-ui/icons</Code> by its
          {" "}<Code>Icon</Code>-suffixed name.
        </Text>
        {lucideShown.length === 0 ? (
          <Text tone="muted">No Lucide icons in this sample match “{query}”. Try <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" style={linkStyle}>lucide.dev</a>.</Text>
        ) : (
          <div style={gridStyle}>
            {lucideShown.map(([name, Icon]) => (
              <IconTile key={name} name={name} Icon={Icon} copiedName={copiedName} onCopy={onCopy} />
            ))}
          </div>
        )}
      </Stack>

      {/* ── Brand icons ─────────────────────────────────────────────────── */}
      <Stack as="section" gap={3}>
        <Stack direction="row" align="center" gap={2}>
          <Heading level={3} id="brand">Brand icons</Heading>
          <Badge tone="primary" variant="soft" size="sm">{brandIcons.length} included</Badge>
        </Stack>
        <Text>
          Lucide intentionally ships no logos, so twico-ui adds the most-requested brand marks as
          zero-dependency inline SVG — built right into <Code>twico-ui/icons</Code>, no peer
          dependency needed. They take the same <Code>size</Code> and <Code>color</Code> props.
        </Text>
        {brandsShown.length === 0 ? (
          <Text tone="muted">No brand icons match “{query}”.</Text>
        ) : (
          <div style={gridStyle}>
            {brandsShown.map(({ name, Icon }) => (
              <IconTile key={name} name={name} Icon={Icon} copiedName={copiedName} onCopy={onCopy} />
            ))}
          </div>
        )}
        <Text size="sm" tone="muted">
          Brand path data: the <a href="https://simple-icons.org" target="_blank" rel="noopener noreferrer" style={linkStyle}>Simple Icons</a> project
          {" "}(CC0-1.0). Logos are trademarks of their respective owners.
        </Text>
      </Stack>

      {/* ── Props ───────────────────────────────────────────────────────── */}
      <Stack as="section" gap={3}>
        <Heading level={2} id="props">Props</Heading>
        <Stack gap={2}>
          {[
            ["size", "number | string", "24", "Width and height. A number is pixels; any CSS length works too."],
            ["color", "string", "currentColor", "Stroke color for Lucide icons, fill color for brand icons. Inherits text color by default."],
            ["strokeWidth", "number", "2", "Line thickness — Lucide icons only (brand marks are solid, not stroked)."],
            ["title", "string", "—", "Accessible label. When set, the icon is exposed to assistive tech; otherwise it is aria-hidden."],
            ["…rest", "SVGProps", "—", "Any other SVG attribute (className, style, onClick, ref, …) is forwarded to the <svg>."],
          ].map(([prop, type, def, desc]) => (
            <div key={prop} style={{ display: "grid", gridTemplateColumns: "minmax(110px, 0.8fr) minmax(120px, 1fr) 80px 2fr", gap: "var(--space-3)", alignItems: "start", padding: "10px 12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-surface)" }}>
              <Code style={{ fontSize: 12 }}>{prop}</Code>
              <Code style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{type}</Code>
              <Text size="sm" tone="muted" style={{ fontFamily: "var(--font-mono)" }}>{def}</Text>
              <Text size="sm">{desc}</Text>
            </div>
          ))}
        </Stack>
      </Stack>

      {/* ── Notes ───────────────────────────────────────────────────────── */}
      <Stack as="section" gap={3}>
        <Heading level={2} id="notes">Notes</Heading>
        <Stack as="ul" gap={2} style={{ paddingInlineStart: "1.1em" }}>
          <Text as="li"><strong>Tree-shakeable.</strong> Only the icons you import are bundled — importing one icon does not pull in the whole set.</Text>
          <Text as="li"><strong>Server-Component safe.</strong> Icons are pure SVG with no hooks, so they render in React Server Components (and from the published package, which marks them RSC-safe).</Text>
          <Text as="li"><strong>Accessible by default.</strong> Decorative icons are <Code>aria-hidden</Code>; pass <Code>title</Code> (or wrap in a labelled control) when an icon conveys meaning on its own.</Text>
          <Text as="li"><strong>Gallery data.</strong> Build your own icon picker from the exported <Code>brandIcons</Code> array (<Code>{`{ name, label, slug, Icon }`}</Code>) and <Code>brandIconNames</Code>.</Text>
        </Stack>
      </Stack>

      <Text style={{ marginTop: "var(--space-4)", fontWeight: "var(--font-semibold)" }}>
        Next: <Link to="/components" style={linkStyle}>All components →</Link>
      </Text>
    </Stack>
  );
}
