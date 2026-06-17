import React from "react";
import { useNavigate } from "react-router-dom";
import { CommandPalette, Button, IconButton, useDisclosure, useEventListener, useMediaQuery } from "twico-ui";
import { components } from "../data/components.js";
import { VARIATIONS } from "../data/variations.js";
import { slugify } from "../data/site.js";

const SearchIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const DOC_CMDS = [
  { group: "Getting started", label: "Installation", keywords: "install setup npm yarn pnpm vite cra next.js getting started", to: "/docs/installation" },
  { group: "Getting started", label: "Theming", keywords: "tokens css variables colors radius shadow font rebrand theme", to: "/docs/theming" },
  { group: "Getting started", label: "Colors", keywords: "color palette hue shade hex indigo slate emerald amber rose sky primary success warning danger info swatch twico-ui/colors import", to: "/docs/colors" },
  { group: "Getting started", label: "Theme builder", keywords: "theme builder brand color radius density rtl live preview export customize", to: "/theme-builder" },
  { group: "Getting started", label: "Playground", keywords: "playground props knobs interactive try live", to: "/playground" },
  { group: "Getting started", label: "Dark mode", keywords: "dark light theme toggle usecolorscheme prefers color scheme", to: "/docs/dark-mode" },
  { group: "Getting started", label: "Accessibility", keywords: "a11y aria keyboard focus trap reduced motion screen reader", to: "/docs/accessibility" },
  { group: "Getting started", label: "Hooks", keywords: "hooks usemediaquery usedisclosure usecolorscheme uselocalstorage usecopytoclipboard", to: "/docs/hooks" },
  { group: "Getting started", label: "All components", keywords: "components index browse list all", to: "/components" },
];

// Full-text search over every component (name + tagline + summary + group) and the
// docs pages, surfaced through Twico UI's own CommandPalette. Opens on Cmd/Ctrl+K.
export default function Search() {
  const navigate = useNavigate();
  const { open, onOpen, onClose } = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 859px)");

  useEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && String(e.key).toLowerCase() === "k") {
      e.preventDefault();
      onOpen();
    }
  });

  const commands = React.useMemo(() => {
    const go = (to) => {
      navigate(to);
      onClose();
    };
    const docs = DOC_CMDS.map((d) => ({ group: d.group, label: d.label, keywords: d.keywords, onSelect: () => go(d.to) }));
    const comps = components.map((c) => ({
      group: c.group,
      label: c.name,
      description: c.tagline,
      // Index prop names too, so searching "fullWidth" or "stickyHeader" finds the component.
      keywords: `${c.tagline} ${c.summary} ${c.group} ${(c.propsRows || []).map((p) => p.prop).join(" ")}`,
      onSelect: () => go(`/components/${slugify(c.name)}`),
    }));
    // Index each live "Variations" example, deep-linking to its anchor on the page.
    const byName = new Map(components.map((c) => [c.name, c]));
    const variations = VARIATIONS.filter((v) => byName.has(v.component)).map((v) => {
      const slug = slugify(v.component);
      return {
        group: "Examples",
        label: `${v.component}: ${v.title}`,
        description: "Live example",
        keywords: `${v.component} ${v.title} ${byName.get(v.component).group} example variation demo`,
        onSelect: () => go(`/components/${slug}?s=variation-${v.i}`),
      };
    });
    return [...docs, ...comps, ...variations];
  }, [navigate, onClose]);

  return (
    <>
      {isMobile ? (
        <IconButton variant="ghost" aria-label="Search" icon={SearchIcon} onClick={onOpen} />
      ) : (
        <Button
          variant="outline"
          size="sm"
          leftIcon={SearchIcon}
          onClick={onOpen}
          aria-label="Search (Ctrl or Cmd + K)"
          style={{ minWidth: 188, justifyContent: "flex-start", color: "var(--color-text-muted)", fontWeight: "var(--font-medium)" }}
        >
          <span style={{ flex: 1, textAlign: "left" }}>Search…</span>
          <span style={{ marginLeft: 12, fontSize: "0.82em", opacity: 0.7, fontVariant: "all-small-caps" }}>Ctrl K</span>
        </Button>
      )}
      <CommandPalette
        open={open}
        onClose={onClose}
        commands={commands}
        placeholder="Search components, hooks, and docs…"
        emptyText="No matches found"
      />
    </>
  );
}
