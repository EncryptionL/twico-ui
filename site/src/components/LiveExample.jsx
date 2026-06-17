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
          style={{ background: "var(--color-surface)", padding: "28px 24px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 96, minWidth: 0, maxWidth: "100%", overflowX: "auto" }}
        >
          {/* The content row carries the gap so multi-element examples (e.g. several buttons) are
              evenly spaced — ErrorBoundary passes children through with no DOM node, so the rendered
              elements are direct flex children here. min-width:0 + max-width:100% still let a wide
              demo (e.g. a many-column Datatable) shrink to the card and scroll INTERNALLY. */}
          <Box style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "center", minWidth: 0, maxWidth: "100%" }}>
            <ErrorBoundary>{children}</ErrorBoundary>
          </Box>
        </Box>
      ) : null}
      {code ? <CodeBlock code={code} language={language} /> : null}
    </Box>
  );
}
