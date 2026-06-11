import React from "react";
import { Stack, Text } from "twico-ui";
import LiveExample from "./LiveExample.jsx";
import AnchorHeading from "./AnchorHeading.jsx";

// Per-component variation files live at src/demos/<Name>Variations.jsx and default-
// export an array of { title, description?, code, render }. They are loaded lazily.
const loaders = import.meta.glob("../demos/*Variations.jsx");
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
            <LiveExample code={v.code}>{typeof v.render === "function" ? v.render() : v.render}</LiveExample>
          </Stack>
        ))
      )}
    </Stack>
  );
}
