import React from "react";
import { Menu, Button } from "twico-ui";
import { ChevronDownIcon, CheckIcon } from "twico-ui/icons";

// Docs version switcher (navbar). Lets visitors read the docs for an older release.
//
// How it knows "which version am I?": each deploy is built with a distinct Vite `base`
// — the live site is "/twico-ui/", a frozen snapshot is "/twico-ui/v1.1/", etc. — so
// import.meta.env.BASE_URL tells us the current version without any server state.
//
// The option list comes from /versions.json (fetched relative to BASE_URL so it resolves
// on every snapshot). Picking another version is a full navigation to that version's base,
// preserving the in-page hash route so e.g. /#/components/button stays put across versions
// (a route that doesn't exist in the target version just falls back to its home).
const CURRENT_BASE = import.meta.env.BASE_URL || "/";

function labelForBase(base) {
  const m = String(base).match(/\/v(\d+(?:\.\d+)?)\/?$/);
  return m ? `v${m[1]}` : "Latest";
}

// Used before versions.json loads, and as a fallback if it can't be fetched.
const FALLBACK_ITEMS = [{ label: labelForBase(CURRENT_BASE), base: CURRENT_BASE, latest: CURRENT_BASE === "/twico-ui/" }];

const sameBase = (a, b) => a.replace(/\/+$/, "") === b.replace(/\/+$/, "");

export default function VersionSelector() {
  const [items, setItems] = React.useState(FALLBACK_ITEMS);

  React.useEffect(() => {
    let alive = true;
    fetch(`${CURRENT_BASE}versions.json`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data && Array.isArray(data.items) && data.items.length) setItems(data.items);
      })
      .catch(() => {/* keep fallback */});
    return () => { alive = false; };
  }, []);

  const current = items.find((it) => sameBase(it.base, CURRENT_BASE)) || items[0];
  const currentLabel = current ? current.label : labelForBase(CURRENT_BASE);

  const go = (item) => {
    if (sameBase(item.base, CURRENT_BASE)) return;
    // Preserve the hash route (HashRouter) so the same page opens in the chosen version.
    window.location.href = item.base + window.location.hash;
  };

  const menuItems = [
    { label: "Documentation version", heading: true },
    ...items.map((it) => ({
      label: it.label + (it.latest ? "  ·  latest" : ""),
      icon: sameBase(it.base, CURRENT_BASE) ? <CheckIcon size={15} /> : <span style={{ width: 15, display: "inline-block" }} />,
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
