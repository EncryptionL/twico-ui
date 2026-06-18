export const GROUP_ORDER = [
  "Buttons & actions",
  "Layout",
  "Typography",
  "Inputs",
  "Data display",
  "Navigation",
  "Overlay",
  "Feedback",
];

export const GETTING_STARTED = [
  { to: "/docs/installation", label: "Installation" },
  { to: "/docs/theming", label: "Theming" },
  { to: "/docs/colors", label: "Colors" },
  { to: "/theme-builder", label: "Theme builder" },
  { to: "/docs/dark-mode", label: "Dark mode" },
  { to: "/docs/accessibility", label: "Accessibility" },
  { to: "/docs/hooks", label: "Hooks" },
  { to: "/playground", label: "Playground" },
];

export const REPO_URL = "https://github.com/EncryptionL/twico-ui";
export const NPM_URL = "https://www.npmjs.com/package/twico-ui";
export const CHANGELOG_URL = "https://github.com/EncryptionL/twico-ui/releases";

// Lowercase + collapse any non-alphanumeric run to a single hyphen, so headings get
// valid anchor ids (e.g. "Buttons & actions" -> "buttons-actions"). Component names are
// single alphanumeric words, so their route slugs are unchanged.
export const slugify = (name) =>
  String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function groupedComponents(components) {
  const map = new Map(GROUP_ORDER.map((g) => [g, []]));
  for (const c of components) {
    if (!map.has(c.group)) map.set(c.group, []);
    map.get(c.group).push(c);
  }
  for (const list of map.values()) list.sort((a, b) => a.name.localeCompare(b.name));
  return [...map.entries()].filter(([, list]) => list.length);
}
