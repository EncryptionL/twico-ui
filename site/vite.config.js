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
  resolve: {
    alias: {
      "twico-ui": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
    },
  },
});
