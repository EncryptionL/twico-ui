import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Box, Button } from "twico-ui";

export default function CodeBlock({ code, language = "jsx" }) {
  const [copied, setCopied] = React.useState(false);
  const source = (code || "").replace(/\n+$/, "");

  function copy() {
    try {
      navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (e) {}
  }

  return (
    <Box
      style={{
        position: "relative",
        background: "#0b1021",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      <Box style={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
        <Button size="sm" variant="soft" onClick={copy} aria-label="Copy code">
          {copied ? "Copied!" : "Copy"}
        </Button>
      </Box>
      <Highlight code={source} language={language} theme={themes.nightOwl}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre style={{ ...style, background: "transparent", margin: 0, padding: "16px 20px", overflowX: "auto", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
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
