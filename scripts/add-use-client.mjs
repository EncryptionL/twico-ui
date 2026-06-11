// Prepends the `"use client";` directive to the built JS bundles.
//
// Why this exists: tsup/esbuild treats a `banner: { js: '"use client";' }` as a
// module-level directive and STRIPS it while bundling ("Module level directives
// cause errors when bundled ... was ignored"). Without the directive at the top
// of the entry, importing twico-ui into a Next.js App Router *Server* Component
// errors, because the components use hooks/refs/browser APIs. So we add it after
// the build instead.
//
// Sourcemaps: prepending one physical line shifts the code down by one, so we
// prefix each map's `mappings` with a single `;` (an empty first line) to keep
// it aligned.
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const DIRECTIVE = '"use client";\n';
const targets = ["dist/index.mjs", "dist/index.cjs"];

for (const file of targets) {
  if (!existsSync(file)) continue;

  const code = await readFile(file, "utf8");
  if (code.startsWith('"use client"')) continue; // idempotent

  await writeFile(file, DIRECTIVE + code);

  const mapFile = `${file}.map`;
  if (existsSync(mapFile)) {
    const map = JSON.parse(await readFile(mapFile, "utf8"));
    if (typeof map.mappings === "string") {
      map.mappings = ";" + map.mappings; // shift mappings down one line
      await writeFile(mapFile, JSON.stringify(map));
    }
  }
}

console.log('✓ prepended "use client" to dist bundles');
