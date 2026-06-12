import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Box, Stack, Button, useCopyToClipboard } from "twico-ui";
import { useCodeLang, toTs } from "./CodeLang.jsx";
import { EXPORT_NAMES } from "../data/exports.js";

// Split a snippet into its leading import lines and the rest of the body.
function splitImports(code) {
  const lines = code.split("\n");
  let i = 0;
  while (i < lines.length && (/^\s*import\s/.test(lines[i]) || (i > 0 && lines[i].trim() === "" && /^\s*import\s/.test(lines[i - 1] || "")))) {
    i++;
  }
  return {
    imports: lines.slice(0, i).join("\n").trim(),
    body: lines.slice(i).join("\n").replace(/^\n+/, ""),
  };
}

// Derive the `import { … } from "twico-ui"` line for a body that has none.
function deriveImport(body) {
  const used = EXPORT_NAMES.filter((name) =>
    name.startsWith("use") ? new RegExp(`\\b${name}\\b`).test(body) : new RegExp(`<${name}[\\s/>]`).test(body)
  );
  const out = [];
  if (/\bReact\.|\buseState\b|\buseEffect\b|\buseRef\b/.test(body)) out.push('import React from "react";');
  if (used.length) out.push(`import { ${used.join(", ")} } from "twico-ui";`);
  return out.join("\n");
}

function SegToggle({ lang, setLang }) {
  const seg = (val, label) => {
    const active = lang === val;
    return (
      <button
        type="button"
        onClick={() => setLang(val)}
        aria-pressed={active}
        style={{
          appearance: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-xs)",
          fontWeight: active ? "var(--font-bold)" : "var(--font-medium)",
          letterSpacing: "0.02em",
          padding: "5px 14px",
          borderRadius: "var(--radius-sm)",
          background: active ? "var(--color-primary)" : "transparent",
          color: active ? "var(--color-primary-fg)" : "var(--color-text-subtle)",
          boxShadow: active ? "var(--shadow-sm)" : "none",
          transition: "background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)",
        }}
      >
        {label}
      </button>
    );
  };
  return (
    <span
      role="group"
      aria-label="Code language"
      style={{ display: "inline-flex", gap: 2, background: "var(--color-surface-sunken)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: 3 }}
    >
      {seg("js", "JS")}
      {seg("ts", "TS")}
    </span>
  );
}

export default function CodeBlock({ code, tsCode, language = "jsx" }) {
  const { lang, setLang } = useCodeLang();
  const { copied, copy } = useCopyToClipboard();
  const [expanded, setExpanded] = React.useState(false);
  const isTs = lang === "ts";
  const isJsx = language === "jsx" || language === "tsx";

  const raw = isTs ? (tsCode != null ? tsCode : toTs(code)) : code;
  const full0 = String(raw || "").replace(/\n+$/, "");

  const { imports, body } = splitImports(full0);
  const hasImports = imports.length > 0;
  const derived = isJsx && !hasImports && body.trim() ? deriveImport(body) : "";
  const shortCode = isJsx && body.trim() ? body : full0;
  const fullCode = hasImports ? full0 : derived ? `${derived}\n\n${body}` : full0;
  const expandable = isJsx && fullCode.trim() !== shortCode.trim();

  const source = expandable && expanded ? fullCode : shortCode;
  const hlLang = isJsx ? (isTs ? "tsx" : "jsx") : language;

  return (
    <Box style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      {isJsx ? (
        <Stack direction="row" justify="space-between" align="center" gap={2} style={{ padding: "6px 8px 6px 10px", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
          <SegToggle lang={lang} setLang={setLang} />
          <Stack direction="row" gap={1} align="center">
            {expandable ? (
              <Button size="sm" variant="ghost" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
                {expanded ? "Collapse code" : "Expand code"}
              </Button>
            ) : null}
            <Button size="sm" variant="soft" onClick={() => copy(source)} aria-label="Copy code">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </Stack>
        </Stack>
      ) : null}
      <Box style={{ position: "relative", background: "#0b1021", colorScheme: "dark" }}>
        {!isJsx ? (
          <Box style={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
            <Button size="sm" variant="soft" onClick={() => copy(source)} aria-label="Copy code">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </Box>
        ) : null}
        <Highlight code={source} language={hlLang} theme={themes.nightOwl}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre style={{ ...style, background: "transparent", margin: 0, padding: "16px 20px", overflowX: "auto", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
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
