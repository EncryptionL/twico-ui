import React from "react";
import { Stack, Button, useLocalStorage } from "twico-ui";

// Site-wide preference: show code blocks as JavaScript (.jsx) or TypeScript (.tsx).
// Persisted with Twico UI's own useLocalStorage hook.
const CodeLangContext = React.createContext({ lang: "ts", setLang: () => {} });

export function CodeLangProvider({ children }) {
  const [lang, setLang] = useLocalStorage("twico-code-lang", "ts");
  const value = React.useMemo(() => ({ lang: lang === "js" ? "js" : "ts", setLang }), [lang, setLang]);
  return <CodeLangContext.Provider value={value}>{children}</CodeLangContext.Provider>;
}

export function useCodeLang() {
  return React.useContext(CodeLangContext);
}

// Rewrite a JS-authored snippet to its TypeScript flavor (just the file extensions
// in path comments — the JSX itself is valid in both).
export function toTs(code) {
  return (code || "").replace(/\.jsx\b/g, ".tsx");
}

const OPTIONS = [
  ["js", "JS"],
  ["ts", "TS"],
];

export function CodeLangToggle() {
  const { lang, setLang } = useCodeLang();
  return (
    <Stack direction="row" gap={1} inline role="group" aria-label="Code language" style={{ background: "var(--color-surface-sunken)", borderRadius: "var(--radius-md)", padding: 3 }}>
      {OPTIONS.map(([v, label]) => (
        <Button key={v} size="sm" variant={lang === v ? "soft" : "ghost"} onClick={() => setLang(v)} aria-pressed={lang === v}>
          {label}
        </Button>
      ))}
    </Stack>
  );
}
