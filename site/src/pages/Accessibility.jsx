import React from "react";
import { Link } from "react-router-dom";
import { Heading, Text, Stack } from "twico-ui";

export default function Accessibility() {
  return (
    <Stack as="article" gap={5} className="docs-article">
      <Stack as="section" gap={3}>
        <Text className="docs-eyebrow" tone="primary">Getting started</Text>
        <Heading level={1}>Accessibility</Heading>
        <Text className="docs-lead" size="lg" tone="muted">
          Accessibility is a core concept in Twico UI, not an afterthought. Interactive components ship
          with the ARIA roles, keyboard support, and focus management you'd expect.
        </Text>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="whats-included">What's built in</Heading>
        <ul className="docs-list">
          <li><strong>Modals (Dialog, Drawer)</strong> — focus moves into the modal on open, <code>Tab</code>/<code>Shift+Tab</code> are trapped inside, focus is restored to the trigger on close, and the title/description are wired via <code>aria-labelledby</code>/<code>aria-describedby</code>. <code>Escape</code> closes.</li>
          <li><strong>Menus &amp; dropdowns</strong> — triggers expose <code>aria-haspopup</code>, <code>aria-expanded</code>, and <code>aria-controls</code>, and are keyboard-operable.</li>
          <li><strong>Tabs</strong> — arrow-key navigation, roving <code>tabindex</code>, and proper tab ↔ panel linkage.</li>
          <li><strong>Selects &amp; comboboxes</strong> — <code>aria-controls</code> and <code>aria-activedescendant</code> so screen-reader users can track the highlighted option.</li>
          <li><strong>The Datatable</strong> — a full ARIA grid: <code>role="grid"</code>, sortable column headers with <code>aria-sort</code>, roving focus, and keyboard navigation.</li>
        </ul>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="motion">Reduced motion</Heading>
        <Text>
          Entrance animations are gated behind <code>prefers-reduced-motion</code> where the visible
          end-state must not depend on the animation running — so content is always present even when
          motion is disabled.
        </Text>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="focus">Focus styling</Heading>
        <Text>
          Focusable controls show a visible focus ring (driven by the <code>--ring</code> token), and
          text fields show focus through their bordered wrapper rather than painting a second box.
        </Text>
      </Stack>

      <Text className="docs-next">
        Next: <Link to="/components" className="docs-link">All components →</Link>
      </Text>
    </Stack>
  );
}
