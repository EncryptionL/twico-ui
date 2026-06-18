import React from "react";
import { Box } from "twico-ui";
import ErrorBoundary from "./ErrorBoundary.jsx";
import CodeBlock from "./CodeBlock.jsx";
import { usePreviewFit } from "./previewFit.js";

// A live, rendered preview (children) framed above its source code.
export default function LiveExample({ children, code, language = "jsx" }) {
  usePreviewFit();
  return (
    <Box>
      {children != null ? (
        <Box
          border
          radius="xl"
          style={{ background: "var(--color-surface)", padding: "28px 24px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "safe center", minHeight: 96, minWidth: 0, maxWidth: "100%" }}
        >
          {/* The content row carries the gap so multi-element examples (e.g. several buttons) are
              evenly spaced — ErrorBoundary passes children through with no DOM node, so the rendered
              elements are direct flex children here. `data-twc-preview` (see previewFit.js) sets
              min-width:0 + max-width:100% on each child so a wide demo (e.g. a many-column Datatable)
              shrinks to the card and scrolls INTERNALLY instead of forcing an outer scrollbar. */}
          <Box data-twc-preview style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "safe center", minWidth: 0, maxWidth: "100%", width: "100%" }}>
            <ErrorBoundary>{children}</ErrorBoundary>
          </Box>
        </Box>
      ) : null}
      {code ? <CodeBlock code={code} language={language} /> : null}
    </Box>
  );
}
