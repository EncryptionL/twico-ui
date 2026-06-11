import React from "react";
import ErrorBoundary from "./ErrorBoundary.jsx";
import CodeBlock from "./CodeBlock.jsx";

// A live, rendered preview (children) framed above its source code.
export default function LiveExample({ children, code, language = "jsx" }) {
  return (
    <div className="docs-example">
      {children != null ? (
        <div className="docs-preview">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      ) : null}
      {code ? <CodeBlock code={code} language={language} /> : null}
    </div>
  );
}
