import { defineConfig } from "vitest/config";

// Unit tests run against the component SOURCE (components/**/*.jsx) and hooks,
// not the built bundle — fast feedback, no build step. JSX uses the automatic
// runtime so test files don't need to import React.
export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.js"],
    include: ["tests/**/*.test.{js,jsx}"],
    css: false,
  },
});
