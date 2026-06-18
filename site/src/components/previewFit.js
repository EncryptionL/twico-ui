import React from "react";

// Live-preview sizing: constrain every direct demo element to the preview width so a
// wide demo (e.g. a many-column Datatable or a Kanban board) shrinks to the card and
// scrolls INTERNALLY — never forcing an outer horizontal scrollbar or spilling past the
// card. Flex items default to `min-width: auto` (= min-content), which otherwise refuses
// to shrink below the content width; `min-width: 0` releases that so the component's own
// `overflow:auto` region takes over. Scoped to a `data-twc-preview` attribute (no class
// names, per the site's conventions); injected once.
const ID = "twc-doc-preview";
const CSS = "[data-twc-preview] > * { min-width: 0; max-width: 100%; }";

export function usePreviewFit() {
  React.useInsertionEffect(() => {
    if (typeof document === "undefined" || document.getElementById(ID)) return;
    const el = document.createElement("style");
    el.id = ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}
