// One-off: registers the layout/typography primitives in the docs component
// reference (src/data/components.js). Idempotent — re-running replaces them.
import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(here, "../src/data/components.js");
const mod = await import(pathToFileURL(dataPath).href);

const NEW = [
  {
    name: "Box", slug: "box", group: "Layout", importName: "Box",
    summary: "Generic, token-styled box — the building block for non-flex layout (padding, margin, background, border, radius, shadow) without writing CSS.",
    propsRows: [
      { prop: "p, px, py, pt, pr, pb, pl", type: "number | string", required: false, default: "—", description: "Padding — a spacing step (number) or any CSS length." },
      { prop: "m, mx, my, mt, mr, mb, ml", type: "number | string", required: false, default: "—", description: "Margin — a spacing step or any CSS length." },
      { prop: "bg", type: '"surface" | "surface-raised" | "surface-sunken" | "bg" | string', required: false, default: "—", description: "Background (surface token name or CSS)." },
      { prop: "border", type: "boolean", required: false, default: "false", description: "Add a 1px token border." },
      { prop: "radius", type: "string", required: false, default: "—", description: "Border-radius token suffix (e.g. \"lg\")." },
      { prop: "shadow", type: "string", required: false, default: "—", description: "Box-shadow token suffix (e.g. \"md\")." },
      { prop: "as", type: "ElementType", required: false, default: '"div"', description: "Element/tag to render." },
    ],
    snippet: 'import { Box } from "twico-ui";\n\n<Box p={4} bg="surface" border radius="lg" shadow="sm">\n  Padded, bordered surface.\n</Box>',
  },
  {
    name: "Stack", slug: "stack", group: "Layout", importName: "Stack",
    summary: "Flexbox layout primitive — arranges children in a row or column with token-based gaps. Reach for it instead of hand-written flex divs.",
    propsRows: [
      { prop: "direction", type: '"row" | "column"', required: false, default: '"column"', description: "Main-axis direction." },
      { prop: "gap", type: "number | string", required: false, default: "4", description: "Gap as a spacing step (number → --space-*) or any CSS length." },
      { prop: "align", type: "string", required: false, default: "—", description: "align-items value." },
      { prop: "justify", type: "string", required: false, default: "—", description: "justify-content value." },
      { prop: "wrap", type: "boolean", required: false, default: "false", description: "Wrap children onto multiple lines." },
      { prop: "inline", type: "boolean", required: false, default: "false", description: "Use inline-flex instead of flex." },
      { prop: "as", type: "ElementType", required: false, default: '"div"', description: "Element/tag to render." },
    ],
    snippet: 'import { Stack } from "twico-ui";\n\n<Stack direction="row" gap={3} align="center" wrap>\n  <Button>Save</Button>\n  <Button variant="ghost">Cancel</Button>\n</Stack>',
  },
  {
    name: "Grid", slug: "grid", group: "Layout", importName: "Grid",
    summary: "CSS grid primitive — a responsive auto-fill grid (minChildWidth) or a fixed column count (columns).",
    propsRows: [
      { prop: "minChildWidth", type: "number | string", required: false, default: "—", description: "Responsive auto-fill: minimum child width (number = px)." },
      { prop: "columns", type: "number", required: false, default: "—", description: "Fixed column count (when minChildWidth is unset)." },
      { prop: "gap", type: "number | string", required: false, default: "4", description: "Gap as a spacing step or CSS length." },
      { prop: "align", type: "string", required: false, default: "—", description: "align-items value." },
      { prop: "justify", type: "string", required: false, default: "—", description: "justify-items value." },
      { prop: "as", type: "ElementType", required: false, default: '"div"', description: "Element/tag to render." },
    ],
    snippet: 'import { Grid, Card } from "twico-ui";\n\n<Grid minChildWidth={220} gap={4}>\n  <Card>One</Card>\n  <Card>Two</Card>\n  <Card>Three</Card>\n</Grid>',
  },
  {
    name: "Container", slug: "container", group: "Layout", importName: "Container",
    summary: "Centers content and caps its width with responsive horizontal padding — the outer wrapper for a page or section.",
    propsRows: [
      { prop: "size", type: '"sm" | "md" | "lg" | "xl" | "full" | string', required: false, default: '"lg"', description: "Max width (named token or any CSS length)." },
      { prop: "padded", type: "boolean", required: false, default: "true", description: "Apply horizontal padding." },
      { prop: "as", type: "ElementType", required: false, default: '"div"', description: "Element/tag to render." },
    ],
    snippet: 'import { Container, Heading } from "twico-ui";\n\n<Container size="lg">\n  <Heading level={1}>Page title</Heading>\n</Container>',
  },
  {
    name: "Heading", slug: "heading", group: "Typography", importName: "Heading",
    summary: "Heading (h1–h6) with consistent token typography. Use it instead of bare heading tags.",
    propsRows: [
      { prop: "level", type: "1 | 2 | 3 | 4 | 5 | 6", required: false, default: "2", description: "Sets the rendered tag and the default size." },
      { prop: "size", type: "string", required: false, default: "—", description: "Override the font-size token suffix (e.g. \"3xl\")." },
      { prop: "align", type: "string", required: false, default: "—", description: "text-align value." },
      { prop: "as", type: "ElementType", required: false, default: "—", description: "Override the tag while keeping the level's size." },
    ],
    snippet: 'import { Heading } from "twico-ui";\n\n<Heading level={1}>Dashboard</Heading>\n<Heading level={3}>Recent activity</Heading>',
  },
  {
    name: "Text", slug: "text", group: "Typography", importName: "Text",
    summary: "Body text with token sizes and semantic color tones. Use it instead of bare paragraph/span tags.",
    propsRows: [
      { prop: "size", type: '"xs" | "sm" | "base" | "lg" | "xl"', required: false, default: '"base"', description: "Font-size token suffix." },
      { prop: "tone", type: '"default" | "muted" | "subtle" | "primary" | "danger"', required: false, default: '"default"', description: "Semantic color." },
      { prop: "weight", type: "string", required: false, default: "—", description: "Font-weight token suffix (e.g. \"semibold\")." },
      { prop: "align", type: "string", required: false, default: "—", description: "text-align value." },
      { prop: "as", type: "ElementType", required: false, default: '"p"', description: "Element/tag to render." },
    ],
    snippet: 'import { Text } from "twico-ui";\n\n<Text>Default paragraph text.</Text>\n<Text size="sm" tone="muted">A muted caption.</Text>',
  },
  {
    name: "Code", slug: "code", group: "Typography", importName: "Code",
    summary: "Inline code with a mono font and a subtle token-styled surface — use it instead of a bare code tag.",
    propsRows: [
      { prop: "as", type: "ElementType", required: false, default: '"code"', description: "Element/tag to render." },
      { prop: "children", type: "ReactNode", required: false, default: "—", description: "The inline code text." },
    ],
    snippet: 'import { Code, Text } from "twico-ui";\n\n<Text>Install with <Code>npm install twico-ui</Code>.</Text>',
  },
];

const names = new Set(NEW.map((n) => n.name));
const comps = [...mod.components].filter((c) => !names.has(c.name)).concat(NEW);
comps.sort((a, b) => a.name.localeCompare(b.name));

const out =
  "// AUTO-GENERATED by scripts/gen-docs.mjs from the twico-docs-extract workflow — do not edit by hand.\n" +
  "export const components = " +
  JSON.stringify(comps, null, 2) +
  ";\n";
await writeFile(dataPath, out);
console.log(`Registered ${NEW.length} primitives; ${comps.length} components total.`);
