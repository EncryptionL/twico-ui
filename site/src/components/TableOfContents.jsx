import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Text } from "twico-ui";

const HEADER_OFFSET = 84;

// MUI-style "on this page" navigation: lists the h2/h3 anchors in the current
// article, scrolls to them (offsetting the sticky header), and highlights the
// section in view. Built entirely from Twico components + inline styles.
export default function TableOfContents() {
  const location = useLocation();
  const [items, setItems] = React.useState([]);
  const [active, setActive] = React.useState("");

  React.useEffect(() => {
    const scope = document.getElementById("doc-article");
    if (!scope) return;
    let raf = 0;
    const scan = () => {
      const hs = Array.from(scope.querySelectorAll("h2[id], h3[id]"));
      setItems((prev) => {
        const next = hs.map((h) => ({ id: h.id, text: (h.textContent || "").trim(), level: Number(h.tagName[1]) }));
        // Avoid needless re-renders when nothing changed.
        if (prev.length === next.length && prev.every((p, i) => p.id === next[i].id && p.text === next[i].text)) return prev;
        return next;
      });
    };
    scan();
    // The Variations section (and other content) loads lazily, so its h3 headings
    // appear after the first scan — re-scan whenever the article subtree changes.
    const obs = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });
    obs.observe(scope, { childList: true, subtree: true });
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  React.useEffect(() => {
    if (!items.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -68% 0px" }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  function go(e, id) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET, behavior: "smooth" });
    setActive(id);
  }

  if (items.length < 2) return null;

  return (
    <Box
      as="nav"
      aria-label="On this page"
      style={{ width: 220, flex: "none", position: "sticky", top: 64, alignSelf: "flex-start", maxHeight: "calc(100vh - 64px)", overflowY: "auto", paddingTop: 4 }}
    >
      <Text as="div" size="xs" weight="bold" tone="subtle" style={{ textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
        On this page
      </Text>
      <Box as="ul" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", borderLeft: "1px solid var(--color-border)" }}>
        {items.map((it) => {
          const on = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={"#" + it.id}
                onClick={(e) => go(e, it.id)}
                style={{
                  display: "block",
                  padding: it.level === 3 ? "5px 12px 5px 26px" : "5px 12px",
                  marginLeft: -1,
                  borderLeft: "2px solid " + (on ? "var(--color-primary)" : "transparent"),
                  color: on ? "var(--color-primary)" : "var(--color-text-muted)",
                  fontSize: "var(--text-sm)",
                  fontWeight: on ? "var(--font-semibold)" : "var(--font-normal)",
                  textDecoration: "none",
                  lineHeight: 1.4,
                }}
              >
                {it.text}
              </a>
            </li>
          );
        })}
      </Box>
    </Box>
  );
}
