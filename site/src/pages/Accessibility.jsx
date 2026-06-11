import React from "react";
import { Link } from "react-router-dom";
import { Heading, Text, Stack, Code } from "twico-ui";

export default function Accessibility() {
  return (
    <Stack as="article" gap={5}>
      <Stack as="section" gap={3}>
        <Text tone="primary" size="xs" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Getting started</Text>
        <Heading level={1}>Accessibility</Heading>
        <Text size="lg" tone="muted">
          Accessibility is a core concept in Twico UI, not an afterthought. Interactive components ship
          with the ARIA roles, keyboard support, and focus management you'd expect.
        </Text>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="whats-included">What's built in</Heading>
        <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <li><strong>Modals (Dialog, Drawer)</strong> — focus moves into the modal on open, <Code>Tab</Code>/<Code>Shift+Tab</Code> are trapped inside, focus is restored to the trigger on close, and the title/description are wired via <Code>aria-labelledby</Code>/<Code>aria-describedby</Code>. <Code>Escape</Code> closes.</li>
          <li><strong>Menus &amp; dropdowns</strong> — triggers expose <Code>aria-haspopup</Code>, <Code>aria-expanded</Code>, and <Code>aria-controls</Code>, and are keyboard-operable.</li>
          <li><strong>Tabs</strong> — arrow-key navigation, roving <Code>tabindex</Code>, and proper tab ↔ panel linkage.</li>
          <li><strong>Selects &amp; comboboxes</strong> — <Code>aria-controls</Code> and <Code>aria-activedescendant</Code> so screen-reader users can track the highlighted option.</li>
          <li><strong>The Datatable</strong> — a full ARIA grid: <Code>role="grid"</Code>, sortable column headers with <Code>aria-sort</Code>, roving focus, and keyboard navigation.</li>
        </ul>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="motion">Reduced motion</Heading>
        <Text>
          Entrance animations are gated behind <Code>prefers-reduced-motion</Code> where the visible
          end-state must not depend on the animation running — so content is always present even when
          motion is disabled.
        </Text>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="focus">Focus styling</Heading>
        <Text>
          Focusable controls show a visible focus ring (driven by the <Code>--ring</Code> token), and
          text fields show focus through their bordered wrapper rather than painting a second box.
        </Text>
      </Stack>

      <Text style={{ marginTop: "var(--space-4)", fontWeight: "var(--font-semibold)" }}>
        Next: <Link to="/components" style={{ color: "var(--color-primary)", fontWeight: "var(--font-semibold)", textDecoration: "none" }}>All components →</Link>
      </Text>
    </Stack>
  );
}
