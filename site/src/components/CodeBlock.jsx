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

const REACT_HOOKS = [
  "useState", "useEffect", "useRef", "useMemo", "useCallback",
  "useReducer", "useLayoutEffect", "useId", "useTransition", "useDeferredValue",
];

// Build the import lines the *expanded* view should show so the copied code is
// actually runnable:
//  - a React import when the body uses React.* (default import) or bare hooks
//    (named import) — UNLESS the body already imports from "react";
//  - the snippet's own existing imports (e.g. its `twico-ui` line);
//  - a derived `import { … } from "twico-ui"` only when the body references Twico
//    exports and provided none of its own.
// (Previously the React import was only added when a snippet had NO imports at all,
// so every stateful snippet that shipped its own twico-ui line silently lost it.)
function buildImports(existing, body) {
  const lines = [];
  if (!/from\s+["']react["']/.test(existing)) {
    if (/\bReact\./.test(body)) {
      lines.push('import React from "react";');
    } else {
      const hooks = REACT_HOOKS.filter((h) => new RegExp(`\\b${h}\\b`).test(body));
      if (hooks.length) lines.push(`import { ${hooks.join(", ")} } from "react";`);
    }
  }
  // Every Twico export the body actually references.
  const used = EXPORT_NAMES.filter((name) =>
    name.startsWith("use") ? new RegExp(`\\b${name}\\b`).test(body) : new RegExp(`<${name}[\\s/>]`).test(body)
  );
  // Merge `used` into the snippet's existing twico-ui import (so a partial import —
  // e.g. only Card while the body also renders <Button/> — is completed), or add a
  // fresh import line when the snippet provided none.
  const twicoRe = /import\s*\{([^}]*)\}\s*from\s*["']twico-ui["'];?/;
  if (twicoRe.test(existing)) {
    lines.push(
      existing.replace(twicoRe, (_full, names) => {
        const have = names.split(",").map((s) => s.trim()).filter(Boolean);
        const all = Array.from(new Set([...have, ...used]));
        return `import { ${all.join(", ")} } from "twico-ui";`;
      })
    );
  } else {
    if (existing) lines.push(existing);
    if (used.length) lines.push(`import { ${used.join(", ")} } from "twico-ui";`);
  }
  return lines.join("\n");
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
  const fullImports = isJsx && body.trim() ? buildImports(imports, body) : imports;
  const shortCode = isJsx && body.trim() ? body : full0;
  const fullCode = fullImports ? `${fullImports}\n\n${body}` : full0;
  // A long snippet is collapsed to a fixed-height preview (with a fade) so "Expand"
  // is meaningful; short ones only toggle the leading import lines as before.
  const COLLAPSE_LINES = 16;
  const tall = isJsx && shortCode.split("\n").length > COLLAPSE_LINES;
  const expandable = isJsx && (fullCode.trim() !== shortCode.trim() || tall);
  const clamp = expandable && !expanded && tall;

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
      <Box style={{ position: "relative", background: "#0b1021", colorScheme: "dark", maxHeight: clamp ? 360 : undefined, overflow: clamp ? "hidden" : undefined }}>
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
        {clamp ? (
          // Fade + click-to-expand affordance so a long snippet reads as truncated.
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label="Expand code"
            style={{
              position: "absolute", left: 0, right: 0, bottom: 0, height: 96, width: "100%",
              border: "none", cursor: "pointer", display: "flex", alignItems: "flex-end",
              justifyContent: "center", padding: "0 0 10px",
              background: "linear-gradient(to bottom, rgba(11,16,33,0), rgba(11,16,33,0.85) 55%, #0b1021)",
              color: "var(--color-primary-fg)",
            }}
          >
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", fontWeight: "var(--font-bold)", letterSpacing: "0.02em", background: "var(--color-primary)", padding: "4px 12px", borderRadius: "var(--radius-full)", boxShadow: "var(--shadow-sm)" }}>
              Expand code
            </span>
          </button>
        ) : null}
      </Box>
    </Box>
  );
}
