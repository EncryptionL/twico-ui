export const GROUP_ORDER = [
  "Buttons & actions",
  "Inputs",
  "Data display",
  "Navigation",
  "Overlay",
  "Feedback",
];

export const GETTING_STARTED = [
  { to: "/docs/installation", label: "Installation" },
  { to: "/docs/theming", label: "Theming" },
  { to: "/docs/dark-mode", label: "Dark mode" },
  { to: "/docs/accessibility", label: "Accessibility" },
];

export const REPO_URL = "https://github.com/EncryptionL/twico-ui";
export const NPM_URL = "https://www.npmjs.com/package/twico-ui";
export const CHANGELOG_URL = "https://github.com/EncryptionL/twico-ui/releases";

export const slugify = (name) => name.toLowerCase();

export function groupedComponents(components) {
  const map = new Map(GROUP_ORDER.map((g) => [g, []]));
  for (const c of components) {
    if (!map.has(c.group)) map.set(c.group, []);
    map.get(c.group).push(c);
  }
  for (const list of map.values()) list.sort((a, b) => a.name.localeCompare(b.name));
  return [...map.entries()].filter(([, list]) => list.length);
}
