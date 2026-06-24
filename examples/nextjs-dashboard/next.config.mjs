import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This example lives inside the twico-ui repo (which has its own lockfile), so
  // pin the file-tracing root to this app to silence the "multiple lockfiles" warning.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
};

export default nextConfig;
