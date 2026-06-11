import React from "react";
import { Highlight, themes } from "prism-react-renderer";

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
    <div className="docs-code">
      <button type="button" className="docs-code__copy" onClick={copy} aria-label="Copy code">
        {copied ? "Copied!" : "Copy"}
      </button>
      <Highlight code={source} language={language} theme={themes.nightOwl}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ ...style, background: "transparent", margin: 0 }}>
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
    </div>
  );
}
