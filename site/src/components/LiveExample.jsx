import React from "react";
import { Box } from "twico-ui";
import ErrorBoundary from "./ErrorBoundary.jsx";
import CodeBlock from "./CodeBlock.jsx";

// A live, rendered preview (children) framed above its source code.
export default function LiveExample({ children, code, language = "jsx" }) {
  return (
    <Box>
      {children != null ? (
        <Box
          border
          radius="xl"
          style={{ background: "var(--color-surface)", padding: "28px 24px", marginBottom: 12, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "center", minHeight: 96, minWidth: 0, maxWidth: "100%", overflowX: "auto" }}
        >
          <ErrorBoundary>{children}</ErrorBoundary>
        </Box>
      ) : null}
      {code ? <CodeBlock code={code} language={language} /> : null}
    </Box>
  );
}
