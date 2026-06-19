import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// The docs site dogfoods Twico UI: `import { X } from "twico-ui"` resolves to the
// library source in this same repo, so the docs always reflect the latest code and
// the example import statements match exactly what consumers write.
export default defineConfig({
  // Served from https://encryptionl.github.io/twico-ui/ on GitHub Pages.
  base: "/twico-ui/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split the eagerly-loaded bundle so no single chunk trips Vite's 500 kB
        // warning (the docs SPA pulls in the whole library + the component-reference
        // data up front). Third-party vendor, the dogfooded library source, and the
        // large components.js data each get their own chunk.
        manualChunks(id) {
          const n = id.replace(/\\/g, "/");
          if (n.includes("/node_modules/")) {
            if (n.includes("prism-react-renderer")) return "prism";
            if (n.includes("/react-router")) return "react-router";
            return "vendor";
          }
          if (n.includes("/site/src/data/components.js")) return "doc-data";
          if (!n.includes("/site/") && (/\/(components|hooks)\//.test(n) || /\/src\/(index|colors)\.ts/.test(n))) return "twico-ui";
        },
      },
    },
  },
  // The library lives one level up (../src, ../styles/fonts). Allow the dev
  // server to read it so the self-hosted fonts don't 403 during `npm run dev`.
  server: {
    fs: { allow: [".."] },
  },
  resolve: {
    // The dogfooded library source lives one level up (../components/*.jsx) and does
    // `import React from "react"`. Without dedupe, Vite resolves that to the REPO-ROOT
    // node_modules/react (the library's own React 18), giving the page two React copies
    // and a null hooks dispatcher ("Cannot read properties of null (reading 'useState')").
    // Force every react/react-dom import to the site's single (React 19) copy.
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
    // Array form so the more specific subpath alias is matched before the bare
    // package alias (order matters). `twico-ui/colors` dogfoods the real export.
    alias: [
      { find: "twico-ui/colors", replacement: fileURLToPath(new URL("../src/colors.ts", import.meta.url)) },
      { find: "twico-ui", replacement: fileURLToPath(new URL("../src/index.ts", import.meta.url)) },
    ],
  },
});
