// Fetches the brand-icon dataset (scripts/brand-icons.json) used by
// scripts/gen-brand-icons.mjs to generate src/brand-icons.tsx.
//
//   node scripts/fetch-brand-icons.mjs
//
// Each brand's single <path> is pulled from the Simple Icons project
// (https://simple-icons.org, path data licensed CC0-1.0) and baked into our source,
// so the shipped icons are self-hosted inline SVG — no runtime CDN (CLAUDE.md §4.2).
// Re-run this (then gen-brand-icons.mjs) only when adding/removing a brand or
// refreshing path data. Slugs that 404 (a brand removed from Simple Icons over a
// trademark request — e.g. linkedin, slack, openai) are skipped with a warning.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const BASE = "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons";

// [simple-icons slug, export base name]. The "Icon" suffix is added by the generator;
// a few names are made friendlier there (NextDotJs -> Nextjs, etc.).
const LIST = [
  ["github", "Github"], ["gitlab", "Gitlab"], ["x", "XTwitter"], ["discord", "Discord"],
  ["youtube", "Youtube"], ["facebook", "Facebook"], ["instagram", "Instagram"],
  ["figma", "Figma"], ["npm", "Npm"], ["google", "Google"], ["twitch", "Twitch"],
  ["dribbble", "Dribbble"], ["medium", "Medium"], ["reddit", "Reddit"], ["telegram", "Telegram"],
  ["stackoverflow", "StackOverflow"], ["whatsapp", "WhatsApp"], ["tiktok", "TikTok"],
  ["pinterest", "Pinterest"], ["spotify", "Spotify"], ["vercel", "Vercel"],
  ["nextdotjs", "NextDotJs"], ["react", "ReactBrand"], ["nodedotjs", "NodeDotJs"],
  ["tailwindcss", "TailwindCss"], ["typescript", "TypeScript"], ["docker", "Docker"],
  ["apple", "AppleBrand"], ["bluesky", "Bluesky"], ["mastodon", "Mastodon"], ["threads", "Threads"],
];

async function get(slug) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`${BASE}/${slug}.svg`);
      if (r.ok) return await r.text();
      if (r.status === 404) return null;
    } catch {
      /* retry */
    }
  }
  return null;
}

// Sanitization barrier for network-derived data before it is written to disk:
// an SVG path "d" may only contain path-command letters, digits, whitespace and
// the punctuation . , - + e E; titles are stripped to a safe printable charset.
const SVG_PATH_RE = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\-+eE\s]+$/;
const sanitizeTitle = (s) => s.replace(/[^\x20-\x7E]/g, "").trim();

const out = [];
for (const [slug, name] of LIST) {
  const svg = await get(slug);
  if (!svg) {
    console.warn("skip (not found):", slug);
    continue;
  }
  const title = sanitizeTitle((svg.match(/<title>([^<]*)<\/title>/) || [])[1] || name);
  const paths = [...svg.matchAll(/<path\s+d="([^"]+)"/g)].map((m) => m[1]);
  if (paths.length !== 1) console.warn("expected 1 path, got", paths.length, "for", slug);
  const d = paths[0] || "";
  if (!SVG_PATH_RE.test(d)) {
    console.warn("skip (invalid path data):", slug);
    continue;
  }
  out.push({ name, slug, title, d });
}

fs.writeFileSync(path.join(root, "scripts", "brand-icons.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`wrote scripts/brand-icons.json with ${out.length} brands`);
