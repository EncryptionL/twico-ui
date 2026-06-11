import React from "react";
import { useLocalStorage } from "twico-ui";

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
