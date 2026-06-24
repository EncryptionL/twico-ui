import React from "react";
import { Menu, Button } from "twico-ui";
import { ChevronDownIcon, CheckIcon } from "twico-ui/icons";

// Docs version switcher (navbar). Lets visitors read the docs for an older release.
//
// The current version is read from the URL PATH (not the build-time base), so the label
// always matches the version you're viewing and stays consistent with the standalone
// switcher injected into archived snapshots. Options come from /versions.json. Picking a
// version is a full navigation to that version's base, preserving the in-page hash route.
//
// IMPORTANT: version-specific *content* only exists on the DEPLOYED site, where each
// version is a separate build served under its own path (/twico-ui/v1.1/, …, built from
// that release's git tag). A local `npm run dev` / `npm run preview` is a SINGLE (latest)
// build, so locally every path shows the latest content — the per-version difference
// (e.g. AppShell missing from v1.0) only appears once deployed by deploy-docs.yml.
const PATH = typeof window !== "undefined" ? window.location.pathname : import.meta.env.BASE_URL || "/";
const strip = (s) => String(s).replace(/\/+$/, "");

function labelForPath(path) {
  const m = String(path).match(/\/v(\d+(?:\.\d+)?)(?:\/|$)/);
  return m ? `v${m[1]}` : "Latest";
}

// Longest base that prefixes the current path wins (so "/twico-ui/v1.1/" beats "/twico-ui/").
function findCurrent(items, path) {
  const p = strip(path);
  let best = null;
  for (const it of items) {
    const b = strip(it.base);
    if ((p === b || p.startsWith(b + "/")) && (!best || b.length > strip(best.base).length)) best = it;
  }
  return best;
}

// Before /versions.json loads, show just the current version (derived from the path).
const FALLBACK_ITEMS = [{ label: labelForPath(PATH), base: strip(PATH) + "/", latest: !/\/v\d/.test(PATH) }];

export default function VersionSelector() {
  const [items, setItems] = React.useState(FALLBACK_ITEMS);

  React.useEffect(() => {
    let alive = true;
    // versions.json is published at the Pages root; fetch it relative to the build base.
    fetch(`${import.meta.env.BASE_URL || "/"}versions.json`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data && Array.isArray(data.items) && data.items.length) setItems(data.items);
      })
      .catch(() => {/* keep fallback */});
    return () => { alive = false; };
  }, []);

  const current = findCurrent(items, PATH);
  const currentLabel = current ? current.label : labelForPath(PATH);
  const isCurrent = (it) => current && strip(it.base) === strip(current.base);

  const go = (item) => {
    if (isCurrent(item)) return;
    // Preserve the hash route (HashRouter) so the same page opens in the chosen version.
    window.location.href = item.base + window.location.hash;
  };

  const menuItems = [
    { label: "Documentation version", heading: true },
    ...items.map((it) => ({
      // The "Latest" entry shows the actual version it points at (e.g. "v1.3 · latest")
      // rather than a redundant "Latest · latest".
      label: it.latest ? `${it.version || it.label}  ·  latest` : it.label,
      icon: isCurrent(it) ? <CheckIcon size={15} /> : <span style={{ width: 15, display: "inline-block" }} />,
      onClick: () => go(it),
    })),
  ];

  return (
    <Menu
      align="end"
      width={200}
      trigger={
        <Button
          variant="outline"
          size="sm"
          aria-label={`Documentation version: ${currentLabel}. Change version`}
          rightIcon={<ChevronDownIcon size={15} />}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {currentLabel}
        </Button>
      }
      items={menuItems}
    />
  );
}
