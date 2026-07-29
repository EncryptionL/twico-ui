import React from "react";
import { Stack, Text } from "twico-ui";
import LiveExample from "./LiveExample.jsx";
import AnchorHeading from "./AnchorHeading.jsx";

// Per-component variation files live at src/demos/<Name>Variations.jsx and default-
// export an array of { title, description?, code, render }. They are loaded lazily.
const loaders = import.meta.glob("../demos/*Variations.jsx");

// Render a heavy demo only once it scrolls near the viewport. A page like Datatable has ~12
// variation demos, each a full grid; rendering them all synchronously in one commit starved the
// lazily-Suspended Usage demo above them from ever committing (it stayed "Loading preview…"). Gating
// each demo on visibility keeps the initial commit light so Usage resolves, and speeds up every
// many-variation page. The heading/description render eagerly (outside this), so the on-this-page TOC
// and deep links still work — scrolling to a section reveals its demo. SSR / no-IntersectionObserver
// falls back to rendering immediately.
function DeferOnVisible({ children, minHeight = 140 }) {
  const ref = React.useRef(null);
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShow(true); return undefined; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setShow(true); io.disconnect(); }
    }, { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} style={show ? undefined : { minHeight }}>{show ? children : null}</div>;
}
const cache = {};
function loaderFor(name) {
  if (name in cache) return cache[name];
  const match = Object.keys(loaders).find((p) => p.endsWith(`/${name}Variations.jsx`));
  cache[name] = match ? loaders[match] : null;
  return cache[name];
}

export default function Variations({ name, slug }) {
  const loader = loaderFor(name);
  const [items, setItems] = React.useState(null);

  React.useEffect(() => {
    if (!loader) return undefined;
    let alive = true;
    setItems(null);
    loader().then((m) => { if (alive) setItems(m.default || []); }).catch(() => { if (alive) setItems([]); });
    return () => { alive = false; };
  }, [loader]);

  // Render the heading synchronously (when a file exists) so the on-this-page TOC
  // finds it even though the examples themselves load asynchronously.
  if (!loader) return null;

  return (
    <Stack as="section" gap={5}>
      <AnchorHeading slug={slug} section="variations">Variations</AnchorHeading>
      {items === null ? (
        <Text tone="muted">Loading examples…</Text>
      ) : (
        items.map((v, i) => (
          <Stack gap={3} key={i}>
            <AnchorHeading level={3} slug={slug} section={`variation-${i}`}>{v.title}</AnchorHeading>
            {v.description ? <Text tone="muted">{v.description}</Text> : null}
            <DeferOnVisible>
              <LiveExample code={v.code}>{typeof v.render === "function" ? v.render() : v.render}</LiveExample>
            </DeferOnVisible>
          </Stack>
        ))
      )}
    </Stack>
  );
}
