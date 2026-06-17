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
  // The library lives one level up (../src, ../styles/fonts). Allow the dev
  // server to read it so the self-hosted fonts don't 403 during `npm run dev`.
  server: {
    fs: { allow: [".."] },
  },
  resolve: {
    // Array form so the more specific subpath alias is matched before the bare
    // package alias (order matters). `twico-ui/colors` dogfoods the real export.
    alias: [
      { find: "twico-ui/colors", replacement: fileURLToPath(new URL("../src/colors.ts", import.meta.url)) },
      { find: "twico-ui", replacement: fileURLToPath(new URL("../src/index.ts", import.meta.url)) },
    ],
  },
});
