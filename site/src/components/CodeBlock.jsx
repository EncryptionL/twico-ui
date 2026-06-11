import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Box, Button, useCopyToClipboard } from "twico-ui";
import { useCodeLang, toTs } from "./CodeLang.jsx";

export default function CodeBlock({ code, tsCode, language = "jsx" }) {
  const { copied, copy } = useCopyToClipboard();
  const { lang } = useCodeLang();
  const isTs = lang === "ts";
  // TS view: an explicit tsCode if given, otherwise the JS snippet with .jsx -> .tsx.
  const raw = isTs ? (tsCode != null ? tsCode : toTs(code)) : code;
  const source = String(raw || "").replace(/\n+$/, "");
  const hlLang = language === "jsx" || language === "tsx" ? (isTs ? "tsx" : "jsx") : language;

  return (
    <Box
      style={{
        position: "relative",
        background: "#0b1021",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        colorScheme: "dark", // the code surface is always dark — keep its scrollbar dark too
      }}
    >
      <Box style={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
        <Button size="sm" variant="soft" onClick={() => copy(source)} aria-label="Copy code">
          {copied ? "Copied!" : "Copy"}
        </Button>
      </Box>
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
  );
}
